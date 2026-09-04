import { ArrowLeft, Loader2, Plane } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FLIGHT_API_URL } from "@/lib/flight-api";
import { usePageMeta } from "@/lib/use-page-meta";

const TOPICS = [
  { value: "sales", label: "業務洽詢 / Sales enquiry" },
  { value: "subscription", label: "訂閱問題 / Subscription" },
  { value: "refund", label: "退款 / Refund" },
  { value: "other", label: "其他 / Other" },
];

type Form = {
  topic: string;
  name: string;
  country: string;
  email: string;
  phone: string;
  message: string;
  hp: string;
};

const EMPTY: Form = { topic: "", name: "", country: "", email: "", phone: "", message: "", hp: "" };

export function ContactPage() {
  usePageMeta({
    title: "聯絡我們 · Contact us — Flight Price Notifier",
    description:
      "留下聯絡方式，我們的業務團隊會盡快與你聯繫。Leave your details and our sales team will reach out.",
  });

  const [form, setForm] = useState<Form>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.topic) {
      toast.error("請選擇來意 / Please choose a topic");
      return;
    }
    if (!form.name.trim()) {
      toast.error("請填寫姓名 / Name is required");
      return;
    }
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("Email 或電話至少填一項 / Provide at least one of email or phone");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${FLIGHT_API_URL}/contact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
      setForm(EMPTY);
    } catch {
      toast.error("送出失敗，請稍後再試 / Could not send, please try again");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
          <Link
            to="/sign-in"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            Sign in / 登入
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col px-4 py-16 sm:px-6 sm:py-24">
        <Card className="glow-card">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
              聯絡我們 · Contact us
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              留下聯絡方式，我們會盡快與你聯繫。 Leave your details and we will get back to you.
            </p>

            {sent ? (
              <div className="mt-8 rounded-lg border border-border/60 bg-muted/40 p-6 text-center">
                <p className="text-sm font-medium text-foreground">
                  已收到你的需求，我們會盡快與你聯繫。
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thanks — we have your request and will be in touch.
                </p>
                <Button variant="ghost" className="mt-4" onClick={() => setSent(false)}>
                  再送一則 / Send another
                </Button>
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="c-topic" className="text-sm font-medium">
                    來意 / Topic
                  </Label>
                  <Select
                    value={form.topic}
                    onValueChange={(v) => setForm((f) => ({ ...f, topic: v }))}
                  >
                    <SelectTrigger id="c-topic">
                      <SelectValue placeholder="請選擇 / Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="c-name" className="text-sm font-medium">
                    姓名 / Name
                  </Label>
                  <Input
                    id="c-name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="王小明 / Your name"
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="c-country" className="text-sm font-medium">
                    國家 / Country
                  </Label>
                  <Input
                    id="c-country"
                    value={form.country}
                    onChange={set("country")}
                    placeholder="台灣 / Taiwan"
                    autoComplete="country-name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="c-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="c-email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="c-phone" className="text-sm font-medium">
                    電話 / Phone
                  </Label>
                  <Input
                    id="c-phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+886 912 345 678"
                    autoComplete="tel"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email 或電話至少填一項 / Provide at least one of email or phone.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="c-message" className="text-sm font-medium">
                    需求說明 / Your request{" "}
                    <span className="font-normal text-muted-foreground">(選填 / optional)</span>
                  </Label>
                  <Textarea
                    id="c-message"
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="想詢問的航線、團隊人數、或其他需求..."
                  />
                </div>

                {/* Honeypot — hidden from people, filled by bots. */}
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={form.hp}
                  onChange={set("hp")}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                />

                <Button className="w-full" disabled={sending} onClick={() => void submit()}>
                  {sending ? <Loader2 className="animate-spin" /> : null}
                  送出需求 / Submit request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          回首頁
        </Link>
      </main>
    </div>
  );
}
