# Pryora

Storefront for Pryora jewellery: landing page, shop (types, search, sizes, price, colour, stock, sort), product pages, bag, and pre-order.

Built with Vite, React 19, React Router and TypeScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build locally
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/products.ts` | The catalogue: names, prices (Taka), photos, sizes, stock, pre-order dates |
| `src/pages/` | `Home`, `Shop`, `Product`, `Preorder` |
| `src/components/` | Nav, footer, bag drawer, product card, silent autoplay video |
| `src/bag/BagContext.tsx` | Bag state, saved in the browser (`localStorage`) |
| `src/styles/` | `base.css` (brand tokens and shared parts) plus one file per page, scoped to `.page-*` |
| `public/images/products/` | Web-sized product photos |
| `public/videos/` | Landing page videos (always muted) |
| `source-media/` | Full-size original photos and unused video, not served |
| `ui samples/` | Original design references |
| `legacy/` | The earlier static HTML version, kept for reference |

## Routes

- `/` landing page
- `/shop` with filters in the URL, for example `/shop?type=rings&size=7&sort=low`
- `/product/:id` for example `/product/bow-ring`
- `/preorder` and `/preorder?id=wave-bangle&size=2.6#reserve`

## Not connected yet

- Checkout: the bag works, but the Checkout button only shows a notice.
- Pre-order reservations are saved in the visitor's browser only. A backend or form service is needed to receive them.
- When deploying, configure the host to serve `index.html` for all routes (single-page app).
