"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ManagerAssetFilters({ values, countries, businessTypes }: { values: { search: string; status?: string; sellerStatus?: string; country: string; businessType: string }; countries: string[]; businessTypes: string[] }) {
  const router = useRouter(); const pathname = usePathname(); const current = useSearchParams(); const [pending, startTransition] = useTransition(); const [search, setSearch] = useState(values.search);
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const params = new URLSearchParams(); for (const key of ["search", "status", "sellerStatus", "country", "businessType"]) { const value = String(data.get(key) ?? "").trim(); if (value) params.set(key, value); } for (const [key, value] of current.entries()) if (!["search", "status", "sellerStatus", "country", "businessType"].includes(key)) params.set(key, value); startTransition(() => router.push(`${pathname}?${params.toString()}`)); }
  return <form className="rounded-2xl border border-[#d9ded4] bg-white p-4 shadow-sm" onSubmit={submit}><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"><Input name="search" onChange={(event) => setSearch(event.target.value)} placeholder="Search title or business type" value={search} /><Select name="status" value={values.status} options={["DRAFT", "ACTIVE", "SUSPENDED", "SOLD"]} placeholder="All asset statuses" /><Select name="sellerStatus" value={values.sellerStatus} options={["ACTIVE", "SUSPENDED"]} placeholder="All seller statuses" /><Select name="country" value={values.country} options={countries} placeholder="All countries" /><Select name="businessType" value={values.businessType} options={businessTypes} placeholder="All business types" /><Button disabled={pending} type="submit">{pending ? "Applying..." : "Apply"}</Button></div><Button asChild className="mt-3" variant="ghost"><Link href="/manager/assets">Reset filters</Link></Button></form>;
}

function Select({ name, value, options, placeholder }: { name: string; value?: string; options: string[]; placeholder: string }) { return <select className="h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" defaultValue={value ?? ""} name={name}><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>; }
