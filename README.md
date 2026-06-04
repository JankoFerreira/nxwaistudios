# NXWB Studios Placeholder Site

Static HTML, CSS, and JavaScript landing page for `nxwb-studios.co.za`.

## Files

- `index.html` - page content and SEO metadata.
- `css/style.css` - layout, responsive styling, and chat widget styles.
- `js/script.js` - Three.js background scene and chat behavior.
- `assets/favicon.svg` - browser favicon.
- `assets/og-preview.svg` - social sharing preview image.
- `CNAME` - GitHub Pages custom domain file.

## GitHub Pages

Upload the contents of this folder to a GitHub repository and publish it with GitHub Pages.

Recommended setup:

1. Create a new repository, for example `nxwb-placeholder`.
2. Copy the contents of `placeholder-site` into that repository root.
3. In GitHub, go to `Settings > Pages`.
4. Set the source to the `main` branch and root folder.
5. Point the domain `nxwb-studios.co.za` to the GitHub Pages site.

## Contact Settings

Update these constants in `js/script.js`:

```js
const contactEmail = "hello@nxwb-studios.co.za";
const whatsappNumber = "27682712616";
```

If `whatsappNumber` is set, chat messages will open WhatsApp. Leave it blank to use email.

## Analytics

Analytics are ready but disabled until real IDs are added. Update this object in `js/script.js`:

```js
const analyticsConfig = {
  googleAnalyticsId: "",
  microsoftClarityId: "",
};
```

Leave either value blank to keep that provider disabled.

## Social Preview

The page includes Open Graph and Twitter metadata. The preview image is served from:

```text
https://nxwb-studios.co.za/assets/og-preview.svg
```

Some social platforms cache previews aggressively, so after deployment you may need to refresh the URL in their sharing/debug tools.

## Real Live Chat

GitHub Pages can host the page, but it cannot run its own live chat backend. For true live chat, use a third-party widget such as Tawk.to, Crisp, LiveChat, or another provider. Their embed script can be added before the closing `</body>` tag in `index.html`.
