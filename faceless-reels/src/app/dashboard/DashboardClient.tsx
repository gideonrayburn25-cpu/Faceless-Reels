"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NICHES } from "@/lib/niches";

type Video = {
  id: string;
  niche: string;
  prompt: string;
  status: string;
  video_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
};

export default function DashboardClient({
  email,
  credits,
  isSubscribed,
  initialVideos,
}: {
  email: string;
  credits: number;
  isSubscribed: boolean;
  initialVideos: Video[];
}) {
  const router = useRouter();
  const [niche, setNiche] = useState(NICHES[0].slug);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [localCredits, setLocalCredits] = useState(credits);

  const canGenerate = isSubscribed || localCredits > 0;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!canGenerate) {
      setPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, prompt }),
    });

    setLoading(false);

    if (res.status === 402) {
      setPaywall(true);
      return;
    }
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong. Try again.");
      return;
    }

    const { video } = await res.json();
    setVideos((v) => [video, ...v]);
    if (!isSubscribed) setLocalCredits((c) => Math.max(0, c - 1));
    setPrompt("");
  };

  const handleSubscribe = async () => {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between border-b border-edge px-6 py-5 md:px-10">
        <span className="font-serif text-xl">
          Faceless<span className="text-gold">Reels</span>
        </span>
        <div className="flex items-center gap-5 text-sm">
          <span className="rounded-full border border-edge px-3 py-1 text-muted">
            {isSubscribed ? "Pro · unlimited" : `${localCredits} credit${localCredits === 1 ? "" : "s"} left`}
          </span>
          <span className="hidden text-muted md:inline">{email}</span>
          <button onClick={handleSignOut} className="text-muted hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-[380px_1fr] md:px-10">
        {/* generator */}
        <section>
          <h1 className="font-serif text-3xl">Create a video</h1>
          <p className="mt-2 text-sm text-muted">
            Pick a niche, describe your idea, and generate.
          </p>

          <label className="mt-8 block text-sm text-muted">Niche</label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {NICHES.map((n) => (
              <button
                key={n.slug}
                onClick={() => setNiche(n.slug)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  niche === n.slug
                    ? "border-gold bg-gold/10"
                    : "border-edge bg-panel hover:border-gold/50"
                }`}
              >
                <span>{n.emoji}</span>
                <span className="truncate">{n.name}</span>
              </button>
            ))}
          </div>

          <label className="mt-6 block text-sm text-muted">Your prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. 3 brutal truths about discipline that will change your life"
            className="mt-3 w-full resize-none rounded-xl border border-edge bg-ink px-4 py-3 text-sm outline-none focus:border-gold"
          />

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-gold px-4 py-3.5 font-medium text-ink hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? "Generating…" : "Generate video"}
          </button>
        </section>

        {/* library */}
        <section>
          <h2 className="font-serif text-2xl">Your videos</h2>
          {videos.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-edge p-12 text-center text-muted">
              No videos yet. Generate your first one on the left.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {videos.map((v) => (
                <div key={v.id} className="overflow-hidden rounded-2xl border border-edge bg-panel">
                  <div className="relative aspect-[9/16] bg-ink">
                    {v.video_url ? (
                      <video
                        src={v.video_url}
                        poster={v.thumbnail_url ?? undefined}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted">
                        Processing…
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs uppercase tracking-wide text-gold">{v.niche}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{v.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* paywall */}
      {paywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gold/40 bg-panel p-8 text-center">
            <p className="text-sm uppercase tracking-widest text-gold">You&apos;re out of free credits</p>
            <h3 className="mt-4 font-serif text-3xl">Go Pro</h3>
            <p className="mt-2 text-muted">
              Unlimited faceless video generations for just
            </p>
            <p className="mt-4 font-serif text-5xl">
              $9.99<span className="text-base text-muted">/month</span>
            </p>
            <button
              onClick={handleSubscribe}
              className="mt-7 w-full rounded-xl bg-gold px-4 py-3.5 font-medium text-ink hover:opacity-90 transition-opacity"
            >
              Subscribe now
            </button>
            <button
              onClick={() => setPaywall(false)}
              className="mt-3 w-full text-sm text-muted hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
