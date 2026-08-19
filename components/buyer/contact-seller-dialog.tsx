"use client";

import { useActionState } from "react";

import {
  createInquiry,
  initialInquiryActionState,
} from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactSellerDialog({ assetId, sellerName }: { assetId: string; sellerName: string }) {
  const action = createInquiry.bind(null, assetId);
  const [state, formAction, pending] = useActionState(action, initialInquiryActionState);

  return (
    <Dialog>
      <DialogTrigger asChild><Button size="lg">Contact seller</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact {sellerName}</DialogTitle>
          <DialogDescription>Send a message about this active deal. Your inquiry will appear in Inquiries.</DialogDescription>
        </DialogHeader>
        {state.success ? (
          <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{state.message}</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <label className="space-y-2 text-sm font-medium">
              Message
              <textarea name="message" className="min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="I am interested in learning more about this opportunity..." required />
              {state.errors?.message?.[0] ? <span className="block text-xs font-normal text-red-600">{state.errors.message[0]}</span> : null}
            </label>
            {state.message ? <p className="text-sm text-red-600">{state.message}</p> : null}
            <DialogFooter><Button disabled={pending} type="submit">{pending ? "Sending..." : "Send inquiry"}</Button></DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
