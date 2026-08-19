import Link from "next/link";
import { AssetStatus, UserRole } from "@prisma/client";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SellerAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(UserRole.SELLER);
  const { id } = await params;
  const asset = await prisma.asset.findFirst({ where: { id, sellerId: user.id }, include: { _count: { select: { inquiries: true } } } });
  if (!asset) notFound();

  return <main className="mx-auto max-w-5xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><Link className="text-sm text-[#667085] hover:text-black" href="/seller/assets">← Back to my assets</Link><h1 className="mt-4 text-4xl font-bold tracking-tight">{asset.title}</h1><p className="mt-2 text-[#667085]">{asset.country} · {asset.businessType} · {asset.assetType}</p></div><div className="flex gap-2"><Badge variant={asset.status === AssetStatus.ACTIVE ? "secondary" : "outline"}>{asset.status}</Badge><Button asChild variant="outline"><Link href={`/seller/assets/${asset.id}/edit`}>Edit</Link></Button></div></div><div className="mt-8 grid gap-5 md:grid-cols-3"><Info label="Asking price" value={formatMoney(asset.askingPrice, asset.currency)} /><Info label="Annual revenue" value={formatMoney(asset.annualRevenue, asset.currency)} /><Info label="Inquiries" value={String(asset._count.inquiries)} /><Info label="License" value={asset.licenseType ?? "Not disclosed"} /><Info label="Regulator" value={asset.regulator ?? "Not disclosed"} /><Info label="Business status" value={asset.businessStatus ?? "Not disclosed"} /></div><section className="mt-8 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Description</h2><p className="mt-4 whitespace-pre-line leading-7 text-[#4b5563]">{asset.description}</p>{asset.benefits.length ? <><h2 className="mt-8 text-xl font-semibold">Benefits</h2><ul className="mt-4 flex flex-wrap gap-2">{asset.benefits.map((benefit) => <li className="rounded-full bg-[#f1f2ed] px-3 py-1 text-sm" key={benefit}>{benefit}</li>)}</ul></> : null}</section></main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-[#667085]">{label}</p><p className="mt-2 font-medium">{value}</p></div>; }
function formatMoney(value: unknown, currency: string) { const amount = Number(value); return Number.isFinite(amount) ? new Intl.NumberFormat("en-US", { currency, maximumFractionDigits: 0, style: "currency" }).format(amount) : "Not disclosed"; }
