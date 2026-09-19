import { useEffect, useMemo, useState } from "react";
import { Check, Clock, CreditCard, Loader2, Plane, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TERMS_VERSION } from "@/lib/terms-version";
import {
  cancelSubscription,
  listSubscriptions,
  saveSubscription,
  type PlanName,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/flight-api";

type Plan = {
  name: PlanName;
  label: string;
  route: string;
  /** Rough current cheapest fare, shown so people pick a realistic budget. */
  hint: number;
};

const PLANS: Plan[] = [
  { name: "tokyo", label: "台北 ✈ 東京", route: "TPE-TYO", hint: 6410 },
  { name: "seoul", label: "台北 ✈ 首爾", route: "TPE-SEL", hint: 4701 },
  { name: "london", label: "台北 ✈ 倫敦", route: "TPE-LON", hint: 20388 },
  { name: "bangkok", label: "台北 ✈ 曼谷", route: "TPE-BKK", hint: 6398 },
];

const MONTHLY_TWD = 200;

const twd = new Intl.NumberFormat("zh-TW");

/**
 * Legacy M1 rows have no `subscription_status`. They predate the paywall and
 * are no longer alerted, so surface them the same as an unpaid signup — the
 * user self-migrates by paying rather than having their row deleted.
 */
function statusOf(sub: Subscription | undefined): SubscriptionStatus | null {
  if (!sub) return null;
  return sub.subscription_status ?? "pending_payment";
}

/**
 * Status pill. Deliberately terse — the paid-through date is spelled out in the
 * note below the price, so repeating it here only made the badge overflow the
 * card on narrow columns.
 */
function StatusBadge({ status }: { status: SubscriptionStatus }) {
  if (status === "active") {
    return (
      <Badge variant="secondary" className="shrink-0 gap-1 whitespace-nowrap">
        <Check className="size-3" />
        已訂閱
      </Badge>
    );
  }
  if (status === "pending_payment") {
    return (
      <Badge
        variant="outline"
        className="shrink-0 gap-1 whitespace-nowrap border-amber-500/50 text-amber-600 dark:text-amber-400"
      >
        <Clock className="size-3" />
        未完成付款
      </Badge>
    );
  }
  if (status === "cancelled") {
    return (
      <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
        <XCircle className="size-3" />
        已取消
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap text-muted-foreground">
      已結束
    </Badge>
  );
}

export function SubscribePlans({ email }: { email: string }) {
  const [subs, setSubs] = useState<Subscription[] | null>(null);
  const [drafts, setDrafts] = useState<Record<PlanName, string>>({
    tokyo: "",
    seoul: "",
    london: "",
    bangkok: "",
  });
  const [saving, setSaving] = useState<PlanName | null>(null);
  const [cancelling, setCancelling] = useState<PlanName | null>(null);
  /**
   * Consent to immediate provisioning. Gates every card whose CTA would start a
   * checkout — NOT "更新目標價", which charges nothing. Deliberately unchecked on
   * mount and never persisted: a pre-ticked box is not 事先同意.
   */
  const [consent, setConsent] = useState(false);
  /** Briefly rings the consent box when someone tries to pay without ticking it. */
  const [nudgeConsent, setNudgeConsent] = useState(false);

  const pointToConsent = () => {
    const box = document.getElementById("terms-consent");
    box?.scrollIntoView({ behavior: "smooth", block: "center" });
    box?.focus({ preventScroll: true });
    setNudgeConsent(true);
    window.setTimeout(() => setNudgeConsent(false), 1600);
  };

  const byPlan = useMemo(() => {
    const map = {} as Partial<Record<PlanName, Subscription>>;
    for (const s of subs ?? []) map[s.plan_name] = s;
    return map;
  }, [subs]);

  const applyItems = (items: Subscription[]) => {
    setSubs(items);
    setDrafts((d) => {
      const next = { ...d };
      for (const item of items) next[item.plan_name] = String(item.target_price);
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    listSubscriptions(email)
      .then((items) => {
        if (cancelled) return;
        applyItems(items);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setSubs([]);
        toast.error("讀取訂閱失敗", { description: String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  // ECPay returns the browser here (via the redirect Lambda) after checkout.
  useEffect(() => {
    const purchase = new URLSearchParams(window.location.search).get("purchase");
    if (!purchase) return;
    if (purchase === "success") {
      toast.success("付款完成！", { description: "訂閱已啟用，達標時就會寄信通知你。" });
    } else {
      toast.error("付款未完成", { description: "沒有扣款。可以再按一次「完成付款」重試。" });
    }
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const handleSubmit = async (plan: Plan) => {
    const target = Number(drafts[plan.name]);
    if (!Number.isFinite(target) || target <= 0) {
      toast.error("請輸入有效的目標價（NT$）");
      return;
    }
    // Paid rows only update the target price in place, so no consent is needed;
    // everything else hands the browser to ECPay and does need it.
    const status = statusOf(byPlan[plan.name]);
    const needsCheckout = status !== "active" && status !== "cancelled";
    if (needsCheckout && !consent) {
      toast.error("請先勾選上方的同意事項", {
        description: "付款前需要你確認同意立即開通、且當期不適用七日猶豫期。",
      });
      pointToConsent();
      return;
    }
    setSaving(plan.name);
    try {
      // Returns null when it has handed the browser to ECPay's cashier.
      const saved = await saveSubscription(
        needsCheckout
          ? {
              email,
              plan_name: plan.name,
              target_price: Math.round(target),
              terms_version: TERMS_VERSION,
              consent_at: new Date().toISOString(),
            }
          : { email, plan_name: plan.name, target_price: Math.round(target) },
      );
      if (!saved) return;
      setSubs((prev) => [
        ...(prev ?? []).filter((s) => s.plan_name !== plan.name),
        { ...saved, plan_name: plan.name },
      ]);
      toast.success(`已更新 ${plan.label}`, {
        description: `低於 NT$${twd.format(Math.round(target))} 就寄信通知你。`,
      });
    } catch (err) {
      toast.error("儲存失敗", { description: String(err) });
    } finally {
      setSaving(null);
    }
  };

  const handleCancel = async (plan: Plan) => {
    setCancelling(plan.name);
    try {
      const res = await cancelSubscription(email, plan.route);
      const items = await listSubscriptions(email);
      applyItems(items);
      toast.success(`已取消 ${plan.label}`, {
        description: res.current_period_end_date
          ? `有效至 ${res.current_period_end_date}，在那之前仍會收到通知。`
          : "之後不會再自動扣款。",
      });
    } catch (err) {
      toast.error("取消失敗", { description: String(err) });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">追蹤航線</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        月訂閱 NT${twd.format(MONTHLY_TWD)}，設定目標價後約每 30 分鐘檢查一次，低於目標就寄信通知你。隨時可取消。
      </p>

      <div className="mt-4 rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">訂閱前請先了解</p>
        <ul className="mt-2 space-y-2">
          <li>
            本服務<strong className="font-medium text-foreground">只提供來回票價比較與通知，不販售、也不代訂機票</strong>。
          </li>
          <li>
            <strong className="font-medium text-foreground">我們不審核、也不背書這些訂票平台</strong>
            的營運狀況、退改票政策、客服品質或交易安全。
          </li>
          <li>
            請注意，<strong className="font-medium text-foreground">有些票價不含託運行李與其他附加費用</strong>，
            請自行去訂票頁勾選比較。實際應付金額以訂票頁面為準。
          </li>
        </ul>
        <p className="mt-3">
          完整內容請見{" "}
          <Link to="/terms" className="text-primary underline underline-offset-4">
            服務條款與退款政策
          </Link>
          。
        </p>

        <div
          className={`mt-4 flex items-start gap-2.5 rounded-md border bg-background p-3 transition-shadow ${
            nudgeConsent ? "border-primary ring-2 ring-primary/40" : "border-border/60"
          }`}
        >
          <Checkbox
            id="terms-consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            className="mt-0.5"
            aria-describedby="terms-consent-note"
          />
          <div className="space-y-1">
            <Label
              htmlFor="terms-consent"
              className="cursor-pointer text-xs font-normal leading-relaxed text-foreground"
            >
              我已閱讀並同意{" "}
              <Link
                to="/terms"
                className="text-primary underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                服務條款與退款政策
              </Link>
              ，並同意本服務於付款完成後
              <strong className="font-medium">立即開通</strong>；
              我了解依《通訊交易解除權合理例外情事適用準則》第 2 條第 5 款，
              <strong className="font-medium">當期費用不適用七日猶豫期之無條件解除權</strong>。
            </Label>
            <p id="terms-consent-note" className="text-[11px] text-muted-foreground">
              勾選後才能前往付款。已在付費中的航線調整目標價不需勾選，也不會重複扣款。
            </p>
          </div>
        </div>
      </div>

      {/* 4-up from lg. Safe now that the route name has its own full-width row —
          it was the badge sharing that row that used to break it mid-word. */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const sub = byPlan[plan.name];
          const status = statusOf(sub);
          const busy = saving === plan.name;
          const busyCancel = cancelling === plan.name;
          const paid = status === "active" || status === "cancelled";

          // Everything that is not already paid goes through ECPay.
          const needsConsent = !paid;
          const cta = paid
            ? "更新目標價"
            : status === "pending_payment"
              ? "完成付款"
              : status === "expired"
                ? "重新訂閱"
                : "開始追蹤";

          // h-full + mt-auto on the input block keeps every card's target field
          // and CTA on the same line, however long the status note above is.
          return (
            <Card key={plan.name} className="glow-card animate-fade-up h-full">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                {/* Icon and badge share the top row; the route name gets the full
                    card width below them, so it never wraps against the badge. */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Plane className="size-4" />
                    </span>
                    {status ? <StatusBadge status={status} /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-card-foreground">
                      {plan.label}
                    </p>
                    <p className="text-xs tracking-wide text-muted-foreground">{plan.route}</p>
                  </div>
                </div>

                {/* The saved target moved next to the input's label (below) — as its
                    own row it just repeated the number already in the input. */}
                {!sub ? (
                  <p className="text-sm text-muted-foreground">
                    目前最低約{" "}
                    <span className="font-medium text-foreground">NT${twd.format(plan.hint)}</span>
                  </p>
                ) : null}

                {status === "pending_payment" ? (
                  <p className="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                    請勾選以上同意政策後再按「完成付款」
                  </p>
                ) : null}

                {status === "cancelled" && sub?.current_period_end_date ? (
                  <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                    已停止自動續扣，在 {sub.current_period_end_date} 之前仍會照常收到通知。
                  </p>
                ) : null}

                <div className="mt-auto flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <Label htmlFor={`target-${plan.name}`} className="text-xs text-muted-foreground">
                      目標價（NT$）
                    </Label>
                    {sub ? (
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        目前{" "}
                        <span className="font-medium text-foreground">
                          NT${twd.format(sub.target_price)}
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id={`target-${plan.name}`}
                    inputMode="numeric"
                    placeholder={String(plan.hint)}
                    value={drafts[plan.name]}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [plan.name]: e.target.value.replace(/[^0-9]/g, "") }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Button
                    className="w-full"
                    // Not disabled for missing consent: the consent flag resets on every
                    // page load (e.g. back from ECPay), and a greyed-out 完成付款 with no
                    // explanation read as a dead end. Clicking points at the checkbox.
                    disabled={busy || busyCancel || subs === null}
                    onClick={() => void handleSubmit(plan)}
                  >
                    {busy ? <Loader2 className="animate-spin" /> : null}
                    {!paid ? <CreditCard className="size-4" /> : null}
                    {cta}
                  </Button>

                  {paid ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      disabled={busy || busyCancel || status === "cancelled"}
                      onClick={() => void handleCancel(plan)}
                    >
                      {busyCancel ? <Loader2 className="animate-spin" /> : null}
                      {status === "cancelled" ? "已取消" : "取消訂閱"}
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
