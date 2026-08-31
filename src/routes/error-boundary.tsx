import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError, useRevalidator } from "react-router-dom";

import { reportLovableError } from "@/lib/lovable-error-reporting";

import { NotFoundPage } from "./not-found";

export function RouteErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    if (isNotFound) return;
    console.error(error);
    reportLovableError(error, { boundary: "router_error_element" });
  }, [error, isNotFound]);

  if (isNotFound) return <NotFoundPage />;

  return (
    <div className="paper-grain flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-normal uppercase tracking-[0.2em] text-ink">
          This page didn't load
        </h1>
        <div aria-hidden className="deco-rule mx-auto mt-5 w-14" />
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => revalidator.revalidate()}
            className="inline-flex items-center justify-center bg-terracotta px-6 py-2.5 font-display text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-terracotta-deep"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-ink/30 bg-transparent px-6 py-2.5 font-display text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-paper-deep"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
