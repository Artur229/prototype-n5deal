import { UserRole } from "@prisma/client";

import { ManagerNavigation } from "@/components/manager/manager-navigation";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ManagerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole(UserRole.MANAGER);
  return <><ManagerNavigation email={user.email} />{children}</>;
}
