import { Prisma, UserRole, UserStatus } from "@prisma/client";

import { BuyerFilters } from "@/components/seller/buyer-filters";
import { SellerDataState } from "@/components/seller/seller-data-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { parseSellerBuyerFilters } from "@/lib/validations/seller";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SellerBuyersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireRole(UserRole.SELLER);
  const parsed = parseSellerBuyerFilters(await searchParams);
  const profileConditions: Prisma.BuyerProfileWhereInput[] = [];
  if (parsed.filters.industry) profileConditions.push({ preferredIndustries: { has: parsed.filters.industry } });
  if (parsed.filters.country) profileConditions.push({ preferredCountries: { has: parsed.filters.country } });
  if (parsed.filters.assetType) profileConditions.push({ preferredAssetTypes: { has: parsed.filters.assetType } });
  if (parsed.filters.minBudget !== undefined) profileConditions.push({ OR: [{ maxBudget: null }, { maxBudget: { gte: parsed.filters.minBudget } }] });
  if (parsed.filters.maxBudget !== undefined) profileConditions.push({ OR: [{ minBudget: null }, { minBudget: { lte: parsed.filters.maxBudget } }] });
  const profileFilter = profileConditions.length ? { is: { AND: profileConditions } } : undefined;
  const q = parsed.filters.q;
  const where: Prisma.UserWhereInput = { role: UserRole.BUYER, status: UserStatus.ACTIVE, ...(profileFilter ? { buyerProfile: profileFilter } : {}), ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { company: { contains: q, mode: "insensitive" } }, { country: { contains: q, mode: "insensitive" } }] } : {}) };

  let buyers;
  let facets;
  try {
    [buyers, facets] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { updatedAt: "desc" }, take: 50, select: { id: true, name: true, company: true, country: true, buyerProfile: { select: { bio: true, minBudget: true, maxBudget: true, preferredCountries: true, preferredIndustries: true, preferredAssetTypes: true } } } }),
      prisma.user.findMany({ where: { role: UserRole.BUYER, status: UserStatus.ACTIVE }, select: { country: true, buyerProfile: { select: { preferredCountries: true, preferredIndustries: true, preferredAssetTypes: true } } } }),
    ]);
  } catch {
    return <main className="mx-auto max-w-6xl px-5 py-10 md:px-10"><SellerDataState message="Buyer discovery is temporarily unavailable." /></main>;
  }
  const countries = unique(facets.flatMap((item) => [item.country, ...(item.buyerProfile?.preferredCountries ?? [])]));
  const industries = unique(facets.flatMap((item) => item.buyerProfile?.preferredIndustries ?? []));
  const assetTypes = unique(facets.flatMap((item) => item.buyerProfile?.preferredAssetTypes ?? []));

  return <main className="mx-auto max-w-6xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Seller workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Browse Buyers</h1><p className="mt-3 text-[#667085]">Discover active Buyers and their acquisition preferences.</p></div><BuyerFilters countries={countries} industries={industries} assetTypes={assetTypes} values={parsed.filters} />{parsed.invalid ? <p className="mt-4 text-sm text-[#b45309]">Some filter values were invalid and have been reset.</p> : null}<div className="mb-4 mt-8 flex items-center justify-between"><p className="text-sm text-[#667085]">Showing {buyers.length} Buyer{buyers.length === 1 ? "" : "s"}</p></div>{buyers.length === 0 ? <SellerDataState message="No Buyers match your current filters." actionHref="/seller/buyers" /> : <div className="grid gap-5 md:grid-cols-2">{buyers.map((buyer) => <BuyerCard buyer={buyer} key={buyer.id} />)}</div>}</main>;
}

function BuyerCard({ buyer }: { buyer: { id: string; name: string; company: string | null; country: string; buyerProfile: { bio: string | null; minBudget: unknown; maxBudget: unknown; preferredIndustries: string[]; preferredAssetTypes: string[] } | null } }) { const profile = buyer.buyerProfile; return <article className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{buyer.name}</h2><p className="mt-1 text-sm text-[#667085]">{buyer.company ?? "Independent Buyer"} · {buyer.country}</p></div><Badge variant="secondary">Active</Badge></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-[#4b5563]">{profile?.bio ?? "No Buyer profile description provided."}</p><p className="mt-4 text-sm font-medium">Budget: {formatBudget(profile?.minBudget, profile?.maxBudget)}</p><div className="mt-4 flex flex-wrap gap-2">{[...(profile?.preferredIndustries ?? []), ...(profile?.preferredAssetTypes ?? [])].slice(0, 5).map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div><Button asChild className="mt-5" variant="outline"><Link href={`/seller/buyers/${buyer.id}`}>View profile</Link></Button></article>; }
function unique(values: string[]) { return [...new Set(values)].sort(); }
function formatBudget(min: unknown, max: unknown) { const minValue = Number(min); const maxValue = Number(max); if (Number.isFinite(minValue) && Number.isFinite(maxValue)) return `$${minValue.toLocaleString()} – $${maxValue.toLocaleString()}`; if (Number.isFinite(minValue)) return `From $${minValue.toLocaleString()}`; if (Number.isFinite(maxValue)) return `Up to $${maxValue.toLocaleString()}`; return "Budget not disclosed"; }
