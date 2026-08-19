"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FilterValues = { q: string; industry: string; country: string; assetType: string; minBudget?: number; maxBudget?: number };

export function BuyerFilters({ values, industries, countries, assetTypes }: { values: FilterValues; industries: string[]; countries: string[]; assetTypes: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(values.q);
  const [minBudget, setMinBudget] = useState(values.minBudget?.toString() ?? "");
  const [maxBudget, setMaxBudget] = useState(values.maxBudget?.toString() ?? "");

  function apply(formData: FormData) {
    const params = new URLSearchParams(currentParams.toString());
    for (const key of ["q", "industry", "country", "assetType", "minBudget", "maxBudget"]) params.delete(key);
    for (const key of ["q", "industry", "country", "assetType", "minBudget", "maxBudget"]) { const value = String(formData.get(key) ?? "").trim(); if (value) params.set(key, value); }
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return <form className="rounded-2xl border border-[#d9ded4] bg-white p-4 shadow-sm" onSubmit={(event) => { event.preventDefault(); apply(new FormData(event.currentTarget)); }}><div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]"><Input name="q" onChange={(event) => setQ(event.target.value)} placeholder="Search name or company" value={q} /><SelectField name="industry" value={values.industry} options={industries} placeholder="Industry" /><SelectField name="country" value={values.country} options={countries} placeholder="Country" /><SelectField name="assetType" value={values.assetType} options={assetTypes} placeholder="Asset type" /><Input min="0" name="minBudget" onChange={(event) => setMinBudget(event.target.value)} placeholder="Min budget" type="number" value={minBudget} /><Input min="0" name="maxBudget" onChange={(event) => setMaxBudget(event.target.value)} placeholder="Max budget" type="number" value={maxBudget} /><Button disabled={pending} type="submit">{pending ? "Applying..." : "Apply"}</Button></div><Button asChild className="mt-3" variant="ghost"><Link href="/seller/buyers">Reset filters</Link></Button></form>;
}

function SelectField({ name, value, options, placeholder }: { name: string; value: string; options: string[]; placeholder: string }) { return <select className="h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" defaultValue={value} name={name}><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>; }
