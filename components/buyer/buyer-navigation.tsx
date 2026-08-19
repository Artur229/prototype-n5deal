"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, CircleUserRound, MessageSquare, Search } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";

export function BuyerNavigation({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-5 px-5 py-4 md:px-10">
        <Link className="mr-4 text-2xl font-bold tracking-[-0.05em]" href="/marketplace">N5Deal</Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-[#667085] md:gap-7">
          <NavLink active={pathname.startsWith("/marketplace")} href="/marketplace"><Search className="size-4" />Marketplace</NavLink>
          <NavLink active={pathname.startsWith("/profile")} href="/profile"><BriefcaseBusiness className="size-4" />My Profile</NavLink>
          <NavLink active={pathname.startsWith("/inquiries")} href="/inquiries"><MessageSquare className="size-4" />Inquiries</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-[#667085] lg:inline">{email}</span>
          <CircleUserRound className="size-8 text-[#263345]" />
          <SignOutButton className="rounded-full border-0 bg-[#f1f2ed] text-black hover:bg-[#e6e8e0]" />
        </div>
      </div>
    </header>
  );
}

function NavLink({ active = false, children, href }: { active?: boolean; children: React.ReactNode; href: string }) {
  return <Link className={`flex items-center gap-2 border-b-2 pb-1 transition ${active ? "border-black text-black" : "border-transparent hover:border-[#c6ef4e] hover:text-black"}`} href={href}>{children}</Link>;
}
