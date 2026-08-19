"use server";

import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";
import { redirect } from "next/navigation";

import { getCurrentAppUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const demoRoleSchema = z.enum(["BUYER", "SELLER", "MANAGER"]);

const demoAccounts = {
  BUYER: {
    email: process.env.DEMO_BUYER_EMAIL,
    password: process.env.DEMO_BUYER_PASSWORD,
    role: UserRole.BUYER,
    destination: "/marketplace",
  },
  SELLER: {
    email: process.env.DEMO_SELLER_EMAIL,
    password: process.env.DEMO_SELLER_PASSWORD,
    role: UserRole.SELLER,
    destination: "/seller",
  },
  MANAGER: {
    email: process.env.DEMO_MANAGER_EMAIL,
    password: process.env.DEMO_MANAGER_PASSWORD,
    role: UserRole.MANAGER,
    destination: "/manager",
  },
} as const;

type DemoRole = z.infer<typeof demoRoleSchema>;

function getDemoAccount(role: DemoRole) {
  return demoAccounts[role];
}

export async function demoLogin(role: DemoRole) {
  const parsedRole = demoRoleSchema.safeParse(role);

  if (!parsedRole.success) {
    return { error: "Invalid demo account." };
  }

  const account = getDemoAccount(parsedRole.data);

  if (!account.email || !account.password) {
    return { error: "This demo account is not configured." };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  });

  if (signInError) {
    return { error: "Demo sign-in failed. Check the configured demo account." };
  }

  const user = await getCurrentAppUser();

  if (!user) {
    await supabase.auth.signOut();
    return { error: "This demo account is not linked to an application user." };
  }

  if (user.status !== UserStatus.ACTIVE) {
    await supabase.auth.signOut();
    return { error: "This demo account is suspended." };
  }

  if (user.role !== account.role) {
    await supabase.auth.signOut();
    return { error: "This demo account is configured for a different role." };
  }

  redirect(account.destination);
}
