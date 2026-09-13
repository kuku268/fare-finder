import { ArrowLeft, Plane } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { TERMS_UPDATED_LABEL } from "@/lib/terms-version";
import { usePageMeta } from "@/lib/use-page-meta";

const MONTHLY_TWD = 200;

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

function ContactLink() {
  return (
    <Link to="/contact" className="font-medium text-primary underline underline-offset-4">
      聯絡表單
    </Link>
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
              <li>
                檢查頻率：系統<strong className="text-foreground">通常每 30 分鐘</strong>自動檢查一次，
                得因系統維護、資料來源異常或其他技術因素調整
              </li>
              <li>通知方式：Email（寄件人 alerts@flymail.viaoneway.com）</li>
              <li>
                為避免重複打擾，同一航線的通知頻率由系統依降幅與間隔自動判定；
                我們得視服務品質調整此判定方式
              </li>
            </ul>
          </Section>

          <Section id="eligibility" title="二、訂閱資格與帳號">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                本服務以年滿 18 歲之個人為對象。
                <strong className="text-foreground">未滿 18 歲者，須經法定代理人同意後始得訂閱</strong>；
                未經同意而訂閱者，法定代理人得通知我們撤銷，我們將於查證後停止扣款，
                並按比例退還尚未提供服務之期間費用
              </li>
              <li>
                你應確保註冊的 Email 正確且可正常收信。本服務之通知、扣款與條款變更通知均寄至該 Email，
                寄出後即視為已通知
              </li>
              <li>帳號不得轉讓、出借或與他人共用</li>
              <li>
                Email 同時是系統辨識你身分的依據，<strong className="text-foreground">目前無法自行變更</strong>。
                如需更換，請先取消原訂閱，再以新 Email 重新訂閱
              </li>
            </ul>
          </Section>

          <Section id="pricing" title="三、費用、訂閱週期與契約成立">
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
                <strong className="text-foreground">契約成立時點</strong>：
                於綠界回報首期付款成功、且系統寄出開通通知信時，本服務契約成立並即時開通；
                之後每月於同一週期自動扣款一次，直到你主動取消為止
              </li>
              <li>
                本服務<strong className="text-foreground">不保存你的信用卡號、有效期限或安全碼</strong>，
                刷卡資料全程由綠界處理
              </li>
            </ul>
            <p>
              <strong className="text-foreground">費用調整</strong>：
              我們保留調整訂閱費用之權利。調價將於生效日 30 日前以 Email 通知你。
              調價原則上<strong className="text-foreground">僅適用於通知後新成立之訂閱</strong>；
              既有訂閱的每期扣款金額於建立定期定額委託時即已固定，除非你自行取消後重新訂閱，否則不受影響。
              你若不同意調價，可於生效日前依第四節取消續訂。
            </p>
          </Section>

          <Section id="cancel" title="四、取消續訂方式">
            <p>你可以隨時自行取消，沒有綁約、沒有最低訂閱期間。</p>
            <ol className="ml-5 list-decimal space-y-1">
              <li>登入本網站後，進入儀表板的「追蹤航線」區塊</li>
              <li>在要停止的航線卡片上點選「取消訂閱」</li>
              <li>系統會即時向綠界送出停止定期定額的指令，下一期起不再扣款</li>
            </ol>
            <p>
              取消後，<strong className="text-foreground">你已付費的當期服務會持續到期末</strong>，
              期間仍會照常收到票價通知；期末之後訂閱自動結束。
              若你在操作上遇到困難，也可以透過 <ContactLink /> 由我們協助取消。
            </p>
          </Section>

          <Section id="refund" title="五、退款政策">
            <p>
              <strong className="text-foreground">關於七日猶豫期</strong>：
              本服務屬「非以有形媒介提供之數位內容或一經提供即為完成之線上服務」，
              為《通訊交易解除權合理例外情事適用準則》第 2 條第 5 款所定之例外情事。
              你在結帳前須<strong className="text-foreground">勾選同意於付款完成後立即開通</strong>；
              經你事先同意並立即開通後，依消費者保護法第 19 條第 1 項但書，
              <strong className="text-foreground">不適用七日猶豫期之無條件解除權</strong>。
              若你不同意此安排，請勿完成付款。
            </p>
            <p>
              基於上述，<strong className="text-foreground">已扣款之當期費用不提供退款</strong>。
              取而代之的是：你可以<strong className="text-foreground">隨時取消續訂</strong>，
              取消後不再產生任何費用，而已付費的當期服務仍會提供至期末，不會因為取消而中斷。
            </p>
            <p>
              若發生<strong className="text-foreground">重複扣款、金額錯誤等付款異常</strong>，
              請透過 <ContactLink /> 與我們聯繫，我們會查證後全額退還。
            </p>
            <p>
              <strong className="text-foreground">扣款疑義的處理順序</strong>：
              對任何一期扣款有疑問時，請先透過 <ContactLink /> 與我們聯繫，
              通常能較快釐清並處理。若你直接向發卡機構提出爭議款申請，
              而經查證該筆扣款正常且服務已依約提供，我們得提供交易與服務紀錄予發卡機構及綠界，
              並得暫停或終止該筆訂閱。
            </p>
          </Section>

          <Section id="acceptable-use" title="六、使用限制">
            <p>使用本服務時，你同意不從事下列行為：</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>以爬蟲、機器人、腳本等自動化方式大量存取本服務、本網站或通知內容</li>
              <li>
                將通知內容<strong className="text-foreground">轉售、散布、公開張貼</strong>，
                或以任何方式提供予未訂閱之第三人
              </li>
              <li>以多重帳號、偽造資訊或其他方式規避付費機制</li>
              <li>干擾、破壞本服務之系統與網路，或試圖未經授權存取本服務之資料</li>
            </ul>
            <p>
              本服務之票價資料取自第三方來源並受其授權條款拘束，上述限制亦為遵循該等條款所必要。
              違反本節者，我們得不經預告暫停或終止你的訂閱；情節重大者，當期費用不予退還。
            </p>
          </Section>

          <Section id="limits" title="七、服務限制、免責與責任上限">
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
                請自行去訂票頁勾選比較；實際應付金額以訂票頁面為準
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
            <p>
              <strong className="text-foreground">責任上限</strong>：
              除因我們的故意或重大過失外，我們就本服務所生之損害賠償責任，
              以<strong className="text-foreground">你就發生爭議之該期已支付之訂閱費用為上限</strong>，
              且不包括間接損害與所失利益（例如票價變動、行程取消或改期所生之費用）。
              本節不排除依法不得預先免除或限制之責任。
            </p>
          </Section>

          <Section id="privacy" title="八、個人資料">
            <p>
              <strong className="text-foreground">你的權利</strong>：依個人資料保護法第 3 條，
              你得請求查詢、閱覽、製給複本、補充或更正、停止蒐集處理利用，或刪除你的個人資料。
              請透過 <ContactLink /> 提出。
            </p>
            <p>
              <strong className="text-foreground">刪除請求的限制</strong>：為避免影響扣款與對帳，
              <strong className="text-foreground">請求刪除前須先取消訂閱</strong>；
              依稅捐及會計相關法令應保存之交易紀錄，於法定保存期間內不予刪除。
              資料刪除後你將無法繼續使用本服務，且當期尚未使用之費用不予退還。
            </p>
          </Section>

          <Section id="changes" title="九、條款與服務之變更、暫停與終止">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong className="text-foreground">條款修改</strong>：我們得修改本條款，
                修改後將於本頁公告並更新「最後更新」日期。
                涉及費用、退款或其他重大影響你權益之變更，將於生效日 30 日前以 Email 通知。
                你於生效日後繼續使用本服務，視為同意修改後之條款；若不同意，請於生效日前取消續訂
              </li>
              <li>
                <strong className="text-foreground">服務暫停</strong>：因系統維護、升級，
                或不可歸責於我們之第三方因素，本服務得暫時停止
              </li>
              <li>
                <strong className="text-foreground">我方終止</strong>：我們得因停止營運或其他正當理由終止本服務，
                並於 30 日前以 Email 通知、停止後續扣款；
                <strong className="text-foreground">已收取但尚未提供服務之期間費用，按比例退還</strong>
              </li>
              <li>
                <strong className="text-foreground">航線異動</strong>：我們得新增或停止監控特定航線。
                停止監控時，將通知受影響之訂閱者，並比照前項按比例退還該航線尚未提供服務之期間費用
              </li>
              <li>
                因你違反第六節（使用限制）而遭終止者，不適用上述按比例退還
              </li>
            </ul>
          </Section>

          <Section id="force-majeure" title="十、不可抗力">
            <p>
              因天災、戰爭、疫病、罷工、網路或電力中斷、政府命令，
              或第三方服務中斷（包括票價資料來源、雲端服務、郵件服務或金流服務）
              等不可歸責於我們之事由，致本服務全部或一部無法提供時，我們不負遲延或不履行之責任。
              上述情事持續逾 30 日者，任一方均得終止訂閱，
              並按比例退還尚未提供服務之期間費用。
            </p>
          </Section>

          <Section id="governing-law" title="十一、準據法、管轄與其他">
            <ul className="ml-5 list-disc space-y-1">
              <li>本條款之解釋與適用，以中華民國法律為準據法</li>
              <li>
                因本條款所生之爭議，除法律另有強制規定外，雙方同意以
                <strong className="text-foreground">消費者住所地之地方法院</strong>
                為第一審管轄法院；消費者住所地不明者，以臺灣臺北地方法院為第一審管轄法院
              </li>
              <li>本條款部分條文如經認定為無效，不影響其餘條文之效力</li>
              <li>我們未行使或延遲行使本條款之任何權利，不構成拋棄該權利</li>
            </ul>
          </Section>

          <Section id="contact" title="十二、客服聯絡方式">
            <p>
              請透過 <ContactLink /> 與我們聯繫。
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
