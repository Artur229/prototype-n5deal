import { UserRole, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentAppUser() {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();

  if (!supabaseUser) {
    return null;
  }

  let appUser = await prisma.user.findUnique({
    where: { authUserId: supabaseUser.id },
  });

  if (!appUser && supabaseUser.email) {
    const emailMatch = await prisma.user.findFirst({
      where: {
        email: supabaseUser.email,
        authUserId: null,
      },
    });

    if (emailMatch) {
      appUser = await prisma.user.update({
        where: { id: emailMatch.id },
        data: { authUserId: supabaseUser.id },
      });
    }
  }

  return appUser;
}

export async function requireUser() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/login?error=not-configured");
  }

  if (user.status === UserStatus.SUSPENDED) {
    redirect("/login?error=suspended");
  }

  return user;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireUser();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(user.role)) {
    redirect("/forbidden");
  }

  return user;
}
