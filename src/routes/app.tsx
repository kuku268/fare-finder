import { useQueryClient } from "@tanstack/react-query";
import { Plane, LogOut, Bell } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/lib/use-page-meta";

import type { requireAuthLoader } from "./require-auth";

export function AppDashboard() {
  usePageMeta({
    title: "Dashboard — Flight Price Notifier",
    description: "你的航線追蹤儀表板。",
    robots: "noindex",
  });
  const { user } = useLoaderData() as Awaited<ReturnType<typeof requireAuthLoader>>;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="paper-grain flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-ink/25 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center bg-sea text-paper">
              <Plane className="size-4" />
            </span>
            <span className="poster-type text-[0.7rem] text-ink sm:text-xs">
              Flight Price Notifier
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-display uppercase tracking-[0.18em]"
            onClick={handleSignOut}
          >
            <LogOut />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12 sm:px-6">
        <p className="poster-type text-[0.65rem] text-terracotta">Dashboard</p>
        <h1 className="mt-3 font-display text-3xl font-light tracking-[0.08em] text-ink sm:text-4xl">
          Hi {user.email}
        </h1>
        <div aria-hidden className="deco-rule mt-6 w-20" />

        <Card className="glow-card mt-10 max-w-2xl animate-fade-up bg-card">
          <CardContent className="flex flex-col items-start gap-4 p-8">
            <span className="inline-flex size-11 items-center justify-center bg-sea text-paper">
              <Bell className="size-5" />
            </span>
            <p className="text-base leading-relaxed text-card-foreground">
              你的航線追蹤儀表板即將上線——下一個里程碑會加上訂閱航線的功能。
            </p>
            <p className="text-sm text-muted-foreground">
              Your dashboard is coming soon. Route-subscription will be added in
              the next milestone.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
