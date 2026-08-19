"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ className }: { className?: string } = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function signOut() {
    setIsLoading(true);
    await createClient().auth.signOut();
    router.push("/login");
  }

  return <Button className={className} disabled={isLoading} onClick={signOut} variant="outline">{isLoading ? "Signing out…" : "Sign Out"}</Button>;
}
