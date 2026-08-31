# Ferion Placeholder Implementation

## 1. Project Structure

The Ferion placeholder site lives in `ferion-placeholder/` as a standalone Vite project. It does not replace the root NXW Studios React site or the existing `placeholder-site/` NXW static deployment.

Key folders:

- `ferion-placeholder/src/` - React, TypeScript and CSS source.
- `ferion-placeholder/src/config/siteConfig.ts` - central brand, domain, email and product configuration.
- `ferion-placeholder/public/brand/` - Ferion brand assets.
- `ferion-placeholder/public/robots.txt` - robots file.
- `ferion-placeholder/public/sitemap.xml` - sitemap.
- `ferion-placeholder/public/CNAME` - GitHub Pages custom domain file.
- `ferion-placeholder/dist/` - production output after build.

## 2. Technology Stack

- React 18
- TypeScript
- Vite
- Plain CSS
- Static deployment
- No backend

The existing repository root also uses Vite and React, so the placeholder follows the preferred stack while staying separate.

## 3. Components Created

The one-page app is implemented in `ferion-placeholder/src/App.tsx` with these sections:

- Navigation
- Hero
- What Ferion Builds
- Rebrand Introduction
- Featured Product
- Contact Call-to-Action and form
- Footer

The mobile navigation supports keyboard use, Escape close, visible focus states and body scroll locking while open.

## 4. Brand Assets Used

Temporary SVG assets were created in `ferion-placeholder/public/brand/`:

- `ferion-logo-full.svg`
- `ferion-symbol.svg`
- `favicon.svg`
- `apple-touch-icon.svg`
- `ferion-og-image.svg`

These are placeholders only. Replace them with the approved supplied Ferion logo files when available:

- `ferion-logo-full.png`
- `ferion-symbol.png`
- `ferion-wordmark.png`
- `favicon.png`
- `apple-touch-icon.png`
- `ferion-og-image.jpg`

## 5. Configuration Locations

Central configuration is in `ferion-placeholder/src/config/siteConfig.ts`.

Current values include:

- Name: `Ferion`
- Domain: `https://ferion.co.za`
- Legacy domain: `https://nxwbstudios.co.za`
- Tagline: `Smart Systems. Stronger Businesses.`
- Ferion email: `hello@ferion.co.za`
- Temporary fallback email: `hello@nxwb-studios.co.za`
- Featured product: `ButchersHub`

## 6. Form Setup

The contact form uses accessible client-side validation and a honeypot spam field. Because no secure form endpoint is configured in this repository, submission uses a `mailto:` fallback and clearly tells the visitor that their email application must send the enquiry.

No credentials are exposed.

To connect a working form later, add a secure provider endpoint or serverless function and update `handleSubmit` in `ferion-placeholder/src/App.tsx`.

## 7. Environment Variables

No environment variables are required for the current placeholder.

Future optional variables may include:

- `VITE_FORM_ENDPOINT`
- `VITE_ANALYTICS_ID`
- `VITE_CLARITY_ID`

Do not expose private API keys in Vite client variables.

## 8. Build Instructions

From `ferion-placeholder/`:

```bash
npm install
npm run format
npm run lint
npm run typecheck
npm run build
```

Build command: `npm run build`

Output directory: `ferion-placeholder/dist`

## 9. Deployment Instructions

Deploy `ferion-placeholder/dist` as a separate static site for `ferion.co.za`.

Recommended hosting settings:

- Framework preset: Vite
- Root directory: `ferion-placeholder`
- Build command: `npm run build`
- Publish/output directory: `dist`
- Node version: 18 or newer
- Environment variables: none required

For GitHub Pages, deploy the contents of `ferion-placeholder/dist` and keep the generated `CNAME` file containing `ferion.co.za`.

## 10. DNS Requirements

Point `ferion.co.za` to the chosen host using that provider's instructions.

Typical options:

- Apex A records to the static host IPs, or
- Apex ALIAS/ANAME record if supported, or
- `www` CNAME to the host target plus provider-level apex forwarding.

Do not change `nxwbstudios.co.za` DNS while this placeholder is active.

## 11. SSL Expectations

Enable managed SSL/TLS in the hosting provider after DNS resolves. The site should only be served at `https://ferion.co.za`.

## 12. Fallback Routing Requirements

This is a single-page static site with one standalone `privacy.html` file. No SPA fallback is required beyond serving `/index.html` for the root page.

## 13. Hosting Provider Configuration

Create a separate site/project/deployment target for Ferion. Do not repoint the existing NXW Studios deployment.

Suggested setup:

- Existing NXW site remains at `https://nxwbstudios.co.za`.
- New Ferion placeholder deploys separately at `https://ferion.co.za`.
- No redirect from NXW to Ferion until the full Ferion website is ready.

## 14. Remaining Manual Tasks

- Upload final approved Ferion logo assets.
- Confirm or create `hello@ferion.co.za`.
- Configure a secure contact form endpoint if mailto is not acceptable.
- Connect `ferion.co.za` in the hosting provider.
- Configure DNS records for `ferion.co.za`.
- Enable SSL.
- Add analytics if required.
- Update social media profiles.
- Confirm legal business details for the full privacy policy.

## 15. Replacing the Placeholder Later

When the full Ferion website is ready, either replace the `ferion-placeholder` deployment source with the full site or point the `ferion.co.za` hosting project to the new Ferion project. Keep redirects intentional and do not redirect `nxwbstudios.co.za` until the business is ready.

## 16. How NXW Remains Unaffected

No root `src/`, root `public/`, root Vite config, root package files, or `placeholder-site/` NXW files were edited for the website implementation. The Ferion project lives in its own folder with its own package and deployment files.

## 17. Testing Results

- Formatting: passed with `npm run format`.
- Linting: passed with `npm run lint`.
- Type-check: passed with `npm run typecheck`.
- Production build: passed with `npm run build`.
- Responsive checks: passed at 375px, 430px, 768px, 1024px, 1440px and 1920px using `node scripts/verify-built-site.mjs`.
- Navigation checks: hero, What We Build, ButchersHub and Contact links passed.
- Mobile navigation: menu opens, locks body scroll, closes on Escape and closes after link selection.
- Contact form: validation and mailto fallback behavior verified.
- Reduced motion: verified with browser emulation.
- Browser console: no console errors observed during automated checks.
- Static files: `robots.txt`, `sitemap.xml`, favicon, Open Graph image and privacy page returned HTTP 200.
- Metadata: page title, canonical URL and favicon verified.
