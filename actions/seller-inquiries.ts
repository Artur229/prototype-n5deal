"use server";

import { InquiryStatus, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sellerInquirySchema } from "@/lib/validations/seller";

export type SellerInquiryActionState = { success: boolean; message?: string; errors?: Record<string, string[]> };
export const initialSellerInquiryActionState: SellerInquiryActionState = { success: false };

export async function createSellerInquiry(_previousState: SellerInquiryActionState, formData: FormData): Promise<SellerInquiryActionState> {
  const user = await requireRole(UserRole.SELLER);
  const result = sellerInquirySchema.safeParse({
    buyerId: formData.get("buyerId"),
    assetId: String(formData.get("assetId") ?? "").trim() || undefined,
    message: formData.get("message"),
  });
  if (!result.success) return { success: false, message: "Please enter a message and select a Buyer.", errors: result.error.flatten().fieldErrors };

  try {
    const buyer = await prisma.user.findFirst({ where: { id: result.data.buyerId, role: UserRole.BUYER, status: UserStatus.ACTIVE }, select: { id: true } });
    if (!buyer || buyer.id === user.id) return { success: false, message: "That Buyer is no longer available." };
    if (result.data.assetId) {
      const ownedAsset = await prisma.asset.findFirst({ where: { id: result.data.assetId, sellerId: user.id }, select: { id: true } });
      if (!ownedAsset) return { success: false, message: "You can only attach one of your own assets." };
    }
    await prisma.inquiry.create({ data: { senderId: user.id, receiverId: buyer.id, assetId: result.data.assetId, message: result.data.message, status: InquiryStatus.NEW } });
    revalidatePath("/seller/inquiries");
    return { success: true, message: "Your inquiry has been sent." };
  } catch {
    return { success: false, message: "The inquiry could not be sent. Please try again." };
  }
}
