import { Plane, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/lib/use-page-meta";

export type AuthTab = "signin" | "signup";

export function AuthPage({ tab }: { tab: AuthTab }) {
  usePageMeta({
    title: "Sign in — Flight Price Notifier",
    description: "登入或註冊 Flight Price Notifier，開始追蹤機票價格。",
    ogTitle: "Sign in — Flight Price Notifier",
    ogDescription: "登入或註冊 Flight Price Notifier，開始追蹤機票價格。",
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate("/app", { replace: true });
    });
  }, [navigate]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate("/app");
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("帳號已建立，歡迎加入！");
    navigate("/app");
  };

  return (
    <div className="paper-grain relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* A band of poster sky behind the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--sky) 70%, transparent) 0%, transparent 100%)",
        }}
      />
      <Link
        to="/"
        className="relative mb-10 flex items-center gap-3 text-foreground transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 items-center justify-center bg-sea text-paper">
          <Plane className="size-4" />
        </span>
        <span className="poster-type text-xs sm:text-sm">
          Flight Price Notifier
        </span>
      </Link>

      <Card className="poster-frame relative w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl font-light uppercase tracking-[0.2em]">
            歡迎
          </CardTitle>
          <div aria-hidden className="deco-rule mx-auto mt-3 w-12" />
          <CardDescription className="pt-2">
            登入或建立帳號，開始追蹤機票價格
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(value) =>
              navigate(value === "signup" ? "/sign-up" : "/sign-in", { replace: true })
            }
          >
            <TabsList className="grid w-full grid-cols-2 bg-paper-deep">
              <TabsTrigger
                value="signin"
                className="font-display uppercase tracking-[0.18em]"
              >
                登入
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="font-display uppercase tracking-[0.18em]"
              >
                註冊
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">密碼</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-display uppercase tracking-[0.2em]"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  登入
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">密碼（至少 6 個字元）</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-display uppercase tracking-[0.2em]"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  建立帳號
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <p className="relative mt-6 text-xs text-muted-foreground">
        <Link to="/" className="underline-offset-4 hover:underline">
          ← 回到首頁
        </Link>
      </p>
    </div>
  );
}
