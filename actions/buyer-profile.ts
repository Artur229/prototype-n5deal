"use server";

import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buyerProfileSchema,
  parseCommaSeparatedList,
  parseNullableBudget,
} from "@/lib/validations/buyer";

export type ProfileActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const initialProfileActionState: ProfileActionState = { success: false };

export async function updateBuyerProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await requireRole(UserRole.BUYER);
  const result = buyerProfileSchema.safeParse({
    bio: String(formData.get("bio") ?? ""),
    minBudget: parseNullableBudget(formData.get("minBudget")),
    maxBudget: parseNullableBudget(formData.get("maxBudget")),
    preferredCountries: parseCommaSeparatedList(formData.get("preferredCountries")),
    preferredIndustries: parseCommaSeparatedList(formData.get("preferredIndustries")),
    preferredAssetTypes: parseCommaSeparatedList(formData.get("preferredAssetTypes")),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Please review the highlighted fields.",
      errors,
    };
  }

  try {
    await prisma.buyerProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...result.data },
      update: result.data,
    });
    return { success: true, message: "Profile updated successfully." };
  } catch {
    return { success: false, message: "Unable to save changes. Please try again." };
  }
}
