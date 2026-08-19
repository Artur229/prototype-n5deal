"use client";

import { Button } from "@/components/ui/button";

export default function AssetDetailError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10"><h1 className="text-3xl font-semibold tracking-tight">Deal unavailable</h1><p className="mt-3 text-[#667085]">We could not load this deal right now.</p><Button className="mt-6" onClick={reset}>Try again</Button></main>;
}
