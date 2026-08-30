import "./lib/process-shim";
import "./styles.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "./lib/query-client";
import { router } from "./router";

const container = document.getElementById("root");
if (!container) throw new Error('Missing #root element in index.html');

createRoot(container).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
