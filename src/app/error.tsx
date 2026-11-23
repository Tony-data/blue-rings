"use client";

import Image from "next/image";

/** Shown only if live data fails and there's no earlier version to fall back on. */
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8">
        <Image src="/brand/mark.png" alt="" width={56} height={48} className="h-10 w-auto" />
        <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">Couldn&rsquo;t load the latest numbers</h1>
        <p className="mt-2 text-slate">
          Polymarket didn&rsquo;t respond just now. This is usually temporary. Try again in a minute.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 rounded-lg bg-ink px-4 py-2.5 font-medium text-white transition hover:bg-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
