import { AssetStatus, UserRole, UserStatus } from "@prisma/client";

export function hasRequiredRole(user: { role: UserRole; status: UserStatus } | null | undefined, role: UserRole) {
  return user?.status === UserStatus.ACTIVE && user.role === role;
}

export function canManageOwnedResource(userId: string, ownerId: string) {
  return Boolean(userId) && userId === ownerId;
}

export function canModerateManagerTarget(managerId: string, target: { id: string; role: UserRole }) {
  return managerId !== target.id && target.role !== UserRole.MANAGER;
}

export function isVisibleMarketplaceAsset(assetStatus: AssetStatus | string, sellerStatus: UserStatus | string) {
  return assetStatus === AssetStatus.ACTIVE && sellerStatus === UserStatus.ACTIVE;
}

export function isDiscoverableBuyer(role: UserRole | string, status: UserStatus | string) {
  return role === UserRole.BUYER && status === UserStatus.ACTIVE;
}
