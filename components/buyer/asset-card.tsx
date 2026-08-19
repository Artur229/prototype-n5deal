import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchScore } from "@/components/buyer/match-score";
import { MatchResult } from "@/lib/matching";

type AssetCardProps = {
  asset: {
    id: string;
    title: string;
    description: string;
    askingPrice: unknown;
    currency: string;
    country: string;
    businessType: string;
    licenseType: string | null;
    regulator: string | null;
    businessStatus: string | null;
    employees?: number | null;
    foundedYear?: number | null;
    createdAt?: Date;
  };
  match?: MatchResult;
};

export function AssetCard({ asset, match }: AssetCardProps) {
  return (
    <article className="grid gap-4 rounded-lg border border-[#e5e7eb] bg-white p-4 transition hover:border-[#059669] hover:shadow-md md:grid-cols-[150px_1fr_auto] md:items-center">
      <div className="relative h-24 overflow-hidden rounded-md bg-[#eef3f1] p-4">
        <Image alt={`${asset.country} flag`} className="object-contain" fill sizes="180px" src={`https://flagcdn.com/w320/${asset.country.toLowerCase()}.png`} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">{asset.country} · {asset.businessType}</p><h2 className="mt-1 text-xl font-semibold tracking-tight">{asset.title}</h2></div>
          <p className="font-mono text-lg font-semibold text-[#059669]">{formatMoney(asset.askingPrice, asset.currency)}</p>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">{asset.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">{asset.employees !== undefined ? <span><strong className="font-semibold text-[#1a2b3c]">{asset.employees ?? "—"}</strong> employees</span> : null}{asset.foundedYear ? <span>Founded <strong className="font-semibold text-[#1a2b3c]">{asset.foundedYear}</strong></span> : null}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {asset.businessStatus ? <Badge variant="secondary">{asset.businessStatus}</Badge> : null}
          {asset.licenseType ? <Badge variant="outline">{asset.licenseType}</Badge> : null}
          {asset.regulator ? <Badge variant="outline">{asset.regulator}</Badge> : null}
        </div>
        <div className="mt-3">{match ? <MatchScore compact result={match} /> : null}</div>
      </div>
      <Button asChild className="w-full md:w-auto" variant="outline"><Link href={`/marketplace/${asset.id}`}>View Deal <ArrowRight className="size-4" /></Link></Button>
    </article>
  );
}

function formatMoney(value: unknown, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price on request";
  return new Intl.NumberFormat("en-US", { currency, maximumFractionDigits: 0, style: "currency" }).format(amount);
}
