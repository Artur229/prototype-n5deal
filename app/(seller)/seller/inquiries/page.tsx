import { UserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { SellerDataState } from "@/components/seller/seller-data-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SellerInquiriesPage() {
  const user = await requireRole(UserRole.SELLER);
  let inquiries;
  try {
    inquiries = await prisma.inquiry.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      orderBy: { createdAt: "desc" },
      select: { id: true, senderId: true, message: true, status: true, createdAt: true, asset: { select: { title: true } }, sender: { select: { name: true, company: true, role: true } }, receiver: { select: { name: true, company: true, role: true } } },
    });
  } catch {
    return <main className="mx-auto max-w-6xl px-5 py-10 md:px-10"><SellerDataState message="Your inquiries are temporarily unavailable." /></main>;
  }

  return <main className="mx-auto max-w-6xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Seller workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Inquiries</h1><p className="mt-3 text-[#667085]">Review messages sent and received through the marketplace.</p></div>{inquiries.length === 0 ? <SellerDataState message="You have no inquiries yet." actionHref="/seller/buyers" /> : <div className="space-y-4">{inquiries.map((inquiry) => { const received = inquiry.receiver.role === UserRole.SELLER; const counterparty = inquiry.senderId === user.id ? inquiry.receiver : inquiry.sender; return <article className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm" key={inquiry.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#059669]">{received ? "Received" : "Sent"}</p><h2 className="mt-1 font-semibold">{counterparty.name}{counterparty.company ? ` · ${counterparty.company}` : ""}</h2><p className="mt-1 text-sm text-[#667085]">{inquiry.asset?.title ?? "No related asset"}</p></div><Badge variant={inquiry.status === "NEW" ? "secondary" : "outline"}>{inquiry.status}</Badge></div><p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#4b5563]">{inquiry.message}</p><p className="mt-4 text-xs text-[#667085]">{inquiry.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}</p></article>; })}</div>}</main>;
}
