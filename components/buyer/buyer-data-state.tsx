import Link from "next/link";

import { Button } from "@/components/ui/button";

export function BuyerDataState({ message = "No assets match your current filters." }: { message?: string }) {
  return <div className="rounded-2xl border border-dashed border-[#bccac0] bg-white p-12 text-center"><p className="text-[#667085]">{message}</p><Button asChild className="mt-5" variant="outline"><Link href="/marketplace">Reset filters</Link></Button></div>;
}
