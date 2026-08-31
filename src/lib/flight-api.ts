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

export type PlanName = "tokyo" | "seoul";

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

export async function saveSubscription(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<Subscription> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as Subscription;
}
