import { Prisma, AssetStatus, UserRole, UserStatus } from "@prisma/client";

import { ManagerAssetActions } from "@/components/manager/manager-asset-actions";
import { ManagerAssetFilters } from "@/components/manager/manager-asset-filters";
import { SellerDataState } from "@/components/seller/seller-data-state";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseManagerAssetFilters } from "@/lib/validations/manager";

export const dynamic = "force-dynamic";

export default async function ManagerAssetsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireRole(UserRole.MANAGER);
  const parsed = parseManagerAssetFilters(await searchParams);
  const sellerWhere: Prisma.UserWhereInput = { role: UserRole.SELLER, ...(parsed.filters.sellerStatus ? { status: parsed.filters.sellerStatus } : {}) };
  const where: Prisma.AssetWhereInput = { ...(parsed.filters.status ? { status: parsed.filters.status } : {}), ...(parsed.filters.country ? { country: parsed.filters.country } : {}), ...(parsed.filters.businessType ? { businessType: parsed.filters.businessType } : {}), seller: { is: sellerWhere }, ...(parsed.filters.search ? { OR: [{ title: { contains: parsed.filters.search, mode: "insensitive" } }, { businessType: { contains: parsed.filters.search, mode: "insensitive" } }, { country: { contains: parsed.filters.search, mode: "insensitive" } }] } : {}) };
  let assets;
  let facets;
  try {
    [assets, facets] = await Promise.all([
      prisma.asset.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, title: true, country: true, businessType: true, askingPrice: true, currency: true, status: true, createdAt: true, seller: { select: { name: true, company: true, status: true } } } }),
      prisma.asset.findMany({ where: { seller: { is: { role: UserRole.SELLER } } }, distinct: ["country", "businessType"], orderBy: [{ country: "asc" }, { businessType: "asc" }], select: { country: true, businessType: true } }),
    ]);
  } catch {
    return <main className="mx-auto max-w-7xl px-5 py-10 md:px-10"><SellerDataState message="Asset management is temporarily unavailable." /></main>;
  }
  const countries = [...new Set(facets.map((item) => item.country))];
  const businessTypes = [...new Set(facets.map((item) => item.businessType))];

  return <main className="mx-auto max-w-7xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Platform operations</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Assets</h1><p className="mt-3 text-[#667085]">Inspect and moderate every marketplace asset, including non-active listings.</p></div><ManagerAssetFilters businessTypes={businessTypes} countries={countries} values={parsed.filters} />{parsed.invalid ? <p className="mt-4 text-sm text-[#b45309]">Some filter values were invalid and have been reset.</p> : null}<div className="mb-4 mt-8 text-sm text-[#667085]">Showing {assets.length} asset{assets.length === 1 ? "" : "s"}</div>{assets.length === 0 ? <SellerDataState message="No assets match your filters." actionHref="/manager/assets" /> : <div className="overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="border-b border-[#e5e7eb] text-xs uppercase tracking-wide text-[#667085]"><tr><th className="px-5 py-4">Asset</th><th className="px-5 py-4">Seller</th><th className="px-5 py-4">Country</th><th className="px-5 py-4">Business type</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Asset status</th><th className="px-5 py-4">Seller status</th><th className="px-5 py-4">Created</th><th className="px-5 py-4" /></tr></thead><tbody>{assets.map((asset) => <tr className="border-b border-[#f0f0f0] last:border-0" key={asset.id}><td className="px-5 py-5 font-semibold">{asset.title}</td><td className="px-5 py-5"><p>{asset.seller.name}</p><p className="mt-1 text-xs text-[#667085]">{asset.seller.company ?? "Independent"}</p></td><td className="px-5 py-5">{asset.country}</td><td className="px-5 py-5 text-[#667085]">{asset.businessType}</td><td className="px-5 py-5 font-mono">{formatMoney(asset.askingPrice, asset.currency)}</td><td className="px-5 py-5"><Badge variant={asset.status === AssetStatus.ACTIVE ? "secondary" : "outline"}>{asset.status}</Badge></td><td className="px-5 py-5"><Badge variant={asset.seller.status === UserStatus.ACTIVE ? "secondary" : "outline"}>{asset.seller.status}</Badge></td><td className="px-5 py-5 text-[#667085]">{asset.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}</td><td className="px-5 py-5"><ManagerAssetActions assetId={asset.id} status={asset.status} title={asset.title} /></td></tr>)}</tbody></table></div>}</main>;
}

function formatMoney(value: unknown, currency: string) { const amount = Number(value); return Number.isFinite(amount) ? new Intl.NumberFormat("en-US", { currency, maximumFractionDigits: 0, style: "currency" }).format(amount) : "Price on request"; }
