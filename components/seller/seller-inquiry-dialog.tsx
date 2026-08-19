"use client";

import { useActionState } from "react";

import { createSellerInquiry, initialSellerInquiryActionState } from "@/actions/seller-inquiries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type AssetOption = { id: string; title: string };

export function SellerInquiryDialog({ buyerId, buyerName, assets }: { buyerId: string; buyerName: string; assets: AssetOption[] }) {
  const [state, formAction, pending] = useActionState(createSellerInquiry, initialSellerInquiryActionState);
  return <Dialog><DialogTrigger asChild><Button>Contact Buyer</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Contact {buyerName}</DialogTitle><DialogDescription>Send a professional acquisition message. You can optionally attach one of your assets.</DialogDescription></DialogHeader>{state.success ? <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{state.message}</p> : <form action={formAction} className="space-y-4"><input name="buyerId" type="hidden" value={buyerId} /><label className="space-y-2 text-sm font-medium">Related asset <select className="h-9 w-full rounded-md border bg-white px-3 text-sm" defaultValue="" name="assetId"><option value="">No asset attached</option>{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.title}</option>)}</select></label><label className="space-y-2 text-sm font-medium">Message<textarea className="min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" name="message" placeholder="I would like to discuss your acquisition mandate..." required />{state.errors?.message?.[0] ? <span className="block text-xs font-normal text-red-600">{state.errors.message[0]}</span> : null}</label>{state.message ? <p className="text-sm text-red-600">{state.message}</p> : null}<DialogFooter><Button disabled={pending} type="submit">{pending ? "Sending..." : "Send inquiry"}</Button></DialogFooter></form>}</DialogContent></Dialog>;
}
