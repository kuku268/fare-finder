import { ArrowLeft, Plane } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePageMeta } from "@/lib/use-page-meta";

const SUPPORT_EMAIL = "support@viaoneway.com";
const MONTHLY_TWD = 300;

const ROUTES = [
  { label: "台北 ✈ 東京", code: "TPE-TYO" },
  { label: "台北 ✈ 首爾", code: "TPE-SEL" },
  { label: "台北 ✈ 倫敦", code: "TPE-LON" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border/60 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function TermsPage() {
  usePageMeta({
    title: "服務條款與退款政策 — Flight Price Notifier",
    description:
      "Flight Price Notifier 機票票價通知服務的服務內容、訂閱費用與週期、取消續訂方式、退款政策與客服聯絡方式。",
  });

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
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
            回首頁
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          服務條款與退款政策
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          最後更新：2026 年 9 月 4 日
        </p>

        <div className="mt-10">
          <Section id="service" title="一、服務內容">
            <p>
              「Flight Price Notifier（機票票價通知服務）」是一項<strong className="text-foreground">數位訂閱服務</strong>。
              我們持續監控指定航線的機票票價，當票價低於你自行設定的目標價時，以 Email 通知你，
              並附上前往訂票的連結。
            </p>
            <p>
              <strong className="text-foreground">本服務不販售機票、不代訂機票、不收取任何票款。</strong>
              票價資料取自第三方票價來源，僅供參考；實際票價、艙等與可訂購狀態，以航空公司或訂票平台當下顯示為準。
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                可監控航線：
                {ROUTES.map((r) => `${r.label}（${r.code}）`).join("、")}
              </li>
              <li>監控條件：由你設定的目標價（新台幣），票價低於或等於該金額即觸發通知</li>
              <li>檢查頻率：系統每 30 分鐘自動檢查一次</li>
              <li>通知方式：Email（寄件人 alerts@flymail.viaoneway.com）</li>
              <li>
                為避免重複打擾，同一航線在 24 小時內只通知一次；若票價再大幅下跌（降幅逾 20% 或逾
                NT$2,000），會再通知一次
              </li>
            </ul>
          </Section>

          <Section id="pricing" title="二、費用與訂閱週期">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                訂閱費用：<strong className="text-foreground">新台幣 {MONTHLY_TWD} 元／月</strong>
                （含稅）
              </li>
              <li>訂閱週期：<strong className="text-foreground">每月一期，自動續扣</strong></li>
              <li>
                付款方式：信用卡定期定額，由
                <strong className="text-foreground">綠界科技股份有限公司（ECPay）</strong>
                代為收款與處理扣款
              </li>
              <li>
                首次付款成功後服務立即開通；之後每月於同一週期自動扣款一次，直到你主動取消為止
              </li>
              <li>
                本服務<strong className="text-foreground">不保存你的信用卡號、有效期限或安全碼</strong>，
                刷卡資料全程由綠界處理
              </li>
            </ul>
          </Section>

          <Section id="cancel" title="三、取消續訂方式">
            <p>你可以隨時自行取消，沒有綁約、沒有最低訂閱期間。</p>
            <ol className="ml-5 list-decimal space-y-1">
              <li>登入本網站後，進入儀表板的「追蹤航線」區塊</li>
              <li>在要停止的航線卡片上點選「取消訂閱」</li>
              <li>系統會即時向綠界送出停止定期定額的指令，下一期起不再扣款</li>
            </ol>
            <p>
              取消後，<strong className="text-foreground">你已付費的當期服務會持續到期末</strong>，
              期間仍會照常收到票價通知；期末之後訂閱自動結束。
              若你在操作上遇到困難，也可以來信 {SUPPORT_EMAIL} 由我們協助取消。
            </p>
          </Section>

          <Section id="refund" title="四、退款政策">
            <p>
              本服務為<strong className="text-foreground">數位訂閱服務，於付款完成後即時開通並持續提供</strong>，
              因此<strong className="text-foreground">已扣款之當期費用不提供退款</strong>。
            </p>
            <p>
              取而代之的是：你可以<strong className="text-foreground">隨時取消續訂</strong>，
              取消後不再產生任何費用，而已付費的當期服務仍會提供至期末，不會因為取消而中斷。
            </p>
            <p>
              若發生重複扣款、金額錯誤等付款異常，請來信 {SUPPORT_EMAIL}，
              我們會查證後全額退還。
            </p>
          </Section>

          <Section id="limits" title="五、服務限制與免責">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                票價由第三方資料來源提供，可能有延遲或快取；
                <strong className="text-foreground">不保證通知當下該票價仍可訂購</strong>
              </li>
              <li>
                若該航線於監控期間沒有票價低於你設定的目標價，
                <strong className="text-foreground">可能整期都不會收到通知</strong>，
                這屬於服務正常運作，不構成退款事由
              </li>
              <li>
                顯示的票價<strong className="text-foreground">有些不含託運行李與其他附加費用</strong>，
                請自行審酌；實際應付金額以訂票頁面為準
              </li>
              <li>
                本服務<strong className="text-foreground">不審核、也不背書</strong>
                通知信中出現的訂票平台之營運狀況、退改票政策、客服品質或交易安全。
                下單前請自行確認賣方的可靠性與退改規則；與訂票平台之間的交易爭議，
                請直接向該平台或發卡機構處理
              </li>
              <li>Email 是否送達可能受你的信箱服務商、垃圾信規則影響</li>
              <li>本服務不保證票價會下跌，也不對你依通知所做的訂票決定負責</li>
            </ul>
          </Section>

          <Section id="privacy" title="六、個人資料">
            <p>
              我們僅蒐集你的 Email 與你設定的航線、目標價，用途限於提供本服務（帳號登入與票價通知）。
              我們不會將你的資料販售或提供給與本服務無關的第三方。
              你可以隨時來信 {SUPPORT_EMAIL} 要求查詢或刪除你的資料。
            </p>
          </Section>

          <Section id="contact" title="七、客服聯絡方式">
            <p>
              客服信箱：
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-primary underline underline-offset-4"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p>服務時間：週一至週五 10:00–18:00（台灣時間）。我們會在 7 個工作日內回覆。</p>
            <p>網站：https://fly.viaoneway.com</p>
          </Section>
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-center sm:px-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Plane className="size-4 text-primary" />
            Flight Price Notifier
          </div>
          <p className="text-xs text-muted-foreground/70">© 2026 Flight Price Notifier</p>
        </div>
      </footer>
    </div>
  );
}
