export type BuyerMatchProfile = {
  minBudget: unknown;
  maxBudget: unknown;
  preferredCountries: string[];
  preferredIndustries: string[];
  preferredAssetTypes: string[];
} | null | undefined;

export type MatchAsset = {
  askingPrice: unknown;
  currency?: string;
  country: string;
  businessType: string;
  assetType: string;
  status: string;
};

export type MatchResult = {
  score: number;
  level: string;
  reasons: string[];
  breakdown: { budget: number; industry: number; geography: number; assetType: number; businessStatus: number };
  isSufficient: boolean;
};

const WEIGHTS = { budget: 30, industry: 30, geography: 20, assetType: 10, businessStatus: 10 } as const;

export function calculateMatchScore(profile: BuyerMatchProfile, asset: MatchAsset): MatchResult {
  const emptyBreakdown = { budget: 0, industry: 0, geography: 0, assetType: 0, businessStatus: 0 };
  if (asset.status !== "ACTIVE") {
    return { score: 0, level: "Unavailable", reasons: ["This asset is not currently available for acquisition."], breakdown: emptyBreakdown, isSufficient: false };
  }

  const hasPreferences = Boolean(profile && (
    profile.minBudget !== null || profile.maxBudget !== null || profile.preferredCountries.length || profile.preferredIndustries.length || profile.preferredAssetTypes.length
  ));
  if (!hasPreferences) {
    return { score: 0, level: "Insufficient Profile Data", reasons: ["Complete your acquisition preferences to calculate a personalized match."], breakdown: emptyBreakdown, isSufficient: false };
  }

  const reasons: string[] = [];
  const budget = scoreBudget(profile, asset, reasons);
  const industry = scoreListMatch(profile?.preferredIndustries ?? [], asset.businessType, WEIGHTS.industry, "industry", reasons);
  const geography = scoreGeography(profile?.preferredCountries ?? [], asset.country, reasons);
  const assetType = scoreListMatch(profile?.preferredAssetTypes ?? [], asset.assetType, WEIGHTS.assetType, "asset type", reasons);
  const businessStatus = WEIGHTS.businessStatus;
  reasons.push("✓ This asset is active and available for acquisition");
  const breakdown = { budget, industry, geography, assetType, businessStatus };
  const score = clampScore(budget + industry + geography + assetType + businessStatus);
  return { score, level: getMatchLevel(score), reasons, breakdown, isSufficient: true };
}

function scoreBudget(profile: BuyerMatchProfile, asset: MatchAsset, reasons: string[]) {
  const min = finiteNumber(profile?.minBudget);
  const max = finiteNumber(profile?.maxBudget);
  const price = finiteNumber(asset.askingPrice);
  if (min === null && max === null) {
    reasons.push("• No preferred budget configured; budget is neutral");
    return WEIGHTS.budget;
  }
  if (price === null) {
    reasons.push("• Asking price is not disclosed; budget fit is neutral");
    return Math.round(WEIGHTS.budget / 2);
  }
  const lower = min !== null && max !== null ? Math.min(min, max) : min;
  const upper = min !== null && max !== null ? Math.max(min, max) : max;
  if ((lower === null || price >= lower) && (upper === null || price <= upper)) {
    reasons.push(`✓ Asking price fits your ${formatBudget(min, max, asset.currency)} acquisition budget`);
    return WEIGHTS.budget;
  }
  const boundary = price < (lower ?? price) ? lower : upper;
  const distanceRatio = boundary && boundary > 0 ? Math.abs(price - boundary) / boundary : 1;
  if (distanceRatio <= 0.2) {
    reasons.push(`• Asking price is slightly outside your ${formatBudget(min, max, asset.currency)} acquisition budget`);
    return Math.round(WEIGHTS.budget / 2);
  }
  reasons.push(`• Asking price is outside your ${formatBudget(min, max, asset.currency)} acquisition budget`);
  return 0;
}

function scoreListMatch(preferences: string[], value: string, weight: number, label: string, reasons: string[]) {
  if (!preferences.length) {
    reasons.push(`• No preferred ${label}s configured; ${label} is neutral`);
    return weight;
  }
  const match = preferences.some((preference) => flexibleMatch(preference, value));
  if (match) {
    reasons.push(`✓ ${value} matches your preferred ${label}s`);
    return weight;
  }
  reasons.push(`• ${value} does not match your preferred ${label}s`);
  return 0;
}

function scoreGeography(preferences: string[], country: string, reasons: string[]) {
  if (!preferences.length) {
    reasons.push("• No preferred markets configured; geography is neutral");
    return WEIGHTS.geography;
  }
  if (preferences.some((preference) => flexibleMatch(preference, country))) {
    reasons.push(`✓ ${country} is one of your preferred markets`);
    return WEIGHTS.geography;
  }
  reasons.push(`• ${country} is not in your selected markets`);
  return 0;
}

function flexibleMatch(preference: string, value: string) {
  const left = normalize(preference);
  const right = normalize(value);
  return left === right || left.includes(right) || right.includes(left);
}

function normalize(value: string) { return value.trim().toLowerCase(); }
function finiteNumber(value: unknown) { const number = Number(value); return Number.isFinite(number) ? number : null; }
function clampScore(score: number) { return Math.max(0, Math.min(100, Math.round(score))); }
function getMatchLevel(score: number) { if (score >= 90) return "Excellent Match"; if (score >= 75) return "Strong Match"; if (score >= 50) return "Moderate Match"; return "Low Match"; }
function formatBudget(min: number | null, max: number | null, currency = "") { const format = (value: number) => `${currency ? `${currency} ` : ""}${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`; if (min !== null && max !== null) return `${format(Math.min(min, max))}–${format(Math.max(min, max))}`; if (min !== null) return `from ${format(min)}`; if (max !== null) return `up to ${format(max)}`; return "your budget"; }
