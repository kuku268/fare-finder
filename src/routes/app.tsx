import { useQueryClient } from "@tanstack/react-query";
import { Plane, LogOut } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { SubscribePlans } from "@/components/subscribe-plans";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              Flight Price Notifier
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Hi {user.email}
        </h1>

        <SubscribePlans email={user.email ?? ""} />
      </main>
    </div>
  );
}
