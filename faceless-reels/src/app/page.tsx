import Link from "next/link";
import { NICHES } from "@/lib/niches";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <span className="font-serif text-xl tracking-tight">
          Faceless<span className="text-gold">Reels</span>
        </span>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="#niches" className="hover:text-white transition-colors">
            Niches
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-gold px-5 py-2 font-medium text-ink hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gold px-5 py-2 font-medium text-ink hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          )}
        </nav>
      </header>

      {/* hero */}
      <section className="glow relative z-0 mx-auto max-w-5xl px-6 pb-24 pt-20 text-center md:pt-28">
        <p className="rise mb-6 inline-block rounded-full border border-edge px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted">
          AI faceless video studio
        </p>
        <h1 className="rise font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Go viral without
          <br />
          <span className="text-gold italic">ever showing your face.</span>
        </h1>
        <p
          className="rise mx-auto mt-8 max-w-2xl text-lg text-muted"
          style={{ animationDelay: "0.1s" }}
        >
          Pick a niche, write a prompt, and generate scroll-stopping short
          videos in seconds. No camera, no editing, no burnout.
        </p>
        <div
          className="rise mt-10 flex items-center justify-center gap-4"
          style={{ animationDelay: "0.2s" }}
        >
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-full bg-gold px-8 py-3.5 font-medium text-ink hover:opacity-90 transition-opacity"
          >
            Create your first video — free
          </Link>
          <Link
            href="#niches"
            className="rounded-full border border-edge px-8 py-3.5 font-medium text-white hover:bg-panel transition-colors"
          >
            Explore niches
          </Link>
        </div>
        <p className="mt-5 text-xs text-muted">
          1 free video credit · no credit card required
        </p>
      </section>

      {/* niches */}
      <section id="niches" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-serif text-3xl md:text-4xl">12 battle-tested niches</h2>
        <p className="mt-3 max-w-xl text-muted">
          Each niche comes tuned for the hooks, pacing, and tone that perform
          best on Reels, Shorts, and TikTok.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {NICHES.map((n) => (
            <div
              key={n.slug}
              className="group rounded-2xl border border-edge bg-panel p-5 transition-colors hover:border-gold/60"
            >
              <div className="text-2xl">{n.emoji}</div>
              <h3 className="mt-3 font-serif text-lg">{n.name}</h3>
              <p className="mt-1 text-sm text-muted">{n.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="mx-auto max-w-3xl px-6 pb-28 text-center">
        <h2 className="font-serif text-3xl md:text-4xl">Simple pricing</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-edge bg-panel p-8 text-left">
            <p className="text-sm uppercase tracking-widest text-muted">Free</p>
            <p className="mt-3 font-serif text-4xl">$0</p>
            <p className="mt-2 text-sm text-muted">1 video credit to try it out.</p>
          </div>
          <div className="rounded-2xl border border-gold/50 bg-panel p-8 text-left">
            <p className="text-sm uppercase tracking-widest text-gold">Pro</p>
            <p className="mt-3 font-serif text-4xl">
              $9.99<span className="text-base text-muted">/month</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              Unlimited faceless video generations.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-edge px-6 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} FacelessReels. Built for creators.
      </footer>
    </main>
  );
}
