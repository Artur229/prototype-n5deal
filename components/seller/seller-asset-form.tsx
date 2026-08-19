"use client";

import { AssetStatus } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { createSellerAsset, initialAssetActionState, updateSellerAsset } from "@/actions/seller-assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AssetFormValues = { title: string; description: string; askingPrice: string; currency: string; country: string; businessType: string; assetType: string; licenseType: string; regulator: string; businessStatus: string; employees: string; foundedYear: string; annualRevenue: string; benefits: string; status: AssetStatus };

export function SellerAssetForm({ initialValues, assetId }: { initialValues: AssetFormValues; assetId?: string }) {
  const action = assetId ? updateSellerAsset.bind(null, assetId) : createSellerAsset;
  const [state, formAction, pending] = useActionState(action, initialAssetActionState);
  const { register, handleSubmit } = useForm<AssetFormValues>({ defaultValues: initialValues });
  const cancelHref = assetId ? `/seller/assets/${assetId}` : "/seller/assets";

  return <form className="space-y-8 rounded-lg border border-[#e5e7eb] bg-white p-5 md:p-6" onSubmit={handleSubmit((_values, event) => { const form = event?.currentTarget; if (form instanceof HTMLFormElement) formAction(new FormData(form)); })}>
    <FormSection title="Basic information" description="Give Buyers a clear, concise overview of the opportunity."><div className="grid gap-4 md:grid-cols-2"><Field className="md:col-span-2" label="Title" error={state.errors?.title?.[0]} {...register("title")} /><label className="space-y-2 text-sm font-medium md:col-span-2">Description<textarea className="min-h-36 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register("description")} />{errorText(state.errors?.description?.[0])}</label><Field label="Country code" helper="Two-letter country code, for example GB." placeholder="GB" maxLength={2} error={state.errors?.country?.[0]} {...register("country")} /></div></FormSection>
    <FormSection title="Deal information" description="Core commercial information shown in the marketplace."><div className="grid gap-4 md:grid-cols-2"><Field label="Asking price" type="number" min="0" step="0.01" error={state.errors?.askingPrice?.[0]} {...register("askingPrice")} /><Field label="Currency" placeholder="USD" maxLength={3} error={state.errors?.currency?.[0]} {...register("currency")} /><Field label="Business type" placeholder="Fintech" error={state.errors?.businessType?.[0]} {...register("businessType")} /><Field label="Asset type" placeholder="Licensed business" error={state.errors?.assetType?.[0]} {...register("assetType")} /></div></FormSection>
    <FormSection title="Regulatory information" description="Add licensing and regulatory context where applicable."><div className="grid gap-4 md:grid-cols-2"><Field label="License type" error={state.errors?.licenseType?.[0]} {...register("licenseType")} /><Field label="Regulator" error={state.errors?.regulator?.[0]} {...register("regulator")} /><Field label="Business status" error={state.errors?.businessStatus?.[0]} {...register("businessStatus")} /><label className="space-y-2 text-sm font-medium">Listing status<select className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register("status")}>{Object.values(AssetStatus).map((status) => <option key={status} value={status}>{status}</option>)}</select>{errorText(state.errors?.status?.[0])}</label></div></FormSection>
    <FormSection title="Company metrics" description="Optional operating information helps Buyers compare opportunities."><div className="grid gap-4 md:grid-cols-3"><Field label="Annual revenue" type="number" min="0" step="0.01" error={state.errors?.annualRevenue?.[0]} {...register("annualRevenue")} /><Field label="Employees" type="number" min="0" error={state.errors?.employees?.[0]} {...register("employees")} /><Field label="Founded year" type="number" min="1800" max={new Date().getFullYear() + 1} error={state.errors?.foundedYear?.[0]} {...register("foundedYear")} /></div></FormSection>
    <FormSection title="Additional benefits" description="Use short comma-separated points to highlight what is included."><label className="space-y-2 text-sm font-medium">Benefits <span className="font-normal text-[#667085]">(comma-separated)</span><Input placeholder="Regulated, Profitable, Global clients" {...register("benefits")} />{errorText(state.errors?.benefits?.[0])}</label></FormSection>
    {state.message ? <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-600"}>{state.message}</p> : null}
    <div className="flex flex-wrap justify-end gap-3"><Button asChild variant="outline"><Link href={cancelHref}>Cancel</Link></Button><Button disabled={pending} type="submit">{pending ? "Saving..." : assetId ? "Save changes" : "Create asset"}</Button></div>
  </form>;
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="border-b border-[#eef1f2] pb-7 last:border-0 last:pb-0"><h2 className="text-lg font-semibold tracking-tight">{title}</h2><p className="mt-1 text-sm text-[#667085]">{description}</p><div className="mt-5">{children}</div></section>; }
function Field({ label, helper, error, className, ...props }: React.ComponentProps<typeof Input> & { label: string; helper?: string; error?: string }) { return <label className={`space-y-2 text-sm font-medium ${className ?? ""}`}>{label}{helper ? <span className="block text-xs font-normal text-[#667085]">{helper}</span> : null}<Input {...props} />{errorText(error)}</label>; }
function errorText(message?: string) { return message ? <span className="block text-xs font-normal text-red-600">{message}</span> : null; }
