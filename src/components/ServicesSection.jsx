import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ServicesSection.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    id: '01',
    title: 'AI Experience Design',
    desc: 'Custom AI-assisted interfaces, lead flows, and interactive tools that help visitors get to the right answer faster.',
    tags: ['GPT Integration', 'Generative Art', 'ML APIs'],
    color: 'cyan',
  },
  {
    id: '02',
    title: '3D Web Development',
    desc: 'Real-time 3D scenes built with Three.js and WebGL, from product moments to immersive brand environments.',
    tags: ['Three.js', 'WebGL', 'GLSL Shaders'],
    color: 'purple',
  },
  {
    id: '03',
    title: 'Immersive Web Apps',
    desc: 'Scroll-led sites, interactive portals, and launch pages that guide visitors through the story with purpose.',
    tags: ['GSAP', 'Lenis', 'Canvas'],
    color: 'cyan',
  },
  {
    id: '04',
    title: 'Brand Identity & Motion',
    desc: 'Visual systems, animated marks, and motion rules that make a brand feel consistent across the modern web.',
    tags: ['Motion Design', 'Brand Systems', 'After Effects'],
    color: 'purple',
  },
  {
    id: '05',
    title: 'Full-Stack Engineering',
    desc: 'Robust web builds, integrations, and hosting foundations that keep the experience stable after launch.',
    tags: ['React', 'Node.js', 'Supabase'],
    color: 'cyan',
  },
  {
    id: '06',
    title: 'Launch & Optimization',
    desc: 'Performance tuning, SEO basics, analytics readiness, and practical improvements after the first version goes live.',
    tags: ['Performance', 'SEO', 'Analytics'],
    color: 'purple',
  },
]

export default function ServicesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services__header', {
        scrollTrigger: { trigger: '.services__header', start: 'top 85%' },
        opacity: 0,
        y: 50,
        duration: 1,
      })

      gsap.from('.service-item', {
        scrollTrigger: { trigger: '.services__list', start: 'top 80%' },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
      })

      // Marquee for technology strip
      gsap.to('.services__marquee-inner', {
        x: '-50%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const marqueeItems = [
    'Three.js',
    '.',
    'WebGL',
    '.',
    'React',
    '.',
    'AI',
    '.',
    'GSAP',
    '.',
    'Node.js',
    '.',
    'WebXR',
    '.',
    'GLSL',
    '.',
    'LLMs',
    '.',
    'Canvas',
    '.',
  ]

  return (
    <section
      className="section services depth-section"
      id="services"
      ref={sectionRef}
    >
      <div className="grid-bg" />

      <div className="services__inner">
        <div className="services__header">
          <span className="tag">What We Do</span>
          <h2 className="display-lg" style={{ marginTop: '1.5rem' }}>
            Our <span className="grad-cyan">Services</span>
          </h2>
          <p
            className="text-body"
            style={{ maxWidth: '500px', marginTop: '1rem' }}
          >
            Strategy, design, engineering, and AI integration for brands that
            want a site people can remember and use with ease.
          </p>
        </div>

        <div className="services__list">
          {services.map((service) => (
            <div
              className={`service-item glass-card hoverable`}
              key={service.id}
            >
              <div className="service-item__header">
                <span
                  className="service-item__num text-mono"
                  style={{
                    color:
                      service.color === 'cyan'
                        ? 'var(--cyan)'
                        : 'var(--purple)',
                  }}
                >
                  {service.id}
                </span>
                <div
                  className="service-item__line"
                  style={{
                    background:
                      service.color === 'cyan'
                        ? 'var(--cyan)'
                        : 'var(--purple)',
                  }}
                />
              </div>
              <h3 className="service-item__title">{service.title}</h3>
              <p className="text-body service-item__desc">{service.desc}</p>
              <div className="service-item__tags">
                {service.tags.map((tag) => (
                  <span
                    className="service-item__tag"
                    key={tag}
                    style={{
                      borderColor:
                        service.color === 'cyan'
                          ? 'rgba(0,245,255,0.2)'
                          : 'rgba(168,85,247,0.2)',
                      color:
                        service.color === 'cyan'
                          ? 'var(--cyan)'
                          : 'var(--purple-light)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="service-item__arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10h12M10 4l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology marquee */}
      <div className="services__marquee">
        <div className="services__marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className={`services__marquee-item ${item === '.' ? 'dot' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
