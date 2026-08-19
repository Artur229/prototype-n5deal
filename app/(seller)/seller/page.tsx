import { UserRole } from "@prisma/client";

import { SellerDashboard } from "@/components/seller/seller-dashboard";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SellerPage() {
  const user = await requireRole(UserRole.SELLER);
  const [total, active, drafts, inquiries] = await Promise.all([
    prisma.asset.count({ where: { sellerId: user.id } }),
    prisma.asset.count({ where: { sellerId: user.id, status: "ACTIVE" } }),
    prisma.asset.count({ where: { sellerId: user.id, status: "DRAFT" } }),
    prisma.inquiry.count({ where: { receiverId: user.id } }),
  ]);

  return <SellerDashboard counts={{ total, active, drafts, inquiries }} />;
}
