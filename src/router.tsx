import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppDashboard } from "./routes/app";
import { AuthPage } from "./routes/auth";
import { RouteErrorBoundary } from "./routes/error-boundary";
import { LandingPage } from "./routes/index";
import { NotFoundPage } from "./routes/not-found";
import { requireAuthLoader } from "./routes/require-auth";
import { RootLayout } from "./routes/root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "sign-in", element: <AuthPage tab="signin" /> },
      { path: "sign-up", element: <AuthPage tab="signup" /> },
      // Previous single combined route — kept so old links keep working.
      { path: "auth", element: <Navigate to="/sign-in" replace /> },
      {
        path: "app",
        loader: requireAuthLoader,
        element: <AppDashboard />,
        errorElement: <RouteErrorBoundary />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
