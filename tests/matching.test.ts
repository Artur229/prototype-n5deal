import { describe, expect, it } from "vitest";

import { calculateMatchScore } from "@/lib/matching";

const asset = { askingPrice: 1_000_000, currency: "GBP", country: "GB", businessType: "Fintech", assetType: "EMI", status: "ACTIVE" };
const profile = { minBudget: 500_000, maxBudget: 3_000_000, preferredCountries: ["GB"], preferredIndustries: ["Fintech"], preferredAssetTypes: ["EMI"] };

describe("calculateMatchScore", () => {
  it("returns an excellent score for a full match", () => {
    const result = calculateMatchScore(profile, asset);
    expect(result.score).toBe(100);
    expect(result.level).toBe("Excellent Match");
  });

  it("returns a lower score for a mismatched asset", () => {
    const result = calculateMatchScore({ ...profile, preferredCountries: ["DE"], preferredIndustries: ["Healthcare"], preferredAssetTypes: ["SaaS"], minBudget: 100_000, maxBudget: 200_000 }, { ...asset, askingPrice: 9_000_000, country: "US", businessType: "Logistics", assetType: "Bank" });
    expect(result.score).toBeLessThan(50);
    expect(result.reasons.some((reason) => reason.includes("not in your selected markets"))).toBe(true);
  });

  it("gives partial budget credit for a slightly out-of-range price", () => {
    const result = calculateMatchScore({ ...profile, preferredCountries: [], preferredIndustries: [], preferredAssetTypes: [], minBudget: 1_000_000, maxBudget: null }, { ...asset, askingPrice: 1_100_000 });
    expect(result.breakdown.budget).toBe(15);
    expect(result.score).toBeGreaterThan(0);
  });

  it("handles incomplete profiles without inventing a score", () => {
    const result = calculateMatchScore(null, asset);
    expect(result.isSufficient).toBe(false);
    expect(result.level).toBe("Insufficient Profile Data");
    expect(result.score).toBe(0);
  });

  it("handles missing optional asset price and inactive assets safely", () => {
    const missingPrice = calculateMatchScore(profile, { ...asset, askingPrice: null });
    const inactive = calculateMatchScore(profile, { ...asset, status: "SUSPENDED" });
    expect(Number.isFinite(missingPrice.score)).toBe(true);
    expect(inactive.score).toBe(0);
    expect(inactive.isSufficient).toBe(false);
  });

  it("always keeps scores within 0–100 and numeric", () => {
    const result = calculateMatchScore({ ...profile, minBudget: -Infinity, maxBudget: Infinity }, { ...asset, askingPrice: NaN });
    expect(Number.isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
