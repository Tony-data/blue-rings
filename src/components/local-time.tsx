"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Shows a timestamp in the viewer's own time zone (UTC during server render). */
export function LocalTime({ ms }: { ms: number }) {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const date = new Date(ms);
  const text = isClient
    ? date.toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : `${date.toLocaleString("en-AU", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC",
      })} UTC`;
  return <time dateTime={date.toISOString()}>{text}</time>;
}
