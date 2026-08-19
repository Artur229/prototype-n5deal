"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { initialProfileActionState, updateBuyerProfile } from "@/actions/buyer-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileFormValues = { bio: string; minBudget: string; maxBudget: string; preferredCountries: string; preferredIndustries: string; preferredAssetTypes: string };
type ProfileFormProps = { initialValues: ProfileFormValues; account: { name: string; company: string | null; country: string } };

export function ProfileForm({ initialValues, account }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateBuyerProfile, initialProfileActionState);
  const { register, handleSubmit } = useForm<ProfileFormValues>({ defaultValues: initialValues });

  return <form className="space-y-8 rounded-lg border border-[#e5e7eb] bg-white p-5 md:p-6" onSubmit={handleSubmit((_values, event) => { const form = event?.currentTarget; if (form instanceof HTMLFormElement) formAction(new FormData(form)); })}>
    <FormSection title="Company information" description="Your account identity is managed by the platform. Contact support to change it.">
      <div className="grid gap-4 md:grid-cols-3"><ReadOnlyField label="Name" value={account.name} /><ReadOnlyField label="Company" value={account.company ?? "Not provided"} /><ReadOnlyField label="Country" value={account.country} /></div>
      <label className="mt-4 block space-y-2 text-sm font-medium">About you<textarea {...register("bio")} className="min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Tell sellers what you are looking to acquire..." /> <FieldError message={state.errors?.bio?.[0]} /></label>
    </FormSection>
    <FormSection title="Acquisition preferences" description="These preferences power your personalized Smart Match results.">
      <div className="grid gap-4 md:grid-cols-2"><Field label="Minimum budget" helper="Leave blank if there is no minimum." type="number" step="0.01" prefix="$" {...register("minBudget")} error={state.errors?.minBudget?.[0]} /><Field label="Maximum budget" helper="Leave blank if there is no maximum." type="number" step="0.01" prefix="$" {...register("maxBudget")} error={state.errors?.maxBudget?.[0]} /><Field label="Preferred countries" helper="Comma-separated country codes or names." placeholder="US, GB, DE" {...register("preferredCountries")} error={state.errors?.preferredCountries?.[0]} /><Field label="Preferred industries" placeholder="Fintech, Healthcare" {...register("preferredIndustries")} error={state.errors?.preferredIndustries?.[0]} /><Field className="md:col-span-2" label="Preferred asset types" placeholder="Licensed business, SaaS" {...register("preferredAssetTypes")} error={state.errors?.preferredAssetTypes?.[0]} /></div>
    </FormSection>
    {state.message ? <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-600"}>{state.message}</p> : null}
    <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? "Saving..." : "Save changes"}</Button></div>
  </form>;
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="border-b border-[#eef1f2] pb-7 last:border-0 last:pb-0"><h2 className="text-lg font-semibold tracking-tight">{title}</h2><p className="mt-1 text-sm text-[#667085]">{description}</p><div className="mt-5">{children}</div></section>; }
function ReadOnlyField({ label, value }: { label: string; value: string }) { return <label className="space-y-2 text-sm font-medium">{label}<Input className="bg-[#f8f9fa] text-[#667085]" disabled value={value} /></label>; }
function Field({ label, helper, prefix, error, className, ...props }: React.ComponentProps<typeof Input> & { label: string; helper?: string; prefix?: string; error?: string }) { return <label className={`space-y-2 text-sm font-medium ${className ?? ""}`}>{label}{helper ? <span className="block text-xs font-normal text-[#667085]">{helper}</span> : null}<div className="relative">{prefix ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">{prefix}</span> : null}<Input className={prefix ? "pl-7" : undefined} {...props} /></div><FieldError message={error} /></label>; }
function FieldError({ message }: { message?: string }) { return message ? <span className="block text-xs font-normal text-red-600">{message}</span> : null; }
