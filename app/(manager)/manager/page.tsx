import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ManagerPage() {
  await requireRole(UserRole.MANAGER);

  const [buyers, sellers, assets, activeAssets, suspendedUsers, drafts, inquiries] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.BUYER } }),
    prisma.user.count({ where: { role: UserRole.SELLER } }),
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "SUSPENDED" } }),
    prisma.asset.count({ where: { status: "DRAFT" } }),
    prisma.inquiry.count(),
  ]);
  const summary = [["Buyers", buyers], ["Sellers", sellers], ["Total assets", assets], ["Active assets", activeAssets], ["Suspended users", suspendedUsers], ["Draft assets", drafts], ["Inquiries", inquiries]] as const;

  return <main className="min-h-[calc(100vh-73px)] bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Platform operations</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Manager overview</h1><p className="mt-3 text-[#667085]">Monitor marketplace participants and listings.</p></div><div className="flex gap-3"><Button asChild variant="outline"><Link href="/manager/users">Manage users</Link></Button><Button asChild><Link href="/manager/assets">Review assets</Link></Button></div></div><section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{summary.map(([label, value]) => <Card className="border-[#e5e7eb] bg-white" key={label}><CardHeader><CardTitle className="text-sm font-medium text-[#667085]">{label}</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{value}</p></CardContent></Card>)}</section></div></main>;
}
