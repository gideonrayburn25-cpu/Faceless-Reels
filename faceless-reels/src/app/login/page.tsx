"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-edge bg-panel p-8">
        <Link href="/" className="font-serif text-xl">
          Faceless<span className="text-gold">Reels</span>
        </Link>

        <h1 className="mt-8 font-serif text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we&apos;ll send you a magic link.
        </p>

        {sent ? (
          <div className="mt-8 rounded-xl border border-gold/40 bg-gold/5 p-5 text-sm">
            ✅ Check your inbox — a magic link is on its way to{" "}
            <span className="text-gold">{email}</span>.
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-8 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-edge bg-ink px-4 py-3 text-sm outline-none focus:border-gold"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gold px-4 py-3 font-medium text-ink hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </main>
  );
}
