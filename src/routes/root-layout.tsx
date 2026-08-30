import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useRevalidator } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * App shell — wraps every page. Nested routes render at <Outlet />.
 */
export function RootLayout() {
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      revalidator.revalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
    // `revalidator` is a new object each render; only its identity-stable
    // `revalidate` matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);

  return (
    <>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
    </>
  );
}
