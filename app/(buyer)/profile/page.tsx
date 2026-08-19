import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BuyerDataState } from "@/components/buyer/buyer-data-state";
import { ProfileForm } from "@/components/buyer/profile-form";

export const dynamic = "force-dynamic";

export default async function BuyerProfilePage() {
  const user = await requireRole(UserRole.BUYER);

  let profile;
  try {
    profile = await prisma.buyerProfile.findUnique({ where: { userId: user.id } });
  } catch {
    return <BuyerDataState message="Your profile is temporarily unavailable." />;
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 md:px-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Buyer account</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">My profile</h1>
        <p className="mt-3 text-[#667085]">Share your acquisition preferences so sellers can understand your mandate.</p>
      </div>
      <ProfileForm account={{ name: user.name, company: user.company, country: user.country }} initialValues={{
        bio: profile?.bio ?? "",
        minBudget: profile?.minBudget?.toString() ?? "",
        maxBudget: profile?.maxBudget?.toString() ?? "",
        preferredCountries: profile?.preferredCountries.join(", ") ?? "",
        preferredIndustries: profile?.preferredIndustries.join(", ") ?? "",
        preferredAssetTypes: profile?.preferredAssetTypes.join(", ") ?? "",
      }} />
    </main>
  );
}
