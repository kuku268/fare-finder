import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage } from "@/lib/auth-errors";
import { usePageMeta } from "@/lib/use-page-meta";

import { AuthShell } from "./forgot-password";

type Status = "checking" | "ready" | "invalid";

export function ResetPasswordPage() {
  usePageMeta({
    title: "設定新密碼 — Flight Price Notifier",
    description: "設定你的 Flight Price Notifier 新密碼。",
    ogTitle: "設定新密碼 — Flight Price Notifier",
    ogDescription: "設定你的 Flight Price Notifier 新密碼。",
  });
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // The recovery link lands here with tokens in the URL; supabase-js turns
    // them into a session automatically (detectSessionInUrl).
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      setStatus("invalid");
      return undefined;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        setStatus("ready");
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("ready");
    });
    const timer = window.setTimeout(() => {
      setStatus((s) => (s === "checking" ? "invalid" : s));
    }, 5000);
    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("兩次輸入的密碼不一樣。");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    toast.success("密碼已更新！");
    navigate("/app", { replace: true });
  };

  return (
    <AuthShell>
      <Card className="relative w-full max-w-md glow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">設定新密碼</CardTitle>
          <CardDescription>請輸入你的新密碼</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "checking" && (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          )}
          {status === "invalid" && (
            <div className="space-y-4 text-center text-sm">
              <p>這個重設連結已失效或已使用過。</p>
              <Button className="w-full" asChild>
                <Link to="/forgot-password">重新寄送重設密碼信</Link>
              </Button>
            </div>
          )}
          {status === "ready" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">新密碼（至少 6 個字元）</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">再輸入一次</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                更新密碼
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthShell>
  );
}
