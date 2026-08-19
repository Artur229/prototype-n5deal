import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="w-full max-w-xl space-y-6 text-center">
        <Badge variant="secondary">Foundation ready</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">N5Deal Marketplace</h1>
          <p className="text-muted-foreground">
            The initial Next.js foundation is running and ready for the next implementation step.
          </p>
        </div>
      </section>
    </main>
  );
}
