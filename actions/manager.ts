"use server";

import { AssetStatus, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ManagerActionState = { success: boolean; message?: string };
export const initialManagerActionState: ManagerActionState = { success: false };

export async function moderateUser(userId: string, nextStatus: UserStatus, _previousState: ManagerActionState, _formData: FormData): Promise<ManagerActionState> {
  void _previousState;
  void _formData;
  const manager = await requireRole(UserRole.MANAGER);
  if (userId === manager.id) return { success: false, message: "You cannot change your own account status." };

  try {
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true, status: true, name: true } });
    if (!target) return { success: false, message: "Participant not found." };
    if (target.role === UserRole.MANAGER) return { success: false, message: "Manager accounts are not managed here." };
    if (target.status === nextStatus) return { success: false, message: `Participant is already ${nextStatus.toLowerCase()}.` };
    await prisma.user.update({ where: { id: target.id }, data: { status: nextStatus } });
    revalidateManagerPaths();
    return { success: true, message: `${target.name} is now ${nextStatus.toLowerCase()}.` };
  } catch {
    return { success: false, message: "The participant status could not be changed." };
  }
}

export async function removeUser(userId: string, _previousState: ManagerActionState, _formData: FormData): Promise<ManagerActionState> {
  void _previousState;
  void _formData;
  const manager = await requireRole(UserRole.MANAGER);
  if (userId === manager.id) return { success: false, message: "You cannot remove your own account." };

  try {
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true, name: true } });
    if (!target) return { success: false, message: "Participant not found." };
    if (target.role === UserRole.MANAGER) return { success: false, message: "Manager accounts are not removed here." };
    const [assetCount, inquiryCount] = await Promise.all([
      prisma.asset.count({ where: { sellerId: target.id } }),
      prisma.inquiry.count({ where: { OR: [{ senderId: target.id }, { receiverId: target.id }] } }),
    ]);
    if (assetCount || inquiryCount) return { success: false, message: "This participant has assets or inquiry history. Suspend the account instead to preserve marketplace records." };
    await prisma.user.delete({ where: { id: target.id } });
    revalidateManagerPaths();
    return { success: true, message: `${target.name} was removed.` };
  } catch {
    return { success: false, message: "The participant could not be removed safely." };
  }
}

export async function moderateAsset(assetId: string, nextStatus: AssetStatus, _previousState: ManagerActionState, _formData: FormData): Promise<ManagerActionState> {
  void _previousState;
  void _formData;
  await requireRole(UserRole.MANAGER);
  if (nextStatus !== AssetStatus.ACTIVE && nextStatus !== AssetStatus.SUSPENDED) return { success: false, message: "Only ACTIVE and SUSPENDED moderation states are supported." };

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId }, select: { id: true, title: true, status: true } });
    if (!asset) return { success: false, message: "Asset not found." };
    if (asset.status !== AssetStatus.ACTIVE && asset.status !== AssetStatus.SUSPENDED) return { success: false, message: "Only ACTIVE and SUSPENDED assets can be moderated." };
    if (asset.status === nextStatus) return { success: false, message: `Asset is already ${nextStatus.toLowerCase()}.` };
    await prisma.asset.update({ where: { id: asset.id }, data: { status: nextStatus } });
    revalidateManagerPaths();
    return { success: true, message: `${asset.title} is now ${nextStatus.toLowerCase()}.` };
  } catch {
    return { success: false, message: "The asset moderation change could not be saved." };
  }
}

function revalidateManagerPaths() {
  revalidatePath("/manager");
  revalidatePath("/manager/users");
  revalidatePath("/manager/assets");
  revalidatePath("/marketplace");
  revalidatePath("/seller/buyers");
}
