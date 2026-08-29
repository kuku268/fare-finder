import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plane, LogOut, Bell } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Dashboard — Flight Price Notifier" },
      { name: "description", content: "你的航線追蹤儀表板。" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppDashboard,
});

function AppDashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
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

        <Card className="glow-card mt-8 max-w-2xl animate-fade-up">
          <CardContent className="flex flex-col items-start gap-4 p-8">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
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
