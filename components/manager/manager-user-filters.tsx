"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ManagerUserFilters({ values, countries }: { values: { search: string; role?: string; status?: string; country: string }; countries: string[] }) {
  const router = useRouter(); const pathname = usePathname(); const current = useSearchParams(); const [pending, startTransition] = useTransition(); const [search, setSearch] = useState(values.search);
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const params = new URLSearchParams(); for (const key of ["search", "role", "status", "country"]) { const value = String(data.get(key) ?? "").trim(); if (value) params.set(key, value); } for (const [key, value] of current.entries()) if (!["search", "role", "status", "country"].includes(key)) params.set(key, value); startTransition(() => router.push(`${pathname}?${params.toString()}`)); }
  return <form className="rounded-2xl border border-[#d9ded4] bg-white p-4 shadow-sm" onSubmit={submit}><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"><Input name="search" onChange={(event) => setSearch(event.target.value)} placeholder="Search name, company, email" value={search} /><Select name="role" value={values.role} options={["BUYER", "SELLER"]} placeholder="All roles" /><Select name="status" value={values.status} options={["ACTIVE", "SUSPENDED"]} placeholder="All statuses" /><Select name="country" value={values.country} options={countries} placeholder="All countries" /><Button disabled={pending} type="submit">{pending ? "Applying..." : "Apply"}</Button></div><Button asChild className="mt-3" variant="ghost"><Link href="/manager/users">Reset filters</Link></Button></form>;
}

function Select({ name, value, options, placeholder }: { name: string; value?: string; options: string[]; placeholder: string }) { return <select className="h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" defaultValue={value ?? ""} name={name}><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>; }
