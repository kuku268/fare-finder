import { useEffect } from "react";

/**
 * Per-page <title> / <meta> updates.
 *
 * TanStack Start rendered these server-side via each route's `head()`. In a
 * static SPA the document shell in index.html carries the defaults and each
 * page overrides them on mount, so the tags stay identical to before.
 */
export type PageMeta = {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  robots?: string;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function usePageMeta(meta: PageMeta) {
  const { title, description, ogTitle, ogDescription, robots } = meta;

  useEffect(() => {
    document.title = title;
    if (description !== undefined) upsertMeta("name", "description", description);
    if (ogTitle !== undefined) upsertMeta("property", "og:title", ogTitle);
    if (ogDescription !== undefined) upsertMeta("property", "og:description", ogDescription);
    if (robots !== undefined) upsertMeta("name", "robots", robots);
  }, [title, description, ogTitle, ogDescription, robots]);
}
