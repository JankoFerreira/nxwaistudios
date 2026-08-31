import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './HeroSection.css'

export default function HeroSection() {
  const containerRef = useRef(null)

  const scrollToSection = (id) => {
    window._nxwScrollToSection?.(id)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero__tag', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 })
      gsap.from('.hero__title-line', {
        opacity: 0,
        y: 80,
        duration: 1,
        stagger: 0.12,
        delay: 0.5,
        ease: 'power3.out',
      })
      gsap.from('.hero__sub', { opacity: 0, y: 30, duration: 0.8, delay: 1.1 })
      gsap.from('.hero__actions', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.3,
      })
      gsap.from('.hero__scroll-hint', { opacity: 0, duration: 1, delay: 2 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      className="section hero depth-section"
      id="hero"
      ref={containerRef}
    >
      <div className="grid-bg" />
      <div className="hero__inner">
        <div className="hero__tag tag">
          <span>Next Gen AI Studio</span>
        </div>

        <h1 className="hero__title display-xl">
          <div className="hero__title-line">
            <span>We Build</span>
          </div>
          <div className="hero__title-line">
            <span className="grad-cyan">Immersive</span>
          </div>
          <div className="hero__title-line">
            <span>Digital</span>
          </div>
          <div className="hero__title-line">
            <span className="grad-purple">Realities</span>
          </div>
        </h1>

        <p className="hero__sub text-body" style={{ maxWidth: '480px' }}>
          NexWeb AI Studios designs expressive web experiences where sharp
          interface design, useful AI, and cinematic 3D come together. We build
          websites that feel alive.
        </p>

        <div className="hero__actions">
          <button
            className="btn btn-primary hoverable"
            type="button"
            onClick={() => scrollToSection('work')}
          >
            Explore Our Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M8 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="btn btn-outline hoverable"
            type="button"
            onClick={() => scrollToSection('contact')}
          >
            Start a Project
          </button>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <div className="hero__scroll-line" />
        <span
          className="text-mono"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'var(--cyan)',
            writingMode: 'vertical-rl',
          }}
        >
          SCROLL TO EXPLORE
        </span>
        <div className="hero__scroll-dot" />
      </div>

      {/* Decorative elements */}
      <div className="hero__deco hero__deco--tl">
        <span
          className="text-mono"
          style={{ fontSize: '0.65rem', color: 'rgba(0,245,255,0.3)' }}
        >
          NXW.001
        </span>
      </div>
      <div className="hero__deco hero__deco--tr">
        <span
          className="text-mono"
          style={{ fontSize: '0.65rem', color: 'rgba(0,245,255,0.3)' }}
        >
          EST. 2024
        </span>
      </div>
    </section>
  )
}
