import { AssetStatus, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const firstValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export const managerUserFilterSchema = z.object({
  search: z.string().trim().max(120).default(""),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  country: z.string().trim().max(2).default(""),
});

export const managerAssetFilterSchema = z.object({
  search: z.string().trim().max(120).default(""),
  status: z.nativeEnum(AssetStatus).optional(),
  sellerStatus: z.nativeEnum(UserStatus).optional(),
  country: z.string().trim().max(2).default(""),
  businessType: z.string().trim().max(120).default(""),
});

export function parseManagerUserFilters(params: Record<string, string | string[] | undefined>) {
  const result = managerUserFilterSchema.safeParse({ search: firstValue(params.search), role: firstValue(params.role), status: firstValue(params.status), country: firstValue(params.country) });
  return result.success ? { filters: result.data, invalid: false } : { filters: { search: "", role: undefined, status: undefined, country: "" }, invalid: true };
}

export function parseManagerAssetFilters(params: Record<string, string | string[] | undefined>) {
  const result = managerAssetFilterSchema.safeParse({ search: firstValue(params.search), status: firstValue(params.status), sellerStatus: firstValue(params.sellerStatus), country: firstValue(params.country), businessType: firstValue(params.businessType) });
  return result.success ? { filters: result.data, invalid: false } : { filters: { search: "", status: undefined, sellerStatus: undefined, country: "", businessType: "" }, invalid: true };
}
