import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ServicesSection.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    id: '01',
    title: 'AI Experience Design',
    desc: 'Custom AI-powered interfaces and generative experiences. We integrate LLMs, image AI, and real-time ML into interactive web products.',
    tags: ['GPT Integration', 'Generative Art', 'ML APIs'],
    color: 'cyan',
  },
  {
    id: '02',
    title: '3D Web Development',
    desc: 'Real-time 3D scenes built with Three.js and WebGL. From product visualizers to full immersive environments that run in any browser.',
    tags: ['Three.js', 'WebGL', 'GLSL Shaders'],
    color: 'purple',
  },
  {
    id: '03',
    title: 'Immersive Web Apps',
    desc: 'Scroll-driven cinematic websites, interactive portals, and digital installations that make users feel inside the product.',
    tags: ['GSAP', 'Lenis', 'Canvas'],
    color: 'cyan',
  },
  {
    id: '04',
    title: 'Brand Identity & Motion',
    desc: 'Visual identity systems built for the digital age - logos that animate, brand books that breathe, motion design that moves culture.',
    tags: ['Motion Design', 'Brand Systems', 'After Effects'],
    color: 'purple',
  },
  {
    id: '05',
    title: 'Full-Stack Engineering',
    desc: 'From database architecture to CDN edge functions - we build robust, scalable systems to power extraordinary front-end experiences.',
    tags: ['React', 'Node.js', 'Supabase'],
    color: 'cyan',
  },
  {
    id: '06',
    title: 'XR & Spatial Web',
    desc: 'WebXR experiences, AR product try-ons, and spatial computing interfaces for the next generation of the web.',
    tags: ['WebXR', 'Three.js', 'A-Frame'],
    color: 'purple',
  },
]

export default function ServicesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services__header', {
        scrollTrigger: { trigger: '.services__header', start: 'top 85%' },
        opacity: 0, y: 50, duration: 1
      })

      gsap.from('.service-item', {
        scrollTrigger: { trigger: '.services__list', start: 'top 80%' },
        opacity: 0, y: 40, stagger: 0.1, duration: 0.7
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

  const marqueeItems = ['Three.js', '.', 'WebGL', '.', 'React', '.', 'AI', '.', 'GSAP', '.', 'Node.js', '.', 'WebXR', '.', 'GLSL', '.', 'LLMs', '.', 'Canvas', '.']

  return (
    <section className="section services depth-section" id="services" ref={sectionRef}>
      <div className="grid-bg" />

      <div className="services__inner">
        <div className="services__header">
          <span className="tag">What We Do</span>
          <h2 className="display-lg" style={{ marginTop: '1.5rem' }}>
            Our <span className="grad-cyan">Services</span>
          </h2>
          <p className="text-body" style={{ maxWidth: '500px', marginTop: '1rem' }}>
            A full-service creative technology studio. We handle everything - strategy, design, engineering, and AI integration.
          </p>
        </div>

        <div className="services__list">
          {services.map((service, i) => (
            <div className={`service-item glass-card hoverable`} key={service.id}>
              <div className="service-item__header">
                <span className="service-item__num text-mono" style={{ color: service.color === 'cyan' ? 'var(--cyan)' : 'var(--purple)' }}>
                  {service.id}
                </span>
                <div className="service-item__line" style={{ background: service.color === 'cyan' ? 'var(--cyan)' : 'var(--purple)' }} />
              </div>
              <h3 className="service-item__title">{service.title}</h3>
              <p className="text-body service-item__desc">{service.desc}</p>
              <div className="service-item__tags">
                {service.tags.map(tag => (
                  <span className="service-item__tag" key={tag}
                    style={{ borderColor: service.color === 'cyan' ? 'rgba(0,245,255,0.2)' : 'rgba(168,85,247,0.2)',
                             color: service.color === 'cyan' ? 'var(--cyan)' : 'var(--purple-light)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="service-item__arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            <span key={i} className={`services__marquee-item ${item === '.' ? 'dot' : ''}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
