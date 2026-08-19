import { MatchResult } from "@/lib/matching";

export function MatchScore({ result, compact = false }: { result: MatchResult; compact?: boolean }) {
  if (!result.isSufficient) {
    return <p className="text-xs font-medium text-[#667085]">Complete profile for match score</p>;
  }
  if (compact) {
    return <span className="inline-flex items-center rounded-full bg-[#ecfdf3] px-3 py-1 text-xs font-semibold text-[#047857]">{result.score}% Match</span>;
  }
  return <section className="rounded-2xl border border-[#d8e6d9] bg-[#f5faf3] p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#059669]">Your Match</p><p className="mt-2 text-4xl font-bold tracking-tight">{result.score}<span className="text-lg font-medium text-[#667085]"> / 100</span></p><p className="mt-1 font-medium text-[#047857]">{result.level}</p></div><div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-[#dbe8da]"><div className="h-full rounded-full bg-[#059669]" style={{ width: `${result.score}%` }} /></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{result.reasons.map((reason, index) => <p className="text-sm leading-6 text-[#374151]" key={`${reason}-${index}`}>{reason}</p>)}</div><div className="mt-6 grid grid-cols-5 gap-2 border-t border-[#d8e6d9] pt-4 text-center text-xs text-[#667085]"><Breakdown label="Budget" value={result.breakdown.budget} max={30} /><Breakdown label="Industry" value={result.breakdown.industry} max={30} /><Breakdown label="Geography" value={result.breakdown.geography} max={20} /><Breakdown label="Asset type" value={result.breakdown.assetType} max={10} /><Breakdown label="Status" value={result.breakdown.businessStatus} max={10} /></div></section>;
}

function Breakdown({ label, value, max }: { label: string; value: number; max: number }) { return <div><p className="font-semibold text-[#1f2937]">{value}/{max}</p><p className="mt-1">{label}</p></div>; }
