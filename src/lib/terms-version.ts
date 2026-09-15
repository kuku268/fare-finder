/**
 * Version stamp for /terms.
 *
 * Bumped whenever the terms change materially. The checkout flow sends this
 * alongside the consent timestamp so that, for any given subscriber, we can
 * show *which* version of the terms they agreed to — without it, the waiver of
 * the 7-day cooling-off period (消保法 §19) has no evidentiary trail.
 *
 * Keep the label in sync: it is what the page prints as "最後更新".
 */
export const TERMS_VERSION = "2026-09-15";
export const TERMS_UPDATED_LABEL = "2026 年 9 月 15 日";
