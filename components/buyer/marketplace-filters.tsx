"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MarketplaceFiltersProps = {
  countries: string[];
  businessTypes: string[];
  values: { q: string; country: string; type: string; minPrice?: number; maxPrice?: number; sort: "newest" | "match" };
};

export function MarketplaceFilters({ countries, businessTypes, values }: MarketplaceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    for (const key of ["q", "country", "type", "minPrice", "maxPrice", "sort"]) {
      const value = String(formData.get(key) ?? "").trim();
      if (value) params.set(key, value);
      else params.delete(key);
    }

    startTransition(() => router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`));
  }

  function reset() {
    startTransition(() => router.push(pathname));
  }

  return (
    <form className="grid gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_1fr_auto_auto]" onSubmit={submit}>
      <Input defaultValue={values.q} name="q" placeholder="Search title, country, regulator..." />
      <SelectField label="Country" name="country" options={countries} value={values.country} />
      <SelectField label="Business type" name="type" options={businessTypes} value={values.type} />
      <Input defaultValue={values.minPrice} min="0" name="minPrice" placeholder="Min price" step="0.01" type="number" />
      <Input defaultValue={values.maxPrice} min="0" name="maxPrice" placeholder="Max price" step="0.01" type="number" />
      <SelectField label="Sort" name="sort" options={["newest", "match"]} value={values.sort} labels={{ newest: "Newest", match: "Best match" }} />
      <Button className="h-9 bg-[#059669] text-white hover:bg-[#047857]" disabled={isPending} type="submit">{isPending ? "Applying…" : "Apply"}</Button>
      <Button className="h-9" disabled={isPending} onClick={reset} type="button" variant="outline">Reset</Button>
    </form>
  );
}

function SelectField({ label, name, options, value, labels }: { label: string; name: string; options: string[]; value: string; labels?: Record<string, string> }) {
  return (
    <label className="flex h-9 items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
      <span className="sr-only">{label}</span>
      <select className="w-full bg-transparent text-foreground outline-none" defaultValue={value} name={name}>
        <option value="">All {label.toLowerCase()}s</option>
        {options.map((option) => <option key={option} value={option}>{labels?.[option] ?? option}</option>)}
      </select>
    </label>
  );
}
