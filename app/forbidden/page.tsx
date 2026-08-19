import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <section className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Access not permitted</h1>
        <p className="text-muted-foreground">Your account does not have access to this area.</p>
        <Button asChild variant="outline"><Link href="/">Return home</Link></Button>
      </section>
    </main>
  );
}
