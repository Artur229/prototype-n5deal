import { UserRole } from "@prisma/client";

import { BuyerNavigation } from "@/components/buyer/buyer-navigation";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BuyerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole(UserRole.BUYER);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#151c27]">
      <BuyerNavigation email={user.email} />
      {children}
    </div>
  );
}
