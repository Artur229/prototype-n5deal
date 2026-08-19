import { AssetStatus } from "@prisma/client";
import { z } from "zod";

const optionalInteger = z.preprocess(
  (value) => (value === undefined || value === "" || value === null ? null : value),
  z.coerce.number().finite().int().nullable(),
);
const optionalMoney = z.preprocess(
  (value) => (value === undefined || value === "" || value === null ? null : value),
  z.coerce.number().finite().nonnegative().nullable(),
);

export const sellerAssetSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(240),
  description: z.string().trim().min(20, "Description must be at least 20 characters.").max(20000),
  askingPrice: z.coerce.number().finite().positive("Asking price must be greater than zero."),
  currency: z.string().trim().length(3, "Currency must be a 3-letter code.").transform((value) => value.toUpperCase()),
  country: z.string().trim().length(2, "Country must be a 2-letter code.").transform((value) => value.toUpperCase()),
  businessType: z.string().trim().min(1, "Business type is required.").max(120),
  assetType: z.string().trim().min(1, "Asset type is required.").max(120),
  licenseType: z.string().trim().max(160),
  regulator: z.string().trim().max(160),
  businessStatus: z.string().trim().max(120),
  employees: optionalInteger.refine((value) => value === null || value >= 0, "Employees cannot be negative."),
  foundedYear: optionalInteger.refine((value) => value === null || (value >= 1800 && value <= new Date().getFullYear() + 1), "Enter a reasonable founded year."),
  annualRevenue: optionalMoney,
  benefits: z.array(z.string().trim().min(1)).max(30),
  status: z.nativeEnum(AssetStatus),
});

export const sellerBuyerFilterSchema = z.object({
  q: z.string().trim().max(120).default(""),
  industry: z.string().trim().max(120).default(""),
  country: z.string().trim().max(2).default(""),
  assetType: z.string().trim().max(120).default(""),
  minBudget: z.coerce.number().finite().nonnegative().optional(),
  maxBudget: z.coerce.number().finite().nonnegative().optional(),
}).superRefine((value, context) => {
  if (value.minBudget !== undefined && value.maxBudget !== undefined && value.minBudget > value.maxBudget) {
    context.addIssue({ code: "custom", path: ["minBudget"], message: "Minimum budget must not exceed maximum budget." });
  }
});

export const sellerInquirySchema = z.object({
  buyerId: z.string().trim().min(1),
  assetId: z.string().trim().optional(),
  message: z.string().trim().min(1, "Message is required.").max(5000, "Message must be 5,000 characters or fewer."),
});

export function parseSellerAssetForm(formData: FormData) {
  return sellerAssetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    askingPrice: formData.get("askingPrice"),
    currency: formData.get("currency"),
    country: formData.get("country"),
    businessType: formData.get("businessType"),
    assetType: formData.get("assetType"),
    licenseType: formData.get("licenseType"),
    regulator: formData.get("regulator"),
    businessStatus: formData.get("businessStatus"),
    employees: formData.get("employees"),
    foundedYear: formData.get("foundedYear"),
    annualRevenue: formData.get("annualRevenue"),
    benefits: String(formData.get("benefits") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    status: formData.get("status"),
  });
}

export function parseSellerBuyerFilters(searchParams: Record<string, string | string[] | undefined>) {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const result = sellerBuyerFilterSchema.safeParse({
    q: first(searchParams.q),
    industry: first(searchParams.industry),
    country: first(searchParams.country),
    assetType: first(searchParams.assetType),
    minBudget: first(searchParams.minBudget),
    maxBudget: first(searchParams.maxBudget),
  });

  return result.success
    ? { filters: result.data, invalid: false }
    : { filters: { q: "", industry: "", country: "", assetType: "", minBudget: undefined, maxBudget: undefined }, invalid: true };
}
