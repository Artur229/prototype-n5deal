import { Prisma, UserRole, UserStatus } from "@prisma/client";

import { ManagerUserActions } from "@/components/manager/manager-user-actions";
import { ManagerUserFilters } from "@/components/manager/manager-user-filters";
import { Badge } from "@/components/ui/badge";
import { SellerDataState } from "@/components/seller/seller-data-state";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseManagerUserFilters } from "@/lib/validations/manager";

export const dynamic = "force-dynamic";

export default async function ManagerUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireRole(UserRole.MANAGER);
  const parsed = parseManagerUserFilters(await searchParams);
  const where: Prisma.UserWhereInput = { role: parsed.filters.role ? parsed.filters.role : { in: [UserRole.BUYER, UserRole.SELLER] }, ...(parsed.filters.status ? { status: parsed.filters.status } : {}), ...(parsed.filters.country ? { country: parsed.filters.country } : {}), ...(parsed.filters.search ? { OR: [{ name: { contains: parsed.filters.search, mode: "insensitive" } }, { company: { contains: parsed.filters.search, mode: "insensitive" } }, { email: { contains: parsed.filters.search, mode: "insensitive" } }, { country: { contains: parsed.filters.search, mode: "insensitive" } }] } : {}) };
  let users;
  let countries;
  try {
    [users, countries] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, name: true, company: true, email: true, role: true, country: true, status: true, createdAt: true } }),
      prisma.user.findMany({ where: { role: { in: [UserRole.BUYER, UserRole.SELLER] } }, distinct: ["country"], orderBy: { country: "asc" }, select: { country: true } }),
    ]);
  } catch {
    return <main className="mx-auto max-w-6xl px-5 py-10 md:px-10"><SellerDataState message="User management is temporarily unavailable." /></main>;
  }

  return <main className="mx-auto max-w-7xl bg-[#eaecdf] px-5 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#059669]">Platform operations</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Users</h1><p className="mt-3 text-[#667085]">Manage active marketplace participants. Manager accounts are excluded from this table.</p></div><ManagerUserFilters countries={countries.map((item) => item.country)} values={parsed.filters} />{parsed.invalid ? <p className="mt-4 text-sm text-[#b45309]">Some filter values were invalid and have been reset.</p> : null}<div className="mb-4 mt-8 text-sm text-[#667085]">Showing {users.length} participant{users.length === 1 ? "" : "s"}</div>{users.length === 0 ? <SellerDataState message="No participants match your filters." actionHref="/manager/users" /> : <div className="overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-[#e5e7eb] text-xs uppercase tracking-wide text-[#667085]"><tr><th className="px-5 py-4">Participant</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Country</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Created</th><th className="px-5 py-4" /></tr></thead><tbody>{users.map((participant) => <tr className="border-b border-[#f0f0f0] last:border-0" key={participant.id}><td className="px-5 py-5"><p className="font-semibold">{participant.name}</p><p className="mt-1 text-xs text-[#667085]">{participant.company ?? "Independent"} · {participant.email}</p></td><td className="px-5 py-5"><Badge variant="outline">{participant.role}</Badge></td><td className="px-5 py-5">{participant.country}</td><td className="px-5 py-5"><Badge variant={participant.status === UserStatus.ACTIVE ? "secondary" : "outline"}>{participant.status}</Badge></td><td className="px-5 py-5 text-[#667085]">{participant.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}</td><td className="px-5 py-5"><ManagerUserActions name={participant.name} status={participant.status} userId={participant.id} /></td></tr>)}</tbody></table></div>}</main>;
}
