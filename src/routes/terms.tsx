import { ArrowLeft, Plane } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { TERMS_UPDATED_LABEL } from "@/lib/terms-version";
import { usePageMeta } from "@/lib/use-page-meta";

const MONTHLY_TWD = 200;
const SUPPORT_EMAIL = "support@flymail.viaoneway.com";

const ROUTES = [
  { label: "台北 ✈ 東京", code: "TPE-TYO" },
  { label: "台北 ✈ 首爾", code: "TPE-SEL" },
  { label: "台北 ✈ 倫敦", code: "TPE-LON" },
  { label: "台北 ✈ 曼谷", code: "TPE-BKK" },
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

function SupportEmail() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="font-medium text-primary underline underline-offset-4"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

export function TermsPage() {
  usePageMeta({
    title: "服務條款與退款政策 — Flight Price Notifier",
    description:
      "Flight Price Notifier 機票票價通知服務的服務內容、訂閱費用與週期、取消續訂方式、退款政策、個人資料告知事項與客服聯絡方式。",
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
          最後更新：{TERMS_UPDATED_LABEL}
        </p>

        <div className="mt-10">
          <Section id="service" title="一、服務內容">
            <p>
              「Flight Price Notifier（機票票價通知服務）」是一項<strong className="text-foreground">數位訂閱服務</strong>：
              我們持續監控指定航線的來回票價，低於你設定的目標價時以 Email 通知你，並附上訂票連結。
            </p>
            <p>
              <strong className="text-foreground">本服務不販售機票、不代訂機票、不收取任何票款。</strong>
              票價取自第三方來源，僅供參考；實際票價、艙等與可訂購狀態，以航空公司或訂票平台當下顯示為準。
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                可監控航線：
                {ROUTES.map((r) => `${r.label}（${r.code}）`).join("、")}
              </li>
              <li>觸發條件：票價低於或等於你設定的目標價（新台幣）</li>
              <li>
                檢查頻率：<strong className="text-foreground">通常每 30 分鐘</strong>一次，
                得因維護、資料來源異常或其他技術因素調整
              </li>
              <li>通知方式：Email（寄件人 alerts@flymail.viaoneway.com）</li>
              <li>為避免重複打擾，通知頻率由系統依降幅與間隔自動判定，我們得視服務品質調整</li>
            </ul>
          </Section>

          <Section id="pricing" title="二、費用、訂閱週期與契約成立">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                費用：<strong className="text-foreground">新台幣 {MONTHLY_TWD} 元／月（含稅）</strong>，
                每月一期、<strong className="text-foreground">自動續扣</strong>
              </li>
              <li>
                付款：信用卡定期定額，由<strong className="text-foreground">綠界科技股份有限公司（ECPay）</strong>代收。
                本服務<strong className="text-foreground">不保存你的卡號、有效期限或安全碼</strong>
              </li>
              <li>
                <strong className="text-foreground">契約成立</strong>：綠界回報首期付款成功、
                系統寄出開通信時契約成立並即時開通；之後每月同一週期扣款，直到你主動取消
              </li>
            </ul>
            <p>
              <strong className="text-foreground">費用調整</strong>：調價於生效日 30 日前以 Email 通知，
              且<strong className="text-foreground">僅適用調價後新成立之訂閱</strong>——
              既有訂閱的每期金額在建立定期定額委託時即已固定，除非你取消後重新訂閱。
              不同意調價，可於生效日前依第三節取消。
            </p>
          </Section>

          <Section id="cancel" title="三、取消續訂方式">
            <p>你可隨時自行取消，沒有綁約、沒有最低訂閱期間。</p>
            <ol className="ml-5 list-decimal space-y-1">
              <li>登入後進入儀表板的「追蹤航線」</li>
              <li>在要停止的航線卡片點「取消訂閱」</li>
              <li>系統即時向綠界送出停止指令，下一期起不再扣款</li>
            </ol>
            <p>
              取消後，<strong className="text-foreground">已付費的當期服務持續到期末</strong>，
              期間照常收到通知，期末後訂閱自動結束。
              操作上有困難，也可來信 <SupportEmail /> 請我們協助取消。
            </p>
          </Section>

          <Section id="refund" title="四、退款政策">
            <p>
              <strong className="text-foreground">關於七日猶豫期</strong>：
              本服務屬《通訊交易解除權合理例外情事適用準則》第 2 條第 5 款所定
              「一經提供即為完成之線上服務」。你在結帳前須
              <strong className="text-foreground">勾選同意付款後立即開通</strong>；
              經事先同意並立即開通後，依消費者保護法第 19 條第 1 項但書，
              <strong className="text-foreground">不適用七日猶豫期之無條件解除權</strong>。
              不同意此安排，請勿完成付款。
            </p>
            <p>
              因此，<strong className="text-foreground">已扣款之當期費用不提供退款</strong>。
              取而代之的是你可<strong className="text-foreground">隨時取消續訂</strong>：
              取消後不再收費，已付費的當期服務仍提供至期末。
            </p>
            <p>
              若發生<strong className="text-foreground">重複扣款、金額錯誤等付款異常</strong>，
              請來信 <SupportEmail /> 聯繫，我們查證後全額退還。
            </p>
            <p>
              <strong className="text-foreground">扣款有疑義請先聯繫我們</strong>，通常較快解決。
              若你直接向發卡機構申請爭議款，而查證後該筆扣款正常、服務也已依約提供，
              我們得提供交易與服務紀錄予發卡機構及綠界，並得暫停或終止該筆訂閱。
            </p>
          </Section>

          <Section id="limits" title="五、服務限制、免責與責任上限">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                票價可能有延遲或快取，
                <strong className="text-foreground">不保證通知當下該票價仍可訂購</strong>
              </li>
              <li>
                若整期都沒有低於你目標價的票價，
                <strong className="text-foreground">可能不會收到任何通知</strong>，
                這屬服務正常運作，不構成退款事由
              </li>
              <li>
                顯示的票價<strong className="text-foreground">有些不含託運行李與其他附加費用</strong>，
                請自行去訂票頁勾選比較；實際應付金額以訂票頁面為準
              </li>
              <li>
                我們<strong className="text-foreground">不審核、也不背書</strong>訂票平台的營運狀況、
                退改票政策、客服品質或交易安全。下單前請自行確認賣方可靠性與退改規則；
                與訂票平台之間的交易爭議，請直接向該平台或發卡機構處理
              </li>
              <li>Email 能否送達，可能受你的信箱服務商與垃圾信規則影響</li>
              <li>本服務不保證票價會下跌，也不對你依通知所做的訂票決定負責</li>
            </ul>
            <p>
              <strong className="text-foreground">責任上限</strong>：除故意或重大過失外，
              我們的損害賠償責任
              <strong className="text-foreground">以爭議該期已支付之訂閱費用為上限</strong>，
              且不含間接損害與所失利益（例如票價變動、行程取消或改期的費用）。
              本節不排除依法不得預先免除或限制之責任。
            </p>
          </Section>

          <Section id="privacy" title="六、個人資料">
            <p>
              <strong className="text-foreground">你的權利</strong>：依個人資料保護法第 3 條，
              你得請求查詢、閱覽、製給複本、補充或更正、停止蒐集處理利用，或刪除你的個人資料，
              請來信 <SupportEmail /> 提出。
            </p>
            <p>
              <strong className="text-foreground">刪除請求的限制</strong>：為免影響扣款與對帳，
              <strong className="text-foreground">請求刪除前須先取消訂閱</strong>；
              依稅捐及會計法令應保存之交易紀錄，於法定期間內不予刪除。
              資料刪除後你將無法繼續使用本服務，當期未使用之費用不予退還。
            </p>
          </Section>

          <Section id="changes" title="七、條款與服務之變更、暫停與終止">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong className="text-foreground">條款修改</strong>：修改後於本頁公告並更新「最後更新」日期；
                涉及費用、退款或其他重大權益之變更，於生效日 30 日前以 Email 通知。
                生效日後繼續使用視為同意；不同意請於生效日前取消訂閱
              </li>
              <li>
                <strong className="text-foreground">服務暫停</strong>：因維護、升級或不可歸責於我們之
                第三方因素，本服務得暫時停止
              </li>
              <li>
                <strong className="text-foreground">我方終止</strong>：因停止營運或其他正當理由終止服務時，
                於 30 日前以 Email 通知並停止扣款；
                <strong className="text-foreground">已收取但尚未提供服務之費用，按比例退還</strong>
              </li>
              <li>
                <strong className="text-foreground">航線異動</strong>：停止監控特定航線時，
                通知受影響之訂閱者，並比照前項按比例退還
              </li>
            </ul>
          </Section>

          <Section id="force-majeure" title="八、不可抗力">
            <p>
              因天災、戰爭、疫病、罷工、網路或電力中斷、政府命令，或第三方服務中斷
              （含票價資料來源、雲端、郵件或金流服務）等不可歸責於我們之事由，
              致本服務無法提供時，我們不負遲延或不履行之責任。
              上述情事持續逾 30 日者，任一方均得終止訂閱，並按比例退還尚未提供服務之費用。
            </p>
          </Section>

          <Section id="governing-law" title="九、準據法、管轄與其他">
            <ul className="ml-5 list-disc space-y-1">
              <li>本條款以中華民國法律為準據法</li>
              <li>
                因本條款所生之爭議，除法律另有強制規定外，雙方同意以
                <strong className="text-foreground">消費者住所地之地方法院</strong>為第一審管轄法院；
                住所地不明者，以臺灣臺北地方法院為第一審管轄法院
              </li>
              <li>部分條文如經認定無效，不影響其餘條文之效力</li>
              <li>我們未行使或延遲行使本條款之權利，不構成拋棄該權利</li>
            </ul>
          </Section>

          <Section id="contact" title="十、客服聯絡方式">
            <p>
              客服信箱：<SupportEmail />
            </p>
            <p>服務時間：週一至週五 10:00–18:00（台灣時間）。我們會盡快回覆。</p>
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
