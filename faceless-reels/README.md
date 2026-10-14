# FacelessReels 🎬

Create faceless short videos with AI. Pick a niche, write a prompt, generate.
Built with **Next.js 15 (App Router) · TypeScript · Tailwind · Supabase Auth · Stripe**.

> Video generation is currently **mocked** (returns a placeholder vertical video).
> Swap the mock in `src/app/api/generate/route.ts` for fal.ai when ready.

---

## 1. Folder structure

```
faceless-reels/
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── .env.local.example
├── supabase_schema.sql
└── src/
    ├── middleware.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx                    # Landing page
    │   ├── login/page.tsx              # Magic-link login
    │   ├── auth/callback/route.ts      # Supabase OAuth/magic-link callback
    │   ├── dashboard/
    │   │   ├── page.tsx                # Server component (auth + data)
    │   │   └── DashboardClient.tsx     # Client UI (generate + library + paywall)
    │   └── api/
    │       ├── generate/route.ts       # Mock video generation + credit logic
    │       └── stripe/
    │           ├── checkout/route.ts   # Create $9.99/mo subscription session
    │           └── webhook/route.ts    # Mark users subscribed
    ├── lib/
    │   ├── niches.ts                   # 12 niche templates
    │   ├── stripe.ts
    │   └── supabase/
    │       ├── client.ts               # Browser client
    │       ├── server.ts               # Server client
    │       └── middleware.ts           # Session refresh + route protection
    └── components/                     # (reserved for future UI)
```

---

## 2. Run it locally tonight

### Step 1 — Install
```bash
cd faceless-reels
npm install        # or: yarn
```

### Step 2 — Create a Supabase project
1. Go to https://supabase.com → **New project**.
2. Open **SQL Editor → New query**, paste the full contents of `supabase_schema.sql`, click **Run**.
3. Go to **Authentication → Providers → Email** and make sure **Email** is enabled (magic links work out of the box).
4. Go to **Authentication → URL Configuration** and add
   `http://localhost:3000/auth/callback` to the **Redirect URLs**.
5. Copy your keys from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3 — Set up Stripe (for the $9.99 paywall)
1. In the Stripe Dashboard create a **Product** with a **recurring $9.99/month price**.
2. Copy the **Price ID** → `STRIPE_PRICE_ID`.
3. Copy your **Secret key** → `STRIPE_SECRET_KEY` and **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. For local webhooks, run the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the printed `whsec_...` → `STRIPE_WEBHOOK_SECRET`.

### Step 4 — Environment variables
```bash
cp .env.local.example .env.local
# then fill in every value
```

### Step 5 — Run
```bash
npm run dev
```
Open **http://localhost:3000**.

### Try the flow
1. Click **Create your first video** → enter your email → open the magic link.
2. You land on the dashboard with **1 free credit**.
3. Pick a niche, write a prompt, hit **Generate** → placeholder video appears and is saved.
4. Generate again → the **$9.99/month paywall** appears.
5. Subscribe (use Stripe test card `4242 4242 4242 4242`) → webhook flips `is_subscribed` → unlimited generations.

---

## 3. Connect real fal.ai later
Replace the mock block in `src/app/api/generate/route.ts` with a call to fal.ai,
then store the returned `video_url` / `thumbnail_url` in the `videos` table exactly as the mock does.
