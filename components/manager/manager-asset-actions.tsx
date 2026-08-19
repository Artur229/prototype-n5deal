"use client";

import { AssetStatus } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { initialManagerActionState, moderateAsset } from "@/actions/manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ManagerAssetActions({ assetId, title, status }: { assetId: string; title: string; status: AssetStatus }) {
  if (status !== AssetStatus.ACTIVE && status !== AssetStatus.SUSPENDED) return <span className="text-xs text-[#667085]">No moderation action</span>;
  return <ModerationDialog assetId={assetId} title={title} nextStatus={status === AssetStatus.ACTIVE ? AssetStatus.SUSPENDED : AssetStatus.ACTIVE} />;
}

function ModerationDialog({ assetId, title, nextStatus }: { assetId: string; title: string; nextStatus: AssetStatus }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(moderateAsset.bind(null, assetId, nextStatus), initialManagerActionState);
  useEffect(() => { if (state.success) router.refresh(); }, [router, state.success]);
  const suspend = nextStatus === AssetStatus.SUSPENDED;
  return <Dialog><DialogTrigger asChild><Button size="sm" variant="outline">{suspend ? "Suspend" : "Reactivate"}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{suspend ? "Suspend" : "Reactivate"} {title}?</DialogTitle><DialogDescription>{suspend ? "This ACTIVE asset will immediately disappear from the Buyer marketplace." : "This asset will become eligible for marketplace visibility if its Seller is ACTIVE."}</DialogDescription></DialogHeader><form action={formAction}><DialogFooter><DialogClose asChild><Button disabled={pending} type="button" variant="outline">Cancel</Button></DialogClose><Button disabled={pending} type="submit">{pending ? "Saving..." : suspend ? "Suspend asset" : "Reactivate asset"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
