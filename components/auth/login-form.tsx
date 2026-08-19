"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const demoAccounts = [
  { label: "Demo Buyer", email: "ana.novak@northstarcapital.eu" },
  { label: "Demo Seller", email: "martin.hughes@finwave.co.uk" },
  { label: "Demo Manager", email: "manager@n5deal.eu" },
];

function getErrorMessage(error?: string) {
  switch (error) {
    case "suspended":
      return "Your account has been suspended.";
    case "not-configured":
      return "Your Supabase account is not linked to an application user.";
    case "unauthorized":
      return "Please sign in to continue.";
    case "supabase-config":
      return "Supabase authentication is not configured for this environment.";
    default:
      return error;
  }
}

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(getErrorMessage(initialError));
  const [demoMessage, setDemoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setDemoMessage("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.push("/auth/redirect");
  }

  function selectDemoAccount(account: (typeof demoAccounts)[number]) {
    setEmail(account.email);
    setPassword("");
    setError(undefined);
    setDemoMessage("Enter the password configured for this Supabase demo account.");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to N5Deal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
          {demoMessage ? <p className="text-sm text-muted-foreground">{demoMessage}</p> : null}
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="space-y-2 border-t pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Demo accounts</p>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((account) => (
              <Button key={account.email} size="sm" type="button" variant="outline" onClick={() => selectDemoAccount(account)}>
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
