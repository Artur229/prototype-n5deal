import { UserRole, UserStatus, AssetStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { canManageOwnedResource, canModerateManagerTarget, hasRequiredRole, isDiscoverableBuyer, isVisibleMarketplaceAsset } from "@/lib/permissions/rules";

describe("permission and visibility rules", () => {
  it("allows only active users with the required role", () => {
    expect(hasRequiredRole({ role: UserRole.BUYER, status: UserStatus.ACTIVE }, UserRole.BUYER)).toBe(true);
    expect(hasRequiredRole({ role: UserRole.SELLER, status: UserStatus.ACTIVE }, UserRole.BUYER)).toBe(false);
    expect(hasRequiredRole({ role: UserRole.BUYER, status: UserStatus.SUSPENDED }, UserRole.BUYER)).toBe(false);
  });

  it("requires ownership for Seller-owned resources", () => {
    expect(canManageOwnedResource("seller-1", "seller-1")).toBe(true);
    expect(canManageOwnedResource("seller-1", "seller-2")).toBe(false);
  });

  it("blocks Manager self-targeting and Manager targets", () => {
    expect(canModerateManagerTarget("manager-1", { id: "seller-1", role: UserRole.SELLER })).toBe(true);
    expect(canModerateManagerTarget("manager-1", { id: "manager-1", role: UserRole.MANAGER })).toBe(false);
    expect(canModerateManagerTarget("manager-1", { id: "manager-2", role: UserRole.MANAGER })).toBe(false);
  });

  it("enforces marketplace visibility predicates", () => {
    expect(isVisibleMarketplaceAsset(AssetStatus.ACTIVE, UserStatus.ACTIVE)).toBe(true);
    expect(isVisibleMarketplaceAsset(AssetStatus.SUSPENDED, UserStatus.ACTIVE)).toBe(false);
    expect(isVisibleMarketplaceAsset(AssetStatus.ACTIVE, UserStatus.SUSPENDED)).toBe(false);
    expect(isDiscoverableBuyer(UserRole.BUYER, UserStatus.ACTIVE)).toBe(true);
    expect(isDiscoverableBuyer(UserRole.BUYER, UserStatus.SUSPENDED)).toBe(false);
    expect(isDiscoverableBuyer(UserRole.SELLER, UserStatus.ACTIVE)).toBe(false);
  });
});
