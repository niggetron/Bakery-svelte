# 🍪 Rashmita Bakery — SvelteKit Cookie Store

A single-page cookie storefront for **Rashmita Bakery, Dungurpali (Balangir, Odisha)**,
built with **SvelteKit 2 + Svelte 5 (runes)** and statically pre-rendered with
`@sveltejs/adapter-static`. Deploys to **Cloudflare Pages** or **Cloudflare Workers**
with zero server code.

## Features

- 🛒 Add-to-cart with quantity +/−, remove, animated cart badge & slide-in drawer
- 💾 Cart persists in browser localStorage
- 📦 Subtotal / delivery / total calculation (₹40 delivery, FREE above ₹499)
- 💬 WhatsApp checkout — itemized order message + customer name/phone/address with validation
- 🔍 Live search + category filters (Classic / Chocolate / Premium)
- 📱 Fully responsive, mobile hamburger menu, Svelte transitions (fly/fade)
- ✋ **No blue tap highlight** — default WebKit tap-highlight and touch focus outlines are
  disabled (`-webkit-tap-highlight-color: transparent`), keyboard users still get
  `:focus-visible` outlines

## Project structure

```
src/
├── app.css               # global styles (incl. the tap-highlight fix)
├── app.html              # shell template
├── lib/
│   ├── shop.js           # ⚙️ SHOP config, PRODUCTS, CATEGORIES, REVIEWS — edit here
│   └── cart.svelte.js    # 🛒 Svelte 5 runes cart store (state, totals, WhatsApp order)
└── routes/
    ├── +layout.js        # prerender = true (static output)
    ├── +layout.svelte    # global CSS + fonts
    └── +page.svelte      # the whole single-page site
```

## ⚠️ Before going live

Open `src/lib/shop.js` and replace the placeholder WhatsApp number:

```js
export const SHOP = {
	name: 'Rashmita Bakery',
	whatsapp: '919437000000', // ← REPLACE with the real number (country code, no "+")
	deliveryFee: 40,
	freeDeliveryAbove: 499
};
```

Products, prices, categories and reviews are in the same file.

## Develop & build

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # static site → ./build/
npm run preview    # preview the production build
```

A **pre-built copy is already included in `build/`** — you can host it without building.

---

## Deploy to Cloudflare Pages

**Option A — drag & drop (no tools needed):**
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. Drag the **`build/`** folder → Deploy → live at `https://rashmita-bakery.pages.dev`

**Option B — Wrangler CLI:**
```bash
npm install -g wrangler
wrangler pages deploy build --project-name rashmita-bakery
```

## Deploy to Cloudflare Workers (static assets)

A ready `wrangler.jsonc` is included (serves `build/`, SPA fallback enabled):

```bash
npm install -g wrangler
wrangler deploy
```

Live at `https://rashmita-bakery.<your-subdomain>.workers.dev`

## Upgrade ideas

- Razorpay / UPI payment links for online payments
- Real product photos (replace the emoji in `PRODUCTS`)
- Cloudflare Worker + D1 backend for a real order database
