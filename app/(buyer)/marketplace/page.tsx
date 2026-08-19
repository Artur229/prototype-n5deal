import { AssetStatus, UserRole, UserStatus } from "@prisma/client";

import { AssetCard } from "@/components/buyer/asset-card";
import { BuyerDataState } from "@/components/buyer/buyer-data-state";
import { MarketplaceFilters } from "@/components/buyer/marketplace-filters";
import { calculateMatchScore } from "@/lib/matching";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseMarketplaceFilters } from "@/lib/validations/buyer";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const rawSearchParams = await searchParams;
  const parsed = parseMarketplaceFilters(rawSearchParams);
  const buyer = await requireRole(UserRole.BUYER);

  const sellerFilter = { is: { role: UserRole.SELLER, status: UserStatus.ACTIVE } };
  let facets;
  let assets;
  try {
    let profile;
    [facets, assets, profile] = await Promise.all([
      prisma.asset.findMany({
        where: { status: AssetStatus.ACTIVE, seller: sellerFilter },
        select: { country: true, businessType: true },
        orderBy: [{ country: "asc" }, { businessType: "asc" }],
      }),
      prisma.asset.findMany({
        where: {
          status: AssetStatus.ACTIVE,
          seller: sellerFilter,
          ...(parsed.filters.country ? { country: parsed.filters.country } : {}),
          ...(parsed.filters.type ? { businessType: parsed.filters.type } : {}),
          ...(parsed.filters.minPrice !== undefined || parsed.filters.maxPrice !== undefined ? { askingPrice: { ...(parsed.filters.minPrice !== undefined ? { gte: parsed.filters.minPrice } : {}), ...(parsed.filters.maxPrice !== undefined ? { lte: parsed.filters.maxPrice } : {}) } } : {}),
          ...(parsed.filters.q ? { OR: [{ title: { contains: parsed.filters.q, mode: "insensitive" } }, { country: { contains: parsed.filters.q, mode: "insensitive" } }, { businessType: { contains: parsed.filters.q, mode: "insensitive" } }, { regulator: { contains: parsed.filters.q, mode: "insensitive" } }, { description: { contains: parsed.filters.q, mode: "insensitive" } }] } : {}),
        },
        select: { id: true, title: true, description: true, askingPrice: true, currency: true, country: true, businessType: true, assetType: true, licenseType: true, regulator: true, businessStatus: true, employees: true, foundedYear: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.buyerProfile.findUnique({ where: { userId: buyer.id }, select: { minBudget: true, maxBudget: true, preferredCountries: true, preferredIndustries: true, preferredAssetTypes: true } }),
    ]);

    const scoredAssets = assets.map((asset) => ({ asset, match: profile ? calculateMatchScore(profile, asset) : undefined }));
    if (parsed.filters.sort === "match" && profile) scoredAssets.sort((left, right) => (right.match?.score ?? 0) - (left.match?.score ?? 0));
    assets = scoredAssets;

  } catch {
    return <main className="mx-auto max-w-[1440px] px-5 py-12 md:px-10"><BuyerDataState message="Marketplace data is temporarily unavailable." /></main>;
  }

  const countries = [...new Set(facets.map((facet) => facet.country))];
  const businessTypes = [...new Set(facets.map((facet) => facet.businessType))];

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
      <section className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#059669]">Buyer workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Marketplace</h1><p className="mt-3 max-w-2xl text-sm text-[#667085]">Browse active institutional assets and businesses available for acquisition.</p></section>
      <MarketplaceFilters countries={countries} businessTypes={businessTypes} values={parsed.filters} />
      {parsed.invalid ? <p className="mt-4 text-sm text-[#b45309]">Some filter values were invalid and have been reset.</p> : null}
      <div className="mb-4 mt-8 flex items-center justify-between"><p className="text-sm text-[#667085]">Showing {assets.length} active asset{assets.length === 1 ? "" : "s"}</p><p className="hidden text-sm text-[#667085] md:block">{parsed.filters.sort === "match" ? "Best match first" : "Newest listed first"}</p></div>
      {assets.length ? <div className="space-y-4">{assets.map(({ asset, match }) => <AssetCard asset={asset} key={asset.id} match={match} />)}</div> : <BuyerDataState />}
    </main>
  );
}
