import { UserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { BuyerDataState } from "@/components/buyer/buyer-data-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BuyerInquiriesPage() {
  const user = await requireRole(UserRole.BUYER);

  let inquiries;
  try {
    inquiries = await prisma.inquiry.findMany({
      where: { senderId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, message: true, status: true, createdAt: true,
        asset: { select: { title: true } },
        receiver: { select: { name: true, company: true } },
      },
    });

  } catch {
    return <BuyerDataState message="Your inquiries are temporarily unavailable." />;
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-10">
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Buyer account</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Inquiries</h1><p className="mt-3 text-[#667085]">Track messages you have sent to sellers.</p></div>
      {inquiries.length === 0 ? <BuyerDataState message="You have not contacted any sellers yet." /> : <div className="space-y-4">{inquiries.map((inquiry) => <article className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm" key={inquiry.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{inquiry.asset?.title ?? "Marketplace inquiry"}</h2><p className="mt-1 text-sm text-[#667085]">To {inquiry.receiver.name}{inquiry.receiver.company ? ` · ${inquiry.receiver.company}` : ""}</p></div><Badge variant={inquiry.status === "NEW" ? "secondary" : "outline"}>{inquiry.status.toLowerCase()}</Badge></div><p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#4b5563]">{inquiry.message}</p><p className="mt-4 text-xs text-[#667085]">{inquiry.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}</p></article>)}</div>}
    </main>
  );
}
