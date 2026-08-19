import { AssetStatus, UserRole } from "@prisma/client";
import { notFound } from "next/navigation";

import { SellerAssetForm } from "@/components/seller/seller-asset-form";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditSellerAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(UserRole.SELLER);
  const { id } = await params;
  const asset = await prisma.asset.findFirst({ where: { id, sellerId: user.id } });
  if (!asset) notFound();

  return <main className="mx-auto max-w-4xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Seller workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Edit asset</h1><p className="mt-3 text-[#667085]">Update the details and publication status of your asset.</p></div><SellerAssetForm assetId={asset.id} initialValues={{ title: asset.title, description: asset.description, askingPrice: asset.askingPrice?.toString() ?? "", currency: asset.currency, country: asset.country, businessType: asset.businessType, assetType: asset.assetType, licenseType: asset.licenseType ?? "", regulator: asset.regulator ?? "", businessStatus: asset.businessStatus ?? "", employees: asset.employees?.toString() ?? "", foundedYear: asset.foundedYear?.toString() ?? "", annualRevenue: asset.annualRevenue?.toString() ?? "", benefits: asset.benefits.join(", "), status: asset.status as AssetStatus }} /></main>;
}
