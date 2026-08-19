"use client";

import { UserStatus } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { initialManagerActionState, moderateUser, removeUser } from "@/actions/manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ManagerUserActions({ userId, name, status }: { userId: string; name: string; status: UserStatus }) {
  return <div className="flex justify-end gap-2">{status === UserStatus.ACTIVE ? <StatusDialog userId={userId} name={name} nextStatus={UserStatus.SUSPENDED} /> : <StatusDialog userId={userId} name={name} nextStatus={UserStatus.ACTIVE} />}<RemoveDialog userId={userId} name={name} /></div>;
}

function StatusDialog({ userId, name, nextStatus }: { userId: string; name: string; nextStatus: UserStatus }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(moderateUser.bind(null, userId, nextStatus), initialManagerActionState);
  useEffect(() => { if (state.success) router.refresh(); }, [router, state.success]);
  const suspend = nextStatus === UserStatus.SUSPENDED;
  return <Dialog><DialogTrigger asChild><Button size="sm" variant="outline">{suspend ? "Suspend" : "Reactivate"}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{suspend ? "Suspend" : "Reactivate"} {name}?</DialogTitle><DialogDescription>{suspend ? "The participant will lose access to protected marketplace features. Sellers' active listings will no longer be visible to Buyers." : "The participant will regain access according to their role, and eligible marketplace visibility will return."}</DialogDescription></DialogHeader><form action={formAction}>{state.message ? <p className="mb-4 text-sm text-red-600">{state.message}</p> : null}<DialogFooter><DialogClose asChild><Button disabled={pending} type="button" variant="outline">Cancel</Button></DialogClose><Button disabled={pending} type="submit">{pending ? "Saving..." : suspend ? "Suspend participant" : "Reactivate participant"}</Button></DialogFooter></form></DialogContent></Dialog>;
}

function RemoveDialog({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(removeUser.bind(null, userId), initialManagerActionState);
  useEffect(() => { if (state.success) router.refresh(); }, [router, state.success]);
  return <Dialog><DialogTrigger asChild><Button size="sm" variant="outline">Remove</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Remove {name}?</DialogTitle><DialogDescription>This permanently removes the participant only when no assets or Inquiry history depend on the account. Otherwise the action will safely refuse and you should suspend the account.</DialogDescription></DialogHeader><form action={formAction}><p className="mb-4 text-sm text-red-600">This is a destructive action.</p>{state.message ? <p className="mb-4 text-sm text-red-600">{state.message}</p> : null}<DialogFooter><DialogClose asChild><Button disabled={pending} type="button" variant="outline">Cancel</Button></DialogClose><Button disabled={pending} type="submit" variant="destructive">{pending ? "Removing..." : "Remove participant"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
