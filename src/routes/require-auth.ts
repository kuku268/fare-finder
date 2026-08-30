import type { User } from "@supabase/supabase-js";
import { redirect } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side auth guard. Runs before the protected route renders and bounces
 * signed-out visitors to the sign-in page — same behaviour as the previous
 * `_authenticated` route's `beforeLoad`, minus the server round-trip.
 */
export async function requireAuthLoader(): Promise<{ user: User }> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect("/sign-in");
  return { user: data.user };
}
