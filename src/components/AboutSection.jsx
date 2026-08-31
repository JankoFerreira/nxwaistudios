import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal
      gsap.from('.about__label', {
        scrollTrigger: { trigger: '.about__label', start: 'top 85%' },
        opacity: 0, x: -40, duration: 0.8
      })

      gsap.from('.about__heading', {
        scrollTrigger: { trigger: '.about__heading', start: 'top 85%' },
        opacity: 0, y: 60, duration: 1, ease: 'power3.out'
      })

      gsap.from('.about__body p', {
        scrollTrigger: { trigger: '.about__body', start: 'top 80%' },
        opacity: 0, y: 30, stagger: 0.15, duration: 0.8
      })

      gsap.from('.about__pill', {
        scrollTrigger: { trigger: '.about__pills', start: 'top 85%' },
        opacity: 0, scale: 0.8, stagger: 0.08, duration: 0.6
      })

      // The horizontal line sweep
      gsap.fromTo('.about__line-inner',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.about__line', start: 'top 80%' }
        }
      )

      gsap.from('.about__card', {
        scrollTrigger: { trigger: '.about__right', start: 'top 80%' },
        opacity: 0, y: 50, stagger: 0.12, duration: 0.8
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const pills = ['Three.js', 'WebGL', 'AI Integration', 'React', 'Generative Art', 'GSAP', 'Real-time 3D', 'LLM APIs', 'Next.js', 'Node.js']

  return (
    <section className="section about depth-section" id="about" ref={sectionRef}>
      <div className="about__grid-bg grid-bg" />
      <div className="about__inner">
        <div className="about__left">
          <span className="about__label tag">About NXW</span>
          <div className="about__line">
            <div className="about__line-inner" />
          </div>
          <h2 className="about__heading display-lg">
            Where <span className="grad-cyan">AI</span> meets<br />
            the <span className="grad-purple">Impossible</span>
          </h2>
          <div className="about__body">
            <p className="text-body">
              NexWeb AI Studios is a next-generation creative technology studio operating at the intersection of artificial intelligence, immersive 3D design, and web engineering.
            </p>
            <p className="text-body">
              We believe every brand deserves a digital presence that does not just look beautiful - it feels alive. Our work blurs the line between digital and physical, between website and world.
            </p>
          </div>
          <div className="about__pills">
            {pills.map(p => (
              <span key={p} className="about__pill hoverable">{p}</span>
            ))}
          </div>
        </div>

        <div className="about__right">
          {[
            { num: '01', title: 'AI-First Thinking', desc: 'Every project starts with intelligence. We integrate AI at the core - from generative visuals to intelligent interfaces.' },
            { num: '02', title: '3D + WebGL Mastery', desc: 'We push browsers to their limits. Real-time 3D scenes, particle systems, and shader art that runs in your browser.' },
            { num: '03', title: 'Immersive UX', desc: "Scroll isn't just scrolling here. We craft cinematic journeys where users feel present inside the experience." },
          ].map(card => (
            <div className="about__card glass-card hoverable" key={card.num}>
              <span className="about__card-num text-mono" style={{ color: 'var(--cyan)', fontSize: '0.7rem' }}>{card.num}</span>
              <h3 className="about__card-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.75rem' }}>
                {card.title}
              </h3>
              <p className="text-body" style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>{card.desc}</p>
              <div className="about__card-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
