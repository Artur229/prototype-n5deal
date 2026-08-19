"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { deleteSellerAsset, initialAssetActionState } from "@/actions/seller-assets";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function DeleteAssetDialog({ assetId, title }: { assetId: string; title: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deleteSellerAsset.bind(null, assetId), initialAssetActionState);

  useEffect(() => { if (state.success) router.push("/seller/assets"); }, [router, state.success]);

  return <Dialog><DialogTrigger asChild><Button size="sm" variant="outline">Delete</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Delete {title}?</DialogTitle><DialogDescription>This permanently removes the asset. Related inquiries will remain but no longer reference it.</DialogDescription></DialogHeader><form action={formAction}><p className="mb-4 text-sm text-red-600">This action cannot be undone.</p>{state.message && !state.success ? <p className="mb-4 text-sm text-red-600">{state.message}</p> : null}<DialogFooter><DialogClose asChild><Button disabled={pending} variant="outline" type="button">Cancel</Button></DialogClose><Button disabled={pending} type="submit" variant="destructive">{pending ? "Deleting..." : "Delete asset"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
