import Link from "next/link";
import { UserRole } from "@prisma/client";

import { DeleteAssetDialog } from "@/components/seller/delete-asset-dialog";
import { SellerDataState } from "@/components/seller/seller-data-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SellerAssetsPage() {
  const user = await requireRole(UserRole.SELLER);
  let assets;
  try {
    assets = await prisma.asset.findMany({ where: { sellerId: user.id }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, country: true, askingPrice: true, currency: true, businessType: true, status: true, updatedAt: true } });
  } catch {
    return <main className="mx-auto max-w-6xl px-5 py-10 md:px-10"><SellerDataState message="Your assets are temporarily unavailable." /></main>;
  }

  return <main className="mx-auto max-w-6xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Seller workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">My Assets</h1><p className="mt-3 text-[#667085]">Only assets owned by your Seller account appear here.</p></div><Button asChild><Link href="/seller/assets/new">Create asset</Link></Button></div>{assets.length === 0 ? <div className="mt-8"><SellerDataState message="You have not created any assets yet." actionHref="/seller/assets/new" /></div> : <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-[#e5e7eb] text-xs uppercase tracking-wide text-[#667085]"><tr><th className="px-5 py-4">Title</th><th className="px-5 py-4">Country</th><th className="px-5 py-4">Business type</th><th className="px-5 py-4">Asking price</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4" /></tr></thead><tbody>{assets.map((asset) => <tr className="border-b border-[#f0f0f0] last:border-0" key={asset.id}><td className="px-5 py-5 font-semibold"><Link className="hover:underline" href={`/seller/assets/${asset.id}`}>{asset.title}</Link></td><td className="px-5 py-5">{asset.country}</td><td className="px-5 py-5 text-[#667085]">{asset.businessType}</td><td className="px-5 py-5 font-mono">{formatMoney(asset.askingPrice, asset.currency)}</td><td className="px-5 py-5"><Badge variant={asset.status === "ACTIVE" ? "secondary" : "outline"}>{asset.status}</Badge></td><td className="px-5 py-5 text-[#667085]">{asset.updatedAt.toLocaleDateString("en-US", { dateStyle: "medium" })}</td><td className="px-5 py-5"><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/seller/assets/${asset.id}`}>View</Link></Button><Button asChild size="sm" variant="outline"><Link href={`/seller/assets/${asset.id}/edit`}>Edit</Link></Button><DeleteAssetDialog assetId={asset.id} title={asset.title} /></div></td></tr>)}</tbody></table></div>}</main>;
}

function formatMoney(value: unknown, currency: string) { const amount = Number(value); return Number.isFinite(amount) ? new Intl.NumberFormat("en-US", { currency, maximumFractionDigits: 0, style: "currency" }).format(amount) : "Price on request"; }
