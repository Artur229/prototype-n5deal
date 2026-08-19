import { UserRole } from "@prisma/client";

import { SellerNavigation } from "@/components/seller/seller-navigation";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SellerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole(UserRole.SELLER);
  return <><SellerNavigation email={user.email} />{children}</>;
}
