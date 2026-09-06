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
        opacity: 0,
        x: -40,
        duration: 0.8,
      })

      gsap.from('.about__heading', {
        scrollTrigger: { trigger: '.about__heading', start: 'top 85%' },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
      })

      gsap.from('.about__body p', {
        scrollTrigger: { trigger: '.about__body', start: 'top 80%' },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
      })

      gsap.from('.about__pill', {
        scrollTrigger: { trigger: '.about__pills', start: 'top 85%' },
        opacity: 0,
        scale: 0.8,
        stagger: 0.08,
        duration: 0.6,
      })

      // The horizontal line sweep
      gsap.fromTo(
        '.about__line-inner',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.about__line', start: 'top 80%' },
        }
      )

      gsap.from('.about__card', {
        scrollTrigger: { trigger: '.about__right', start: 'top 80%' },
        opacity: 0,
        y: 50,
        stagger: 0.12,
        duration: 0.8,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const pills = [
    'Three.js',
    'WebGL',
    'AI Integration',
    'React',
    'Generative Art',
    'GSAP',
    'Real-time 3D',
    'LLM APIs',
    'Next.js',
    'Node.js',
  ]

  return (
    <section
      className="section about depth-section"
      id="about"
      ref={sectionRef}
    >
      <div className="about__grid-bg grid-bg" />
      <div className="about__inner">
        <div className="about__left">
          <span className="about__label tag">About NXW</span>
          <div className="about__line">
            <div className="about__line-inner" />
          </div>
          <h2 className="about__heading display-lg">
            Where <span className="grad-cyan">AI</span> supports
            <br />
            better <span className="grad-purple">web design</span>
          </h2>
          <div className="about__body">
            <p className="text-body">
              NexWeb AI Studios is a creative technology studio for businesses
              that want a distinctive, high-performing web presence without the
              generic agency process.
            </p>
            <p className="text-body">
              We shape the concept, design the interface, build the front end,
              and add AI where it improves the experience. The result is a site
              that looks memorable, loads quickly, and gives visitors a clear
              next step.
            </p>
          </div>
          <div className="about__pills">
            {pills.map((p) => (
              <span key={p} className="about__pill hoverable">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="about__right">
          {[
            {
              num: '01',
              title: 'Strategy Before Effects',
              desc: 'Every build starts with the business goal, the audience, and the action the visitor should take next.',
            },
            {
              num: '02',
              title: 'Fast Immersive Design',
              desc: '3D, motion, and visual systems are tuned to feel premium without slowing the site down.',
            },
            {
              num: '03',
              title: 'Useful AI Layers',
              desc: 'AI is added where it helps visitors explore, choose, enquire, or understand the offer faster.',
            },
          ].map((card) => (
            <div className="about__card glass-card hoverable" key={card.num}>
              <span
                className="about__card-num text-mono"
                style={{ color: 'var(--cyan)', fontSize: '0.7rem' }}
              >
                {card.num}
              </span>
              <h3
                className="about__card-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  marginTop: '0.75rem',
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-body"
                style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}
              >
                {card.desc}
              </p>
              <div className="about__card-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
