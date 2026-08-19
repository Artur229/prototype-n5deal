import Link from "next/link";
import { MessageSquare, Plus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SellerDashboardProps = { counts: { total: number; active: number; drafts: number; inquiries: number } };

export function SellerDashboard({ counts }: SellerDashboardProps) {
  const summary = [
    ["Total assets", counts.total],
    ["Active assets", counts.active],
    ["Draft assets", counts.drafts],
    ["Received inquiries", counts.inquiries],
  ] as const;

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#eaecdf] px-5 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Seller workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Overview</h1><p className="mt-3 text-[#667085]">Manage your assets and connect with qualified Buyers.</p></div><div className="flex gap-3"><Button asChild><Link href="/seller/assets/new"><Plus className="size-4" />Create Asset</Link></Button><Button asChild variant="outline"><Link href="/seller/buyers"><UsersRound className="size-4" />Browse Buyers</Link></Button></div></div>
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{summary.map(([label, value]) => <Card className="border-[#e5e7eb] bg-white" key={label}><CardHeader><CardTitle className="text-sm font-medium text-[#667085]">{label}</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{value}</p></CardContent></Card>)}</section>
        <Card className="mt-8 border-[#e5e7eb] bg-white"><CardHeader><CardTitle>Next steps</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/seller/assets">Review my assets</Link></Button><Button asChild variant="outline"><Link href="/seller/inquiries"><MessageSquare className="size-4" />Review inquiries</Link></Button></CardContent></Card>
      </div>
    </main>
  );
}
