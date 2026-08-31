import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Plane } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listSubscriptions,
  saveSubscription,
  type PlanName,
  type Subscription,
} from "@/lib/flight-api";

type Plan = {
  name: PlanName;
  label: string;
  route: string;
  /** Rough current cheapest fare, shown so people pick a realistic budget. */
  hint: number;
};

const PLANS: Plan[] = [
  { name: "tokyo", label: "台北 ✈ 東京", route: "TPE-TYO", hint: 7164 },
  { name: "seoul", label: "台北 ✈ 首爾", route: "TPE-SEL", hint: 4303 },
  { name: "london", label: "台北 ✈ 倫敦", route: "TPE-LON", hint: 24473 },
];

const twd = new Intl.NumberFormat("zh-TW");

export function SubscribePlans({ email }: { email: string }) {
  const [subs, setSubs] = useState<Subscription[] | null>(null);
  const [drafts, setDrafts] = useState<Record<PlanName, string>>({ tokyo: "", seoul: "", london: "" });
  const [saving, setSaving] = useState<PlanName | null>(null);

  const byPlan = useMemo(() => {
    const map = {} as Partial<Record<PlanName, Subscription>>;
    for (const s of subs ?? []) map[s.plan_name] = s;
    return map;
  }, [subs]);

  useEffect(() => {
    let cancelled = false;
    listSubscriptions(email)
      .then((items) => {
        if (cancelled) return;
        setSubs(items);
        setDrafts((d) => {
          const next = { ...d };
          for (const item of items) next[item.plan_name] = String(item.target_price);
          return next;
        });
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

  const handleSubmit = async (plan: Plan) => {
    const target = Number(drafts[plan.name]);
    if (!Number.isFinite(target) || target <= 0) {
      toast.error("請輸入有效的目標價（NT$）");
      return;
    }
    setSaving(plan.name);
    try {
      const saved = await saveSubscription({
        email,
        plan_name: plan.name,
        target_price: Math.round(target),
      });
      setSubs((prev) => [
        ...(prev ?? []).filter((s) => s.plan_name !== plan.name),
        { ...saved, plan_name: plan.name },
      ]);
      toast.success(`已開始追蹤 ${plan.label}`, {
        description: `低於 NT$${twd.format(Math.round(target))} 就寄信通知你。`,
      });
    } catch (err) {
      toast.error("儲存失敗", { description: String(err) });
    } finally {
      setSaving(null);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">追蹤航線</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        設定目標價，價格低於目標時我們會寄信通知你（每 30 分鐘檢查一次）。
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const sub = byPlan[plan.name];
          const busy = saving === plan.name;
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
                  {sub ? (
                    <Badge variant="secondary" className="shrink-0 gap-1">
                      <Check className="size-3" />
                      已訂閱
                    </Badge>
                  ) : null}
                </div>

                {sub ? (
                  <p className="text-sm text-muted-foreground">
                    目前目標價 <span className="font-medium text-foreground">NT${twd.format(sub.target_price)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    目前最低約 NT${twd.format(plan.hint)}
                  </p>
                )}

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
                  disabled={busy || subs === null}
                  onClick={() => void handleSubmit(plan)}
                >
                  {busy ? <Loader2 className="animate-spin" /> : null}
                  {sub ? "更新目標價" : "開始追蹤"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
