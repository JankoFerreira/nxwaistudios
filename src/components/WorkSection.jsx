import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './WorkSection.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '001',
    title: 'Construction Safety Management',
    url: 'https://jankoferreira.github.io/CSM--Website/',
    image: '/work/csm-hero.jpg',
    type: 'Professional Services / Compliance Website',
    year: '2026',
    desc: 'A professional services site for construction health and safety support, built around credibility, service clarity and consultation conversion.',
    caseStudy:
      'The site translates a compliance-heavy service offering into a confident digital experience. It highlights safety management, audits, documentation, process, client trust and enquiry flow while keeping the tone serious and operational.',
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'GitHub Pages',
      'Responsive UI',
      'Contact Forms',
    ],
    color: '#00f5ff',
    visual: 'data',
  },
  {
    id: '002',
    title: 'Velori Capture Studio',
    url: 'https://jankoferreira.github.io/photographer-demo-website/',
    image: '/work/photographer-demo-hero.jpg',
    type: 'Photography Portfolio / Lead Generation',
    year: '2026',
    desc: 'A premium photographer demo site for weddings, portraits and events, designed around strong storytelling, clear booking flow and refined visual pacing.',
    caseStudy:
      'The page balances emotional brand positioning with conversion-focused sections: galleries, service details, trust cues, testimonials and WhatsApp-led enquiry. The result is a polished portfolio that feels editorial while still guiding users toward availability checks.',
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'GitHub Pages',
      'Responsive Design',
      'WhatsApp CTA',
    ],
    color: '#a855f7',
    visual: 'xr',
  },
  {
    id: '003',
    title: 'LYPSA South Africa',
    url: 'https://lypsa.co.za/',
    image: '/work/lypsa-hero.jpg',
    type: 'Community Website / Information Architecture',
    year: '2026',
    desc: 'A structured website for Living Church of God South Africa with sections for camps, resources, contact details and involvement paths.',
    caseStudy:
      'The build organizes faith, camp and contact information into a simple guided experience, supported by a Python/FastAPI backend and PostgreSQL data layer for dynamic content and structured administration. Strong navigation, repeated calls to action and clear content blocks help visitors understand the organization and find the next relevant step quickly.',
    stack: [
      'Python',
      'FastAPI',
      'PostgreSQL',
      'HTML',
      'CSS',
      'JavaScript',
      'Responsive Layout',
      'Domain Hosting',
    ],
    color: '#7ef7c9',
    visual: 'neural',
  },
  {
    id: '004',
    title: 'Bernina Moot',
    url: 'https://berninamoot.co.za/',
    image: '/work/bernina-moot-hero.jpg',
    type: 'Retail Website / Product-Focused Brand Presence',
    year: '2026',
    desc: 'A focused web presence for a Bernina sewing and retail business, built to make the brand feel established, practical and easy to contact.',
    caseStudy:
      'The project centers on trust, clarity and fast access to business information. The experience is structured for customers who need product confidence, store details and a polished first impression without friction.',
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'Responsive UI',
      'SEO Basics',
      'Domain Setup',
    ],
    color: '#ff9a3d',
    visual: 'void',
  },
]

export default function WorkSection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)

  const openProject = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const setActiveProject = (index) => {
    window._nxwActiveWork = index
    setActive(index)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work__header', {
        scrollTrigger: { trigger: '.work__header', start: 'top 85%' },
        opacity: 0,
        y: 50,
        duration: 1,
      })

      gsap.from('.work__project', {
        scrollTrigger: { trigger: '.work__projects', start: 'top 80%' },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.7,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section work depth-section" id="work" ref={sectionRef}>
      <div className="grid-bg" />
      <div className="work__inner">
        <div className="work__header">
          <span className="tag">Selected Work</span>
          <h2 className="display-lg" style={{ marginTop: '1.5rem' }}>
            Case <span className="grad-purple">Studies</span>
          </h2>
          <p className="work__intro text-body">
            A small selection of practical builds, from service businesses to
            community platforms and product-led brand sites.
          </p>
        </div>

        <div className="work__layout">
          <div className="work__projects">
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                className={`work__project hoverable ${active === i ? 'work__project--active' : ''}`}
                onMouseEnter={() => setActiveProject(i)}
                onClick={() => setActiveProject(i)}
                onFocus={() => setActiveProject(i)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveProject(i)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={active === i}
                aria-label={`Preview ${proj.title}`}
                aria-controls="work-preview"
                style={{ '--accent': proj.color }}
              >
                <div className="work__project-inner">
                  <div className="work__project-meta">
                    <span
                      className="text-mono"
                      style={{ color: 'var(--white-dim)', fontSize: '0.65rem' }}
                    >
                      {proj.id}
                    </span>
                    <span
                      className="text-mono"
                      style={{ color: 'var(--white-dim)', fontSize: '0.65rem' }}
                    >
                      {proj.year}
                    </span>
                  </div>
                  <h3
                    className="work__project-title"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                      fontWeight: 700,
                    }}
                  >
                    {proj.title}
                  </h3>
                  <span
                    className="text-mono work__project-type"
                    style={{ fontSize: '0.7rem', color: proj.color }}
                  >
                    {proj.type}
                  </span>
                  <p className="work__project-desc text-body">{proj.desc}</p>
                  <div
                    className="work__project-stack"
                    aria-label={`${proj.title} tech stack`}
                  >
                    {proj.stack.slice(0, 3).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
                <div
                  className="work__project-bar"
                  style={{ background: proj.color }}
                />
                <div className="work__project-num">{proj.id}</div>
              </div>
            ))}
          </div>

          <div className="work__preview" id="work-preview">
            <div className="work__preview-inner">
              <div
                className="work__preview-visual"
                style={{ '--accent': projects[active].color }}
              >
                <img
                  className="work__preview-image"
                  src={projects[active].image}
                  alt={`${projects[active].title} website hero preview`}
                  loading="lazy"
                />
                <div className="work__preview-label">
                  <span
                    className="text-mono"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}
                  >
                    {projects[active].id} / PREVIEW
                  </span>
                </div>
              </div>
              <div
                className="work__preview-info"
                style={{ '--accent': projects[active].color }}
              >
                <div className="work__case-header">
                  <span className="text-mono">Case Study</span>
                  <a
                    className="work__case-link hoverable"
                    href={projects[active].url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Site
                  </a>
                </div>
                <h3 className="work__case-title">{projects[active].title}</h3>
                <p className="text-body">{projects[active].caseStudy}</p>

                <div
                  className="work__tech-stack"
                  aria-label={`${projects[active].title} full tech stack`}
                >
                  {projects[active].stack.map((tech, index) => (
                    <span key={tech} style={{ '--i': index }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-outline hoverable"
                  type="button"
                  onClick={() => openProject(projects[active].url)}
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.7rem',
                    padding: '0.6rem 1.2rem',
                    borderColor: projects[active].color,
                    color: projects[active].color,
                  }}
                >
                  Open Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
