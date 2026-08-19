"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseSellerAssetForm } from "@/lib/validations/seller";

export type AssetActionState = { success: boolean; message?: string; errors?: Record<string, string[]> };
export const initialAssetActionState: AssetActionState = { success: false };

export async function createSellerAsset(_previousState: AssetActionState, formData: FormData): Promise<AssetActionState> {
  const user = await requireRole(UserRole.SELLER);
  const result = parseSellerAssetForm(formData);
  if (!result.success) return invalidAssetState(result.error);

  try {
    await prisma.asset.create({ data: { ...result.data, sellerId: user.id } });
    revalidateSellerPaths();
    return { success: true, message: "Asset created successfully." };
  } catch {
    return { success: false, message: "The asset could not be created. Please try again." };
  }
}

export async function updateSellerAsset(assetId: string, _previousState: AssetActionState, formData: FormData): Promise<AssetActionState> {
  const user = await requireRole(UserRole.SELLER);
  const result = parseSellerAssetForm(formData);
  if (!result.success) return invalidAssetState(result.error);

  try {
    const updated = await prisma.asset.updateMany({ where: { id: assetId, sellerId: user.id }, data: result.data });
    if (updated.count !== 1) return { success: false, message: "Asset not found or access denied." };
    revalidateSellerPaths(assetId);
    return { success: true, message: "Asset updated successfully." };
  } catch {
    return { success: false, message: "The asset could not be updated. Please try again." };
  }
}

export async function deleteSellerAsset(assetId: string, _previousState: AssetActionState, _formData: FormData): Promise<AssetActionState> {
  void _previousState;
  void _formData;
  const user = await requireRole(UserRole.SELLER);

  try {
    const deleted = await prisma.asset.deleteMany({ where: { id: assetId, sellerId: user.id } });
    if (deleted.count !== 1) return { success: false, message: "Asset not found or access denied." };
    revalidateSellerPaths(assetId);
    return { success: true, message: "Asset deleted." };
  } catch {
    return { success: false, message: "The asset could not be deleted while it has related records." };
  }
}

function invalidAssetState(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): AssetActionState {
  return { success: false, message: "Please review the highlighted fields.", errors: error.flatten().fieldErrors };
}

function revalidateSellerPaths(assetId?: string) {
  revalidatePath("/seller");
  revalidatePath("/seller/assets");
  revalidatePath("/marketplace");
  if (assetId) revalidatePath(`/seller/assets/${assetId}`);
}
