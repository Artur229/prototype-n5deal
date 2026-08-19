import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AssetNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
      <h1 className="text-3xl font-semibold tracking-tight">Deal not found</h1>
      <p className="mt-3 text-[#667085]">This asset may have been sold, suspended, or removed from the marketplace.</p>
      <Button asChild className="mt-6"><Link href="/marketplace">Return to marketplace</Link></Button>
    </main>
  );
}
