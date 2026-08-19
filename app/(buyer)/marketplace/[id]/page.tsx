import Image from "next/image";
import Link from "next/link";
import { AssetStatus, UserRole, UserStatus } from "@prisma/client";
import { ArrowLeft, Building2, CalendarDays, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { ContactSellerDialog } from "@/components/buyer/contact-seller-dialog";
import { MatchScore } from "@/components/buyer/match-score";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matching";

export const dynamic = "force-dynamic";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const buyer = await requireRole(UserRole.BUYER);
  const { id } = await params;
  const [asset, profile] = await Promise.all([
    prisma.asset.findFirst({
      where: { id, status: AssetStatus.ACTIVE, seller: { is: { role: UserRole.SELLER, status: UserStatus.ACTIVE } } },
      select: {
        id: true, title: true, description: true, askingPrice: true, currency: true, country: true,
        businessType: true, assetType: true, licenseType: true, regulator: true, businessStatus: true,
        employees: true, foundedYear: true, annualRevenue: true, benefits: true, status: true,
        seller: { select: { name: true, company: true, country: true } },
      },
    }),
    prisma.buyerProfile.findUnique({ where: { userId: buyer.id }, select: { minBudget: true, maxBudget: true, preferredCountries: true, preferredIndustries: true, preferredAssetTypes: true } }),
  ]);

  if (!asset) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-black" href="/marketplace"><ArrowLeft className="size-4" />Back to marketplace</Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="relative h-32 overflow-hidden rounded-lg bg-[#eef3f1] md:h-40">
            <Image alt={`${asset.country} flag`} className="object-contain p-12" fill sizes="(max-width: 1024px) 100vw, 760px" src={`https://flagcdn.com/w640/${asset.country.toLowerCase()}.png`} />
          </div>
          <div className="mt-8 flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#059669]">{asset.country} · {asset.businessType}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{asset.title}</h1>
            </div>
            <p className="font-mono text-2xl font-semibold text-[#059669]">{formatMoney(asset.askingPrice, asset.currency)}</p>
          </div>
          <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#4b5563]">{asset.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {asset.businessStatus ? <Badge variant="secondary">{asset.businessStatus}</Badge> : null}
            {asset.licenseType ? <Badge variant="outline">{asset.licenseType}</Badge> : null}
            {asset.regulator ? <Badge variant="outline">{asset.regulator}</Badge> : null}
            <Badge variant="outline">{asset.assetType}</Badge>
          </div>
          {asset.benefits.length ? <Card className="mt-8"><CardHeader><CardTitle>Highlights</CardTitle></CardHeader><CardContent><ul className="grid gap-3 text-sm text-[#4b5563] md:grid-cols-2">{asset.benefits.map((benefit) => <li className="rounded-lg bg-[#f5f7f2] px-3 py-2" key={benefit}>{benefit}</li>)}</ul></CardContent></Card> : null}
        </section>
        <aside className="space-y-5">
          <MatchScore result={calculateMatchScore(profile, asset)} />
          <Card><CardHeader><CardTitle>Deal overview</CardTitle></CardHeader><CardContent className="grid gap-4 text-sm"><Detail icon={<Building2 className="size-4" />} label="Business type" value={asset.businessType} /><Detail icon={<MapPin className="size-4" />} label="Country" value={asset.country} /><Detail icon={<Users className="size-4" />} label="Employees" value={asset.employees?.toString() ?? "Not disclosed"} /><Detail icon={<CalendarDays className="size-4" />} label="Founded" value={asset.foundedYear?.toString() ?? "Not disclosed"} /><Detail label="Annual revenue" value={formatMoney(asset.annualRevenue, asset.currency)} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Seller</CardTitle></CardHeader><CardContent><p className="font-medium">{asset.seller.name}</p><p className="mt-1 text-sm text-[#667085]">{asset.seller.company ?? "Independent seller"} · {asset.seller.country}</p><div className="mt-5"><ContactSellerDialog assetId={asset.id} sellerName={asset.seller.name} /></div></CardContent></Card>
        </aside>
      </div>
    </main>
  );
}

function Detail({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-[#667085]">{icon}{label}</span><span className="text-right font-medium">{value}</span></div>;
}

function formatMoney(value: unknown, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price on request";
  return new Intl.NumberFormat("en-US", { currency, maximumFractionDigits: 0, style: "currency" }).format(amount);
}
