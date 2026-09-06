# NXW Studios and Ferion Placeholder

This workspace currently contains separate website projects:

- Root Vite React app: current NXW Studios website.
- `placeholder-site/`: existing static NXW placeholder deployment for `https://nxwbstudios.co.za`.
- `ferion-placeholder/`: standalone Ferion placeholder website for `https://ferion.co.za`.
- `ferion-placeholder-nxw-base/`: older static Ferion base with its own Git repository.

Do not redirect or replace the NXW deployment when deploying the Ferion placeholder. Build and deploy `ferion-placeholder/` as its own static site.

Run `npm install` and `npm run dev` from the root for the current NXW site. The default local address is `http://localhost:5173`. Run `npm run lint`, `npm run format`, and `npm run build` before deployment; the production output is `dist/`.

The NXW page ends at Contact. Desktop screens use animated section navigation; tablets, screens at most 650px tall, and reduced-motion users get normal document scrolling. The layout switches automatically when the viewport changes.

The two static folders are separate repositories and are ignored by the root repository. Their HTML, CSS, JavaScript, and assets deploy directly. Run the Ferion React project's checks from `ferion-placeholder/`; its production output is its own `dist/` folder. Generated builds, installed dependencies, environment files, and logs are ignored by Git.

Contact actions use email links. The NXW app currently uses `hello@nxwstudios.ai`; the Ferion placeholder uses the configured fallback `hello@nxwb-studios.co.za`. Mailbox delivery and production hosting require separate verification.
