import { useEffect, useMemo, useState } from "react";
import { Check, Clock, CreditCard, Loader2, Plane, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
];

const MONTHLY_TWD = 300;

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

function StatusBadge({ status, until }: { status: SubscriptionStatus; until?: string | undefined }) {
  if (status === "active") {
    return (
      <Badge variant="secondary" className="shrink-0 gap-1">
        <Check className="size-3" />
        已訂閱
      </Badge>
    );
  }
  if (status === "pending_payment") {
    return (
      <Badge
        variant="outline"
        className="shrink-0 gap-1 border-amber-500/50 text-amber-600 dark:text-amber-400"
      >
        <Clock className="size-3" />
        未完成付款
      </Badge>
    );
  }
  if (status === "cancelled") {
    return (
      <Badge variant="outline" className="shrink-0 gap-1">
        <XCircle className="size-3" />
        已取消{until ? `・有效至 ${until}` : ""}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="shrink-0 gap-1 text-muted-foreground">
      已結束
    </Badge>
  );
}

export function SubscribePlans({ email }: { email: string }) {
  const [subs, setSubs] = useState<Subscription[] | null>(null);
  const [drafts, setDrafts] = useState<Record<PlanName, string>>({ tokyo: "", seoul: "", london: "" });
  const [saving, setSaving] = useState<PlanName | null>(null);
  const [cancelling, setCancelling] = useState<PlanName | null>(null);

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
    setSaving(plan.name);
    try {
      // Returns null when it has handed the browser to ECPay's cashier.
      const saved = await saveSubscription({
        email,
        plan_name: plan.name,
        target_price: Math.round(target),
      });
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
        月訂閱 NT${twd.format(MONTHLY_TWD)}，設定目標價後每 30 分鐘檢查一次，低於目標就寄信通知你。隨時可取消。
      </p>

      <div className="mt-4 rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">訂閱前請先了解</p>
        <ul className="mt-2 space-y-2">
          <li>
            本服務<strong className="font-medium text-foreground">只提供票價比較與通知，不販售、也不代訂機票</strong>。
            通知信中的連結會把你導向第三方機票搜尋平台，實際售票者是其上架的各家訂票平台。
          </li>
          <li>
            <strong className="font-medium text-foreground">我們不審核、也不背書這些訂票平台</strong>
            的營運狀況、退改票政策、客服品質或交易安全。下單前請自行確認賣方的可靠性與退改規則；
            與訂票平台之間的交易爭議，請直接向該平台或發卡機構處理。
          </li>
          <li>
            請注意，<strong className="font-medium text-foreground">有些票價不含託運行李與其他附加費用</strong>，
            請自行審酌。實際應付金額以訂票頁面為準。
          </li>
        </ul>
        <p className="mt-3">
          完整內容請見{" "}
          <Link to="/terms" className="text-primary underline underline-offset-4">
            服務條款與退款政策
          </Link>
          。
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const sub = byPlan[plan.name];
          const status = statusOf(sub);
          const busy = saving === plan.name;
          const busyCancel = cancelling === plan.name;
          const paid = status === "active" || status === "cancelled";

          const cta = paid
            ? "更新目標價"
            : status === "pending_payment"
              ? "完成付款"
              : status === "expired"
                ? "重新訂閱"
                : "開始追蹤";

          return (
            <Card key={plan.name} className="glow-card animate-fade-up">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Plane className="size-4" />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-card-foreground">{plan.label}</p>
                      <p className="text-xs text-muted-foreground">{plan.route}</p>
                    </div>
                  </div>
                  {status ? <StatusBadge status={status} until={sub?.current_period_end_date} /> : null}
                </div>

                {sub ? (
                  <p className="text-sm text-muted-foreground">
                    目前目標價{" "}
                    <span className="font-medium text-foreground">NT${twd.format(sub.target_price)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">目前最低約 NT${twd.format(plan.hint)}</p>
                )}

                {status === "pending_payment" ? (
                  <p className="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                    尚未完成付款，目前不會收到通知。按「完成付款」前往綠界，月費 NT${twd.format(MONTHLY_TWD)}。
                  </p>
                ) : null}

                {status === "cancelled" && sub?.current_period_end_date ? (
                  <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                    已停止自動續扣，但你已付費至 {sub.current_period_end_date}，在那之前仍會照常收到通知。
                  </p>
                ) : null}

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`target-${plan.name}`} className="text-xs text-muted-foreground">
                    目標價（NT$）
                  </Label>
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

                <Button
                  className="w-full"
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
