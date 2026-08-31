import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './LogoReveal.css'

export default function LogoReveal() {
  const sectionRef = useRef(null)

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

            tl.from(
              '.logo-reveal__eyebrow, .logo-reveal__title-line',
              {
                opacity: 0,
                y: 42,
                stagger: 0.08,
                duration: 0.8,
                ease: 'power3.out',
              },
              0
            )

            tl.from(
              '.logo-reveal__sub, .logo-reveal__signal',
              {
                opacity: 0,
                y: 24,
                stagger: 0.1,
                duration: 0.7,
              },
              '-=0.35'
            )

            tl.from(
              '.logo-reveal__contact',
              {
                opacity: 0,
                y: 28,
                duration: 0.75,
                ease: 'power3.out',
              },
              '-=0.35'
            )

            tl.from(
              '.logo-reveal__footer',
              {
                opacity: 0,
                y: 18,
                stagger: 0.1,
                duration: 0.55,
              },
              '-=0.25'
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

      <div className="logo-reveal__content">
        <div className="logo-reveal__copy">
          <span className="logo-reveal__eyebrow tag">Final Frame</span>
          <h2 className="logo-reveal__title">
            <span className="logo-reveal__title-line">Let&apos;s build</span>
            <span className="logo-reveal__title-line grad-cyan">
              a web presence
            </span>
            <span className="logo-reveal__title-line grad-purple">
              people remember.
            </span>
          </h2>
          <p className="logo-reveal__sub text-body">
            If your brand needs more than a template, NXW can shape the concept,
            interface, motion, and AI layer into one focused digital experience.
          </p>
          <div className="logo-reveal__signals" aria-label="Project strengths">
            {['3D Web', 'AI Interfaces', 'Motion Systems'].map((signal) => (
              <span className="logo-reveal__signal" key={signal}>
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="logo-reveal__contact">
          <div className="logo-reveal__contact-inner">
            <div className="logo-reveal__contact-col">
              <span className="logo-reveal__contact-label text-mono">
                READY TO BUILD?
              </span>
              <h3 className="logo-reveal__contact-title">
                Start with a clear idea.
                <br />
                <span className="grad-full">Leave with a living site.</span>
              </h3>
              <p className="logo-reveal__contact-note text-body">
                Send the rough version, the polished brief, or just the spark.
                We can turn it into a concrete direction.
              </p>
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

        <footer className="logo-reveal__footer-bar">
          <div className="logo-reveal__footer">
            <span className="logo-reveal__footer-item text-mono">
              (c) 2026 NexWeb AI Studios. All rights reserved.
            </span>
            <span className="logo-reveal__footer-item text-mono">
              Johannesburg / Cape Town / Global
            </span>
            <span className="logo-reveal__footer-item text-mono">
              Same world. Sharper ending.
            </span>
          </div>
        </footer>
      </div>
    </section>
  )
}
