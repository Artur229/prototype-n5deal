import Link from "next/link";
import { UserRole, UserStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { SellerInquiryDialog } from "@/components/seller/seller-inquiry-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SellerBuyerPage({ params }: { params: Promise<{ id: string }> }) {
  const seller = await requireRole(UserRole.SELLER);
  const { id } = await params;
  const [buyer, assets] = await Promise.all([
    prisma.user.findFirst({ where: { id, role: UserRole.BUYER, status: UserStatus.ACTIVE }, select: { id: true, name: true, company: true, country: true, buyerProfile: { select: { bio: true, minBudget: true, maxBudget: true, preferredCountries: true, preferredIndustries: true, preferredAssetTypes: true } } } }),
    prisma.asset.findMany({ where: { sellerId: seller.id }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true } }),
  ]);
  if (!buyer) notFound();
  const profile = buyer.buyerProfile;
  return <main className="mx-auto max-w-5xl bg-[#eaecdf] px-5 py-10 md:px-10"><Link className="text-sm text-[#667085] hover:text-black" href="/seller/buyers">← Back to Buyers</Link><div className="mt-6 flex flex-wrap items-start justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Active Buyer</p><h1 className="mt-2 text-4xl font-bold tracking-tight">{buyer.name}</h1><p className="mt-2 text-[#667085]">{buyer.company ?? "Independent Buyer"} · {buyer.country}</p></div><SellerInquiryDialog assets={assets} buyerId={buyer.id} buyerName={buyer.name} /></div><div className="mt-8 grid gap-5 md:grid-cols-2"><Card className="border-[#e5e7eb] bg-white"><CardHeader><CardTitle>Acquisition mandate</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line leading-7 text-[#4b5563]">{profile?.bio ?? "No profile bio provided."}</p><p className="mt-6 font-medium">Budget: {formatBudget(profile?.minBudget, profile?.maxBudget)}</p></CardContent></Card><Card className="border-[#e5e7eb] bg-white"><CardHeader><CardTitle>Preferences</CardTitle></CardHeader><CardContent className="space-y-5"><Preference label="Industries" values={profile?.preferredIndustries ?? []} /><Preference label="Countries" values={profile?.preferredCountries ?? []} /><Preference label="Asset types" values={profile?.preferredAssetTypes ?? []} /></CardContent></Card></div></main>;
}

function Preference({ label, values }: { label: string; values: string[] }) { return <div><p className="text-xs uppercase tracking-wide text-[#667085]">{label}</p><div className="mt-2 flex flex-wrap gap-2">{values.length ? values.map((value) => <Badge key={value} variant="outline">{value}</Badge>) : <span className="text-sm text-[#667085]">Not specified</span>}</div></div>; }
function formatBudget(min: unknown, max: unknown) { const minValue = Number(min); const maxValue = Number(max); if (Number.isFinite(minValue) && Number.isFinite(maxValue)) return `$${minValue.toLocaleString()} – $${maxValue.toLocaleString()}`; if (Number.isFinite(minValue)) return `From $${minValue.toLocaleString()}`; if (Number.isFinite(maxValue)) return `Up to $${maxValue.toLocaleString()}`; return "Not disclosed"; }
