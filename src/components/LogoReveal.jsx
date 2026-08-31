import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './LogoReveal.css'

export default function LogoReveal() {
  const sectionRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const ctx = gsap.context(() => {
          function animateLogo() {
            const tl = gsap.timeline()

            tl.from('.logo-reveal__letter', {
              opacity: 0,
              y: 34,
              stagger: 0.15,
              duration: 0.7,
              ease: 'power3.out',
            })

            tl.from(
              '.logo-reveal__tagline span',
              {
                opacity: 0,
                y: 20,
                stagger: 0.05,
                duration: 0.6,
              },
              '-=0.5'
            )

            tl.from(
              '.logo-reveal__underline',
              {
                scaleX: 0,
                duration: 1.2,
                ease: 'power3.inOut',
              },
              '-=0.8'
            )

            tl.from(
              '.logo-reveal__footer',
              {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.6,
              },
              '-=0.4'
            )

            tl.from(
              '.logo-reveal__contact',
              {
                opacity: 0,
                y: 30,
                duration: 0.8,
              },
              '-=0.4'
            )
          }
          animateLogo()
        }, section)
        section._logoRevealCtx = ctx
      },
      { threshold: 0.35 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      section._logoRevealCtx?.revert()
    }
  }, [])

  return (
    <section
      className="section logo-reveal depth-section"
      id="contact"
      ref={sectionRef}
    >
      <div className="logo-reveal__bg" />

      {/* Main logo */}
      <div className="logo-reveal__content">
        <div className="logo-reveal__logo-wrap" ref={logoRef}>
          {/* Corner frames */}
          <div className="logo-reveal__frame">
            <span className="logo-reveal__corner logo-reveal__corner--tl" />
            <span className="logo-reveal__corner logo-reveal__corner--tr" />
            <span className="logo-reveal__corner logo-reveal__corner--bl" />
            <span className="logo-reveal__corner logo-reveal__corner--br" />

            <div className="logo-reveal__letters">
              {'NXW'.split('').map((l, i) => (
                <span
                  key={i}
                  className="logo-reveal__letter"
                  data-letter={l}
                  style={{ '--i': i }}
                >
                  {l}
                </span>
              ))}
            </div>

            <div className="logo-reveal__underline">
              <div className="logo-reveal__underline-inner" />
            </div>
          </div>

          <div className="logo-reveal__tagline">
            <span>NEXWEB AI STUDIOS</span>
          </div>

          <p className="logo-reveal__sub text-body">
            Building the future of digital experience.
            <br />
            One pixel. One neuron. One world at a time.
          </p>
        </div>

        {/* Contact / CTA */}
        <div className="logo-reveal__contact">
          <div className="logo-reveal__contact-inner">
            <div className="logo-reveal__contact-col">
              <span
                className="text-mono"
                style={{ color: 'var(--cyan)', fontSize: '0.65rem' }}
              >
                READY TO BUILD?
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  marginTop: '0.5rem',
                }}
              >
                Let&apos;s Create
                <br />
                <span className="grad-full">Something Legendary</span>
              </h3>
            </div>
            <div className="logo-reveal__contact-actions">
              <button
                className="btn btn-primary hoverable"
                type="button"
                onClick={() =>
                  (window.location.href =
                    'mailto:hello@nxwstudios.ai?subject=New%20NXW%20project')
                }
              >
                Start a Project
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
              <a
                href="mailto:hello@nxwstudios.ai"
                className="btn btn-outline hoverable"
              >
                hello@nxwstudios.ai
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="logo-reveal__footer-bar">
          <div className="logo-reveal__footer">
            <span
              className="text-mono"
              style={{ fontSize: '0.65rem', color: 'var(--white-dim)' }}
            >
              (c) 2026 NexWeb AI Studios. All rights reserved.
            </span>
            <span
              className="text-mono"
              style={{ fontSize: '0.65rem', color: 'var(--white-dim)' }}
            >
              Johannesburg / Cape Town / Global
            </span>
            <span
              className="text-mono"
              style={{ fontSize: '0.65rem', color: 'var(--white-dim)' }}
            >
              Built with Three.js and heart
            </span>
          </div>
        </footer>
      </div>
    </section>
  )
}
