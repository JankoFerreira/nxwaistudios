import { CSSProperties, FormEvent, useEffect, useId, useMemo, useState } from "react";
import { activeContactEmail, contactOptions, siteConfig } from "./config/siteConfig";

type FormFields = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  need: string;
  description: string;
  website: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;
type SubmitState = "idle" | "loading" | "success" | "failure";

const services = [
  {
    title: "Custom Software",
    copy: "Purpose-built systems designed around the way your business actually operates.",
  },
  {
    title: "Business Automation",
    copy: "Automate repetitive work, improve consistency and connect information across your organisation.",
  },
  {
    title: "Digital Platforms",
    copy: "Customer portals, internal applications, SaaS products and marketplace systems built for long-term growth.",
  },
  {
    title: "Websites and Portals",
    copy: "Modern digital experiences that strengthen your brand and connect customers to your services.",
  },
];

const productCapabilities = [
  "Inventory",
  "Branch Management",
  "Production",
  "Customer Orders",
  "Marketplace",
  "Reporting",
];

const initialFields: FormFields = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  need: "",
  description: "",
  website: "",
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const formStatusId = useId();

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const contactHref = useMemo(() => {
    const subject = encodeURIComponent("Ferion project conversation");
    const body = encodeURIComponent(
      `Hi Ferion,\n\nI would like to start a conversation about a business system or digital project.\n\n`,
    );
    return `mailto:${activeContactEmail}?subject=${subject}&body=${body}`;
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const updateField = (name: keyof FormFields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitState("idle");
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!fields.fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!fields.businessName.trim()) nextErrors.businessName = "Enter your business name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!fields.need) nextErrors.need = "Choose the type of help you need.";
    if (fields.description.trim().length < 20) {
      nextErrors.description = "Add a short description of at least 20 characters.";
    }
    if (fields.website.trim()) {
      nextErrors.website = "Submission blocked.";
    }
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState("failure");
      return;
    }

    setSubmitState("loading");
    const subject = encodeURIComponent(`Ferion enquiry: ${fields.need}`);
    const body = encodeURIComponent(
      [
        `Full name: ${fields.fullName}`,
        `Business name: ${fields.businessName}`,
        `Email address: ${fields.email}`,
        `Phone number: ${fields.phone || "Not provided"}`,
        `Need help with: ${fields.need}`,
        "",
        "Project description:",
        fields.description,
      ].join("\n"),
    );

    window.location.href = `mailto:${activeContactEmail}?subject=${subject}&body=${body}`;
    window.setTimeout(() => setSubmitState("success"), 600);
  };

  return (
    <>
      <Header
        menuOpen={menuOpen}
        onToggle={() => setMenuOpen((open) => !open)}
        onClose={closeMenu}
      />
      <main>
        <section className="hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero__content reveal">
            <p className="transition-label">
              {siteConfig.legacyName} is becoming {siteConfig.name}
            </p>
            <p className="eyebrow">CUSTOM SOFTWARE | AI AUTOMATION | DIGITAL PLATFORMS</p>
            <h1 id="hero-title">
              <span>Smart Systems.</span>
              <span>Stronger Businesses.</span>
            </h1>
            <p className="hero__copy">
              Ferion builds custom software, intelligent automation and modern digital platforms
              that help businesses simplify operations, improve visibility and grow with confidence.
            </p>
            <div className="actions">
              <a className="button button--primary" href="#contact">
                Start a Conversation
              </a>
              <a className="button button--secondary" href="#what-we-build">
                See What We Build
              </a>
            </div>
          </div>
          <div className="hero__visual reveal reveal--delay" aria-hidden="true">
            <div className="symbol-orbit">
              <span className="orbit-line orbit-line--one" />
              <span className="orbit-line orbit-line--two" />
              <img src={siteConfig.assets.symbol} alt="" />
            </div>
            <div className="visual-caption">Formerly NXW Studios</div>
          </div>
        </section>

        <section
          className="section-shell build-section"
          id="what-we-build"
          aria-labelledby="build-title"
        >
          <div className="section-heading reveal">
            <p className="section-label">WHAT FERION BUILDS</p>
            <h2 id="build-title">Technology built around real business problems.</h2>
            <p>
              Ferion develops practical digital solutions for businesses that have outgrown
              spreadsheets, disconnected tools and repetitive manual processes.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article
                className="service-card reveal"
                style={{ "--delay": `${index * 90}ms` } as CSSProperties}
                key={service.title}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell rebrand-section" aria-labelledby="rebrand-title">
          <div className="rebrand-panel reveal">
            <div>
              <p className="section-label">A NEW CHAPTER</p>
              <h2 id="rebrand-title">NXW Studios is becoming Ferion.</h2>
            </div>
            <div className="rebrand-copy">
              <p>
                What started with websites and digital experiences has grown into something broader.
                Ferion represents our focus on custom software, business systems, automation and
                scalable technology products.
              </p>
              <p>
                The name is changing, but the commitment remains the same: understand the problem,
                build the right solution and create technology that provides practical value.
              </p>
              <div className="name-transition" aria-label="NXW Studios to Ferion">
                <span>NXW Studios</span>
                <span aria-hidden="true">-&gt;</span>
                <strong>Ferion</strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section-shell product-section"
          id="butchershub"
          aria-labelledby="product-title"
        >
          <div className="product-copy reveal">
            <p className="section-label">FEATURED FERION PRODUCT</p>
            <h2 id="product-title">{siteConfig.featuredProduct.name}</h2>
            <p>An operations and marketplace platform being developed for modern butcheries.</p>
            <div className="capabilities" aria-label="ButchersHub capabilities">
              {productCapabilities.map((capability) => (
                <span key={capability}>{capability}</span>
              ))}
            </div>
            <div className="product-actions">
              <span className="status-pill">{siteConfig.featuredProduct.status}</span>
              <a className="button button--secondary" href={siteConfig.featuredProduct.link}>
                Follow the Project
              </a>
            </div>
          </div>
          <div className="product-preview reveal reveal--delay" aria-hidden="true">
            <div className="preview-topbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-grid">
              <div className="preview-block preview-block--wide" />
              <div className="preview-block" />
              <div className="preview-block" />
              <div className="preview-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="preview-radar" />
            </div>
          </div>
        </section>

        <section
          className="section-shell contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-intro reveal">
            <p className="section-label">CONTACT</p>
            <h2 id="contact-title">Have a process that should work better?</h2>
            <p>
              Tell us what your business currently manages manually, where information gets lost and
              what you would like the system to achieve.
            </p>
            <div className="actions">
              <a className="button button--primary" href={contactHref}>
                Start a Conversation
              </a>
              <a className="email-link" href={`mailto:${activeContactEmail}`}>
                {activeContactEmail}
              </a>
            </div>
            {!siteConfig.contactEmailActive && (
              <p className="form-note">
                Ferion email setup is pending. This placeholder currently uses the configured NXW
                fallback email.
              </p>
            )}
          </div>

          <form className="contact-form reveal reveal--delay" onSubmit={handleSubmit} noValidate>
            <input
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              name="website"
              value={fields.website}
              onChange={(event) => updateField("website", event.target.value)}
              aria-hidden="true"
            />
            <Field
              label="Full name"
              name="fullName"
              value={fields.fullName}
              error={errors.fullName}
              onChange={updateField}
              autoComplete="name"
            />
            <Field
              label="Business name"
              name="businessName"
              value={fields.businessName}
              error={errors.businessName}
              onChange={updateField}
              autoComplete="organization"
            />
            <Field
              label="Email address"
              name="email"
              type="email"
              value={fields.email}
              error={errors.email}
              onChange={updateField}
              autoComplete="email"
            />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              value={fields.phone}
              error={errors.phone}
              onChange={updateField}
              autoComplete="tel"
            />
            <label className="field">
              <span>What do you need help with?</span>
              <select
                value={fields.need}
                onChange={(event) => updateField("need", event.target.value)}
                aria-invalid={Boolean(errors.need)}
              >
                <option value="">Select an option</option>
                {contactOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.need && <small role="alert">{errors.need}</small>}
            </label>
            <label className="field field--full">
              <span>Short project description</span>
              <textarea
                value={fields.description}
                onChange={(event) => updateField("description", event.target.value)}
                rows={5}
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description && <small role="alert">{errors.description}</small>}
            </label>
            <div className="form-footer">
              <p id={formStatusId} aria-live="polite">
                {submitState === "loading" && "Preparing your email..."}
                {submitState === "success" &&
                  "Your email app should open with the enquiry prepared. Please send it from there."}
                {submitState === "failure" &&
                  "Please fix the highlighted fields before continuing."}
                {submitState === "idle" &&
                  "This form uses a mailto fallback until a secure form endpoint is configured."}
              </p>
              <button
                className="button button--primary"
                type="submit"
                aria-describedby={formStatusId}
              >
                {submitState === "loading" ? "Preparing..." : "Start a Conversation"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Header({
  menuOpen,
  onToggle,
  onClose,
}: {
  menuOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const links = [
    { href: "#what-we-build", label: "What We Build" },
    { href: "#butchershub", label: "ButchersHub" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={onClose} aria-label="Ferion home">
        <img src={siteConfig.assets.symbol} alt="" />
        <span>FERION</span>
      </a>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={onToggle}
      >
        <span className="sr-only">Toggle navigation</span>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav
        className={menuOpen ? "nav nav--open" : "nav"}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        {links.map((link) => (
          <a href={link.href} onClick={onClose} key={link.href}>
            {link.label}
          </a>
        ))}
        <a className="nav-button" href="#contact" onClick={onClose}>
          Start a Conversation
        </a>
      </nav>
    </header>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: keyof FormFields;
  value: string;
  error?: string;
  onChange: (name: keyof FormFields, value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
      />
      {error && <small role="alert">{error}</small>}
    </label>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div>
        <a className="footer-logo" href="#top" aria-label="Ferion home">
          <img
            src={siteConfig.assets.logoFull}
            alt="Ferion - Smart Systems. Stronger Businesses."
          />
        </a>
        <p>{siteConfig.tagline}</p>
        <p>
          Ferion builds custom software, automation and digital platforms for modern businesses.
        </p>
      </div>
      <div className="footer-links">
        <a href={`mailto:${activeContactEmail}`}>{activeContactEmail}</a>
        <a href={siteConfig.legacyDomain} target="_blank" rel="noopener noreferrer">
          Formerly NXW Studios
        </a>
        <a href="/privacy.html">Privacy</a>
      </div>
      <p className="copyright">Copyright {year} Ferion. All rights reserved.</p>
    </footer>
  );
}
