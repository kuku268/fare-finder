import { Plane, Bell, CalendarX2, ArrowRight, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useReveal } from "@/hooks/use-reveal";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/lib/use-page-meta";

const features = [
  {
    icon: Plane,
    title: "盯緊熱門航線",
    subtitle: "Always-on route watching",
    description: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  },
  {
    icon: Bell,
    title: "達標自動通知",
    subtitle: "Target-price email alerts",
    description: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  },
  {
    icon: CalendarX2,
    title: "隨時取消",
    subtitle: "Cancel anytime",
    description: "月訂閱制，不想用隨時停，沒有綁約。",
  },
];

export function LandingPage() {
  usePageMeta({
    title: "Flight Price Notifier — 機票降價通知",
    description:
      "設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.",
    ogTitle: "Flight Price Notifier — 機票降價通知",
    ogDescription:
      "設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.",
  });
  useReveal();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              Flight Price Notifier
            </span>
          </Link>
          <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-flex"
          >
            Contact Sale / 聯絡業務
          </Link>
          {signedIn ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_-4px_var(--color-glow)]"
            >
              <LayoutDashboard className="size-4" />
              前往儀表板
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_-4px_var(--color-glow)]"
            >
              Sign in / 登入
            </Link>
          )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, var(--color-glow) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-24 text-center sm:px-6 sm:pb-32 sm:pt-32">
          <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            台北出發・熱門航線監控中
          </div>
          <h1 className="reveal text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Flight Price <span className="gradient-text">Notifier</span>
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            設定航線與目標價，機票降價就通知你
          </p>
          <p
            className="reveal mt-3 max-w-2xl text-sm text-muted-foreground/80 sm:text-base"
            style={{ animationDelay: "0.15s" }}
          >
            Set a route and a target price — we email you when the fare drops.
          </p>
          <div className="reveal mt-10" style={{ animationDelay: "0.2s" }}>
            <Link
              to="/sign-in"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_32px_-4px_var(--color-glow)]"
            >
              開始追蹤票價
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h2 className="reveal text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            為預算導向的旅客而設計
          </h2>
          <p className="reveal mt-3 text-center text-sm text-muted-foreground sm:text-base">
            不在乎什麼時候飛，只要票價低於預算。
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className="reveal glow-card rounded-2xl bg-card p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-primary">
                  {feature.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-center sm:px-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Plane className="size-4 text-primary" />
            Flight Price Notifier
          </div>
          <Link
            to="/terms"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            服務條款與退款政策
          </Link>
          <p className="text-xs text-muted-foreground/70">
            © 2026 Flight Price Notifier
          </p>
        </div>
      </footer>
    </div>
  );
}
