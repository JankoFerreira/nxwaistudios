# Ferion Placeholder Website

Premium one-page placeholder website for Ferion at `https://ferion.co.za`.

This project is intentionally separate from the current NXW Studios website and the existing NXW placeholder folder.

## Stack

- React 18
- TypeScript
- Vite
- Plain CSS
- Static deployment

## Commands

```bash
npm install
npm run format
npm run lint
npm run typecheck
npm run build
```

Build output: `dist`

## Contact Form

The form currently uses a `mailto:` fallback. Update `src/config/siteConfig.ts` when `hello@ferion.co.za` and a secure form endpoint are ready.

## Brand Assets

Temporary SVG placeholders live in `public/brand`. Replace them with the approved Ferion assets and update `src/config/siteConfig.ts` if filenames change.
