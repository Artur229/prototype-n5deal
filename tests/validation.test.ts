import { AssetStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { buyerProfileSchema, inquirySchema } from "@/lib/validations/buyer";
import { sellerAssetSchema } from "@/lib/validations/seller";

const validAsset = { title: "Regulated Fintech Business", description: "A sufficiently detailed asset description for validation.", askingPrice: 1_000_000, currency: "GBP", country: "GB", businessType: "Fintech", assetType: "EMI", licenseType: "EMI", regulator: "FCA", businessStatus: "Active", employees: 10, foundedYear: 2018, annualRevenue: 500_000, benefits: ["Regulated"], status: AssetStatus.DRAFT };

describe("critical validation schemas", () => {
  it("accepts a valid asset", () => expect(sellerAssetSchema.safeParse(validAsset).success).toBe(true));
  it("rejects negative asking price and unrealistic year", () => {
    expect(sellerAssetSchema.safeParse({ ...validAsset, askingPrice: -1 }).success).toBe(false);
    expect(sellerAssetSchema.safeParse({ ...validAsset, foundedYear: 1700 }).success).toBe(false);
  });
  it("rejects an asset without a title", () => expect(sellerAssetSchema.safeParse({ ...validAsset, title: "" }).success).toBe(false));
  it("accepts valid buyer budgets and rejects invalid ranges", () => {
    expect(buyerProfileSchema.safeParse({ bio: "", minBudget: 100, maxBudget: 500, preferredCountries: [], preferredIndustries: [], preferredAssetTypes: [] }).success).toBe(true);
    expect(buyerProfileSchema.safeParse({ bio: "", minBudget: 600, maxBudget: 500, preferredCountries: [], preferredIndustries: [], preferredAssetTypes: [] }).success).toBe(false);
    expect(buyerProfileSchema.safeParse({ bio: "", minBudget: -1, maxBudget: 500, preferredCountries: [], preferredIndustries: [], preferredAssetTypes: [] }).success).toBe(false);
  });
  it("rejects blank inquiry messages", () => {
    expect(inquirySchema.safeParse({ message: "Interested in this opportunity" }).success).toBe(true);
    expect(inquirySchema.safeParse({ message: "   " }).success).toBe(false);
  });
});
