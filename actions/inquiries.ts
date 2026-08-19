"use server";

import { AssetStatus, InquiryStatus, UserRole, UserStatus } from "@prisma/client";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations/buyer";

export type InquiryActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const initialInquiryActionState: InquiryActionState = { success: false };

export async function createInquiry(
  assetId: string,
  _previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const user = await requireRole(UserRole.BUYER);
  const result = inquirySchema.safeParse({ message: String(formData.get("message") ?? "") });

  if (!result.success) {
    return {
      success: false,
      message: "Please enter a message before sending.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const asset = await prisma.asset.findFirst({
      where: { id: assetId, status: AssetStatus.ACTIVE, seller: { is: { role: UserRole.SELLER, status: UserStatus.ACTIVE } } },
      select: { sellerId: true },
    });
    if (!asset || asset.sellerId === user.id) return { success: false, message: "This deal is no longer available." };
    await prisma.inquiry.create({ data: { senderId: user.id, receiverId: asset.sellerId, assetId, message: result.data.message, status: InquiryStatus.NEW } });
    return { success: true, message: "Your inquiry has been sent." };
  } catch {
    return { success: false, message: "Unable to send inquiry. Please try again." };
  }
}
