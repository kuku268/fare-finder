import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="paper-grain flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-light tracking-[0.12em] text-ink">404</h1>
        <div aria-hidden className="deco-rule mx-auto mt-6 w-16" />
        <h2 className="mt-6 font-display text-lg font-normal uppercase tracking-[0.24em] text-ink">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-terracotta px-6 py-2.5 font-display text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-terracotta-deep"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
