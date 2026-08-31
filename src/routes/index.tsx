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
    <div className="paper-grain min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-ink/25 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center bg-sea text-paper">
              <Plane className="size-4" />
            </span>
            <span className="poster-type text-[0.7rem] text-ink sm:text-xs">
              Flight Price Notifier
            </span>
          </Link>
          {signedIn ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-terracotta px-4 py-2 font-display text-xs font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-terracotta-deep"
            >
              <LayoutDashboard className="size-4" />
              前往儀表板
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center bg-terracotta px-4 py-2 font-display text-xs font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-terracotta-deep"
            >
              Sign in / 登入
            </Link>
          )}
        </div>
      </header>

      {/* Hero — set as a printed travel poster: keyline frame, sky-to-sea
          ground, and the title in wide-tracked geometric caps. */}
      <section className="px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="poster-frame relative mx-auto max-w-4xl overflow-hidden bg-card">
          {/* Sky and sea */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, var(--sky) 0%, color-mix(in srgb, var(--sky) 55%, var(--card)) 38%, var(--card) 58%, var(--card) 100%)",
            }}
          />
          {/* Horizon rule + a distant headland, echoing the poster's coastline */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[38%] h-px bg-sea/30"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--sea) 14%, transparent) 100%)",
            }}
          />
          {/* The keyline printed inside the poster's margin */}
          <div
            aria-hidden
            className="poster-keyline pointer-events-none absolute inset-3 sm:inset-4"
          />

          <div className="relative flex flex-col items-center px-6 pb-20 pt-16 text-center sm:px-12 sm:pb-24 sm:pt-20">
            <div className="reveal mb-8 inline-flex items-center gap-2.5 border border-ink/30 bg-paper/70 px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.22em] text-ink/75">
              <span className="size-1.5 rounded-full bg-terracotta" />
              台北出發・熱門航線監控中
            </div>

            <p className="reveal poster-type text-[0.7rem] text-ink/70 sm:text-sm">
              Flight Price
            </p>
            <h1
              className="reveal mt-2 font-display text-5xl font-light uppercase leading-none tracking-[0.14em] text-ink sm:text-7xl"
              style={{ animationDelay: "0.05s" }}
            >
              Notifier
            </h1>

            <div className="reveal deco-rule mt-8 w-24" style={{ animationDelay: "0.1s" }} />

            <p
              className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl"
              style={{ animationDelay: "0.15s" }}
            >
              設定航線與目標價，機票降價就通知你
            </p>
            <p
              className="reveal mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base"
              style={{ animationDelay: "0.2s" }}
            >
              Set a route and a target price — we email you when the fare drops.
            </p>

            <div className="reveal mt-10" style={{ animationDelay: "0.25s" }}>
              <Link
                to="/sign-in"
                className="group inline-flex items-center gap-3 bg-terracotta px-8 py-3.5 font-display text-sm font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-terracotta-deep"
              >
                開始追蹤票價
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-ink/15">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="reveal poster-type text-center text-[0.65rem] text-terracotta">
            Why subscribe
          </p>
          <h2 className="reveal mt-4 text-center font-display text-3xl font-light uppercase tracking-[0.12em] text-ink sm:text-4xl">
            為預算導向的旅客而設計
          </h2>
          <p className="reveal mt-4 text-center text-sm text-muted-foreground sm:text-base">
            不在乎什麼時候飛，只要票價低於預算。
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className="reveal glow-card bg-card p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="inline-flex size-11 items-center justify-center bg-sea text-paper">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-6 font-display text-xl font-medium tracking-[0.06em] text-ink">
                  {feature.title}
                </h3>
                <p className="mt-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] text-terracotta">
                  {feature.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/15 bg-paper-deep/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-12 text-center sm:px-6">
          <div className="deco-rule w-16" />
          <div className="flex items-center gap-2.5 pt-1">
            <Plane className="size-4 text-terracotta" />
            <span className="poster-type text-[0.65rem] text-ink">
              Flight Price Notifier
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Flight Price Notifier
          </p>
        </div>
      </footer>
    </div>
  );
}
