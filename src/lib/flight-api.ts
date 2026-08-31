/**
 * Flight Price Notifier — AWS API Gateway client (M1).
 *
 * The browser holds no AWS credentials: it only talks to the HTTP API,
 * and the Lambdas behind it are the only things that touch DynamoDB.
 *
 * Override the endpoint with VITE_FLIGHT_API_URL when the API is rebuilt.
 */
const FALLBACK_API_URL = "https://fbcvsg2ww4.execute-api.us-east-1.amazonaws.com";

export const FLIGHT_API_URL = (
  (import.meta.env['VITE_FLIGHT_API_URL'] as string | undefined) ?? FALLBACK_API_URL
).replace(/\/$/, "");

export type PlanName = "tokyo" | "seoul" | "london";

/**
 * M2 subscription lifecycle.
 * pending_payment -> active <-> (target updates) -> cancelled (grace) -> expired
 * Only `active` and `cancelled`-within-period are alerted by the parser.
 */
export type SubscriptionStatus = "pending_payment" | "active" | "cancelled" | "expired";

export type Subscription = {
  email: string;
  route: string;
  plan_name: PlanName;
  origin: string;
  destination: string;
  target_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
  /** Absent on legacy M1 rows written before the paywall existed. */
  subscription_status?: SubscriptionStatus;
  /** Paid-through date, e.g. "2026-09-30". Present once a charge has landed. */
  current_period_end_date?: string;
};

async function readError(res: Response) {
  try {
    const body = (await res.json()) as { error?: string };
    if (body?.error) return body.error;
  } catch {
    /* fall through to the status line */
  }
  return `${res.status} ${res.statusText}`;
}

export async function listSubscriptions(email: string): Promise<Subscription[]> {
  const url = `${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await readError(res));
  const body = (await res.json()) as { items?: Subscription[] };
  return body.items ?? [];
}

/**
 * POST /subscribe returns one of two things, and the caller MUST branch on
 * Content-Type or the button silently does nothing:
 *
 *  - `text/html`  -> an auto-submit ECPay checkout form. We hand the document
 *                    over to it; the inline <script> then POSTs the browser to
 *                    ECPay's cashier. This function never returns in that case.
 *  - `application/json` -> an in-place update (an already-paying subscriber
 *                    changing their target price). No re-payment.
 */
export async function saveSubscription(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<Subscription | null> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    const html = await res.text();
    document.open();
    document.write(html);
    document.close();
    return null; // navigating away to ECPay
  }
  return (await res.json()) as Subscription;
}

/**
 * Cancelling stops future renewals but keeps the subscription alive until
 * `current_period_end_date` — the row goes to `cancelled`, not `expired`.
 */
export async function cancelSubscription(
  email: string,
  route: string,
): Promise<{ subscription_status: SubscriptionStatus; current_period_end_date?: string }> {
  const res = await fetch(`${FLIGHT_API_URL}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, route }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return await res.json();
}
