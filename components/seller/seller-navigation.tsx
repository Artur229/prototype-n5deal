"use client";

import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, MessageSquare, UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/seller", label: "Overview", icon: LayoutDashboard },
  { href: "/seller/assets", label: "My Assets", icon: BriefcaseBusiness },
  { href: "/seller/buyers", label: "Browse Buyers", icon: UsersRound },
  { href: "/seller/inquiries", label: "Inquiries", icon: MessageSquare },
];

export function SellerNavigation({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-5 px-5 py-4 md:px-10">
        <Link className="mr-4 text-2xl font-bold tracking-[-0.05em]" href="/seller">N5Deal</Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-[#667085] md:gap-7">
          {links.map(({ href, icon: Icon, label }) => <Link className={`flex items-center gap-2 border-b-2 pb-1 transition ${pathname === href || (href !== "/seller" && pathname.startsWith(href)) ? "border-black text-black" : "border-transparent hover:border-[#c6ef4e] hover:text-black"}`} href={href} key={href}><Icon className="size-4" />{label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-3"><span className="hidden text-sm text-[#667085] lg:inline">{email}</span><SignOutButton className="rounded-full border-0 bg-[#f1f2ed] text-black hover:bg-[#e6e8e0]" /></div>
      </div>
    </header>
  );
}
