export const siteConfig = {
  name: "Ferion",
  domain: "https://ferion.co.za",
  legacyName: "NXW Studios",
  legacyDomain: "https://nxwbstudios.co.za",
  tagline: "Smart Systems. Stronger Businesses.",
  email: "hello@ferion.co.za",
  fallbackEmail: "hello@nxwb-studios.co.za",
  contactEmailActive: false,
  assets: {
    logoFull: "/brand/ferion-logo-full.svg",
    symbol: "/brand/ferion-symbol.svg",
    favicon: "/brand/favicon.svg",
    ogImage: "/brand/ferion-og-image.svg",
  },
  featuredProduct: {
    name: "ButchersHub",
    status: "In Development",
    link: "#contact",
  },
} as const;

export const contactOptions = [
  "Custom software",
  "Business automation",
  "Website",
  "Customer portal",
  "Reporting system",
  "Product development",
  "Unsure",
] as const;

export type ContactOption = (typeof contactOptions)[number];

export const activeContactEmail = siteConfig.contactEmailActive
  ? siteConfig.email
  : siteConfig.fallbackEmail;
