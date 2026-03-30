# Setup Guide (A → Z) — `storetma-test`

This document is the “from zero to running” setup guide for this repository, intended to be the single source of truth for developers.

## 1) What this project is

`storetma-test` is a lightweight Shopee-style storefront demo:

- Static HTML pages served from `public/` (`login.html`, `home.html`, `cart.html`, `checkout.html`, `success.html`)
- Vanilla JS modules under `public/js/` for UI logic (catalog, cart, i18n, user header)
- Next.js Pages API routes under `pages/api/`:
  - `GET /api/products` — reads products from Postgres
  - `POST /api/create-checkout` — creates a Stripe Checkout Session URL
- Vercel-friendly routing (rewrites to static HTML)

## 2) Prerequisites

### 2.1 Required software

- **Git**
- **Node.js** and **npm**
  - Works with Node **16.20.x** (WSL) in this repo (tests include a crypto polyfill).
  - Recommended for long-term: Node **18 LTS** or **20 LTS**.
- **(Optional) WSL2** (Windows)
  - If you’re on Windows and already using WSL, you can run all commands inside WSL.

### 2.2 Required accounts/keys (for full functionality)

- **Stripe Secret Key**
  - Env var: `STRIPE_SECRET_KEY` (must start with `sk_`)
- **Postgres database**
  - Env var: `DATABASE_URL` (preferred) or `POSTGRES_URL`
  - Recommended provider: Neon (works with `@neondatabase/serverless`)

If you don’t configure DB, `GET /api/products` will return `500`.

## 3) Repository layout (important paths)

- **Frontend pages**: `public/*.html`
- **Frontend scripts**: `public/js/*.js`
- **Backend APIs**: `pages/api/*.js`
- **Unit tests** (easy to find): `unittest/`
- **Vitest config**: `vitest.config.mjs`
- **Crypto polyfill** (Node 16 compatibility): `scripts/crypto-polyfill.cjs`
- **Routing**:
  - `next.config.js` rewrites `/` to `/login.html`, etc.
  - `vercel.json` also defines the same rewrites/headers.

## 4) Setup steps (local development)

### 4.1 Clone

```bash
git clone <your-repo-url>
cd storetma_test
```

### 4.2 Install dependencies

From the repo root:

```bash
npm install
```

### 4.3 Configure environment variables

Create a local env file (Next.js loads `.env.local` automatically in dev):

Create `./.env.local` with:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
STRIPE_SECRET_KEY="sk_test_..."
```

Notes:

- The DB client is created in `pages/api/_db.js`:
  - it uses `process.env.DATABASE_URL || process.env.POSTGRES_URL`
- Stripe validation happens in `pages/api/create-checkout.js`:
  - it rejects missing keys and keys that don’t start with `sk_`

### 4.4 Start the dev server

```bash
npm run dev
```

Open the app:

- `/` → rewritten to `/login.html`
- `/home` → `/home.html`
- `/cart` → `/cart.html`
- `/checkout` → `/checkout.html`
- APIs:
  - `/api/products`
  - `/api/create-checkout`

## 5) Database setup (Postgres / Neon)

This section describes the minimum DB schema expected by the app.

### 5.1 Create the `products` table

Run the following SQL in your Postgres database:

```sql
CREATE TABLE IF NOT EXISTS products (
  id          text PRIMARY KEY,
  name_vi     text NOT NULL,
  name_en     text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  image       text NOT NULL,
  section     text NOT NULL CHECK (section IN ('flash', 'daily')),
  category    text NOT NULL,
  badge       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_section_created_at
  ON products (section, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_section_category_created_at
  ON products (section, category, created_at DESC);
```

### 5.2 Seed example data

You can seed with IDs matching the frontend seed (`p1..p18`) to keep a consistent demo:

```sql
INSERT INTO products (id, name_vi, name_en, price_cents, image, section, category, badge)
VALUES
('p1',  'Đồng hồ thông minh', 'Smart Watch',         2990,  'https://picsum.photos/seed/p1/600/600',  'flash', 'accessories', '-45%'),
('p7',  'Áo thun cotton',    'Cotton T-Shirt',      1250,  'https://picsum.photos/seed/p7/600/600',  'daily', 'fashion',     '-20%')
ON CONFLICT (id) DO UPDATE SET
  name_vi     = EXCLUDED.name_vi,
  name_en     = EXCLUDED.name_en,
  price_cents = EXCLUDED.price_cents,
  image       = EXCLUDED.image,
  section     = EXCLUDED.section,
  category    = EXCLUDED.category,
  badge       = EXCLUDED.badge;
```

### 5.3 Confirm API works

```bash
curl "http://localhost:3000/api/products?section=daily&limit=5&offset=0"
```

Expected:

- `200` with JSON: `{ items, total, hasMore, nextOffset }`

If you get `500 DATABASE_URL chưa được cấu hình...`:

- your `.env.local` is missing or the dev server was not restarted

## 6) Stripe setup

### 6.1 Configure Stripe key

Set `STRIPE_SECRET_KEY` to a **secret** key (starts with `sk_`).

### 6.2 How checkout works in this app

1. `checkout.html` builds a payload from LocalStorage cart + catalog:
   - uses `ShopeeCart.buildCheckoutPayload(ShopeeCatalog.getCatalog())`
2. It calls:
   - `POST /api/create-checkout`
3. Server resolves pricing:
   - DB lookup first
   - fallback to seeded IDs (p1..p18)
   - fallback to custom user products (`u_...` or `_demo_...`) using provided `unit_amount_cents`
4. Server posts to Stripe to create a Checkout session and returns `{ url }`.
5. Browser redirects to Stripe Checkout URL.

### 6.3 Test Stripe behavior (dev)

From the UI:

- Go to `/home`, add items to cart
- Go to `/checkout`, click “Pay with Stripe”

If Stripe is not configured:

- API returns `500` with an error message guiding you to set `STRIPE_SECRET_KEY`

## 7) Unit tests (enterprise-friendly folder)

Unit tests live in `unittest/` to keep them easy to locate in larger codebases.

### 7.1 Run tests

```bash
npm test
```

### 7.2 Why tests preload a crypto polyfill

On Node 16, Vite/Vitest may call `crypto.getRandomValues` during startup.

- The repo includes `scripts/crypto-polyfill.cjs`
- `package.json` runs tests with:
  - `node -r ./scripts/crypto-polyfill.cjs ...`
- The polyfill patches:
  - `globalThis.crypto.getRandomValues` and also `require('node:crypto').getRandomValues`

If you upgrade to Node 18/20, the polyfill is still harmless.

### 7.3 Test structure

- `unittest/helpers/mock-http.js`: minimal Next.js API handler req/res mocks
- `unittest/_db.test.js`: DB client factory tests
- `unittest/api/products.test.js`: `/api/products` behavior tests
- `unittest/api/create-checkout.test.js`: `/api/create-checkout` behavior tests (Stripe fetch mocked)

## 8) Production deployment (Vercel)

### 8.1 Deploy steps

1. Push repo to GitHub/GitLab
2. Import project into Vercel
3. Set Environment Variables in Vercel Project Settings:
   - `DATABASE_URL` (or `POSTGRES_URL`)
   - `STRIPE_SECRET_KEY`
4. Deploy

### 8.2 Routing behavior on Vercel

The app relies on rewrites mapping friendly routes to static HTML:

- `/` → `/login.html`
- `/home` → `/home.html`
- `/cart` → `/cart.html`
- `/checkout` → `/checkout.html`

These rewrites exist in:

- `next.config.js`
- `vercel.json`

Recommendation (for “company large project” maintainability):

- keep **one** source of truth to avoid drift (either remove rewrites from one, or ensure they always match).

## 9) Troubleshooting

### 9.1 `/api/products` returns 500

- **Cause**: DB URL missing
- **Fix**:
  - Add `DATABASE_URL` to `.env.local`
  - Restart `npm run dev`

### 9.2 `npm test` fails with `crypto.getRandomValues is not a function`

- **Cause**: Node 16 crypto API differences + Vite startup
- **Fix**:
  - Use the provided `npm test` script (it preloads `scripts/crypto-polyfill.cjs`)
  - If you modified scripts, restore:
    - `node -r ./scripts/crypto-polyfill.cjs ...`

### 9.3 Checkout returns `400` or `500`

Common causes:

- Missing/invalid `STRIPE_SECRET_KEY`
- Cart payload invalid (empty, too many lines > 30, total > 5,000,000 cents)
- Stripe API returns an error payload

### 9.4 Home page shows items but DB is down

- This is expected: `shopee-home.js` has a fallback to local seeded catalog when the API fails.

## 10) Recommended team conventions (optional)

If this repo is used inside a larger company codebase, consider adding:

- `docs/adr/` for architecture decisions
- CI: run `npm test` on every pull request
- Coverage gates (lines/branches thresholds)
- Separate `unittest/` and `integration/` if you add DB/Stripe sandbox tests

