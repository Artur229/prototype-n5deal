import { z } from "zod";

const optionalPrice = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : value),
  z.coerce.number().finite().nonnegative().optional(),
);

export const marketplaceFilterSchema = z
  .object({
    q: z.string().trim().max(120).default(""),
    country: z.string().trim().max(2).default(""),
    type: z.string().trim().max(120).default(""),
    minPrice: optionalPrice,
    maxPrice: optionalPrice,
    sort: z.enum(["newest", "match"]).default("newest"),
  })
  .superRefine((value, context) => {
    if (value.minPrice !== undefined && value.maxPrice !== undefined && value.minPrice > value.maxPrice) {
      context.addIssue({ code: "custom", path: ["minPrice"], message: "Minimum price must not exceed maximum price." });
    }
  });

export const buyerProfileSchema = z
  .object({
    bio: z.string().trim().max(2000, "Bio must be 2,000 characters or fewer."),
    minBudget: z.number().finite().min(0, "Minimum budget cannot be negative.").nullable(),
    maxBudget: z.number().finite().positive("Maximum budget must be greater than zero.").nullable(),
    preferredCountries: z.array(z.string().trim().min(1)).max(30),
    preferredIndustries: z.array(z.string().trim().min(1)).max(30),
    preferredAssetTypes: z.array(z.string().trim().min(1)).max(30),
  })
  .superRefine((value, context) => {
    if (value.minBudget !== null && value.maxBudget !== null && value.minBudget > value.maxBudget) {
      context.addIssue({ code: "custom", path: ["minBudget"], message: "Minimum budget must not exceed maximum budget." });
    }
  });

export const inquirySchema = z.object({
  message: z.string().trim().min(1, "Message is required.").max(5000, "Message must be 5,000 characters or fewer."),
});

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseMarketplaceFilters(searchParams: Record<string, string | string[] | undefined>) {
  const result = marketplaceFilterSchema.safeParse({
    q: firstValue(searchParams.q),
    country: firstValue(searchParams.country),
    type: firstValue(searchParams.type),
    minPrice: firstValue(searchParams.minPrice),
    maxPrice: firstValue(searchParams.maxPrice),
    sort: firstValue(searchParams.sort),
  });

  if (!result.success) {
    return {
      filters: { q: "", country: "", type: "", minPrice: undefined, maxPrice: undefined, sort: "newest" as const },
      invalid: true,
    };
  }

  return { filters: result.data, invalid: false };
}

export function parseCommaSeparatedList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseNullableBudget(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized === "" ? null : Number(normalized);
}
