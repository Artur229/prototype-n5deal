import { AssetStatus, UserRole } from "@prisma/client";

import { SellerAssetForm } from "@/components/seller/seller-asset-form";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewSellerAssetPage() {
  await requireRole(UserRole.SELLER);
  return <main className="mx-auto max-w-4xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Seller workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Create asset</h1><p className="mt-3 text-[#667085]">Add an opportunity to the N5Deal marketplace.</p></div><SellerAssetForm initialValues={blankValues} /></main>;
}

const blankValues = { title: "", description: "", askingPrice: "", currency: "USD", country: "", businessType: "", assetType: "", licenseType: "", regulator: "", businessStatus: "", employees: "", foundedYear: "", annualRevenue: "", benefits: "", status: AssetStatus.DRAFT };
