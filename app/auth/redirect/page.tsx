import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuthRedirectPage() {
  const user = await requireUser();

  const destination = {
    [UserRole.BUYER]: "/buyer",
    [UserRole.SELLER]: "/seller",
    [UserRole.MANAGER]: "/manager",
  }[user.role];

  redirect(destination);
}
