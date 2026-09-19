import { Loader2, Plane } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
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

export function ForgotPasswordPage() {
  usePageMeta({
    title: "忘記密碼 — Flight Price Notifier",
    description: "重設你的 Flight Price Notifier 密碼。",
    ogTitle: "忘記密碼 — Flight Price Notifier",
    ogDescription: "重設你的 Flight Price Notifier 密碼。",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell>
      <Card className="relative w-full max-w-md glow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">忘記密碼</CardTitle>
          <CardDescription>
            輸入註冊時的 Email，我們會寄一封重設密碼的信給你
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center text-sm">
              <p>
                如果 <span className="font-medium">{email}</span>{" "}
                有註冊過，重設密碼的信已寄出。
              </p>
              <p className="text-muted-foreground">
                請到信箱點信中的連結設定新密碼（也請檢查垃圾郵件匣）。
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/sign-in">回到登入</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                寄送重設密碼信
              </Button>
              <p className="text-center text-sm">
                <Link
                  to="/sign-in"
                  className="text-muted-foreground underline-offset-4 hover:underline"
                >
                  想起來了？回到登入
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthShell>
  );
}

/** Shared background + logo used by the password pages. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, var(--color-glow) 0%, transparent 70%)",
        }}
      />
      <Link
        to="/"
        className="relative mb-8 flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Plane className="size-4" />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Flight Price Notifier
        </span>
      </Link>
      {children}
    </div>
  );
}
