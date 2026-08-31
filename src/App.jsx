import { useEffect, useRef, useState } from 'react'
import ThreeScene from './components/ThreeScene'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import WorkSection from './components/WorkSection'
import LogoReveal from './components/LogoReveal'
import JourneyRail from './components/JourneyRail'
import Loader from './components/Loader'

const SECTION_IDS = ['hero', 'about', 'services', 'work', 'contact']
const SECTION_LABELS = ['Home', 'About', 'Services', 'Work', 'Contact']
const FINALE_ORBIT_POINTS = [
  { x: -22, y: 18 },
  { x: -23, y: -12 },
  { x: 0, y: -28 },
  { x: 23, y: -12 },
  { x: 22, y: 18 },
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')
  const rafRef = useRef(null)
  const activeSectionRef = useRef('hero')

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 3800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loaded) return

    const mobileQuery = window.matchMedia('(max-width: 768px)')
    if (mobileQuery.matches) {
      let ticking = false
      const getMaxScroll = () =>
        Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const updateMobileProgress = () => {
        ticking = false
        const progress = Math.min(
          Math.max(window.scrollY / getMaxScroll(), 0),
          1
        )
        window._nxwScrollProgress = progress
        window._nxwFinaleProgress = 0
        window._nxwActiveSectionIndex = SECTION_IDS.indexOf(
          activeSectionRef.current
        )
        setScrollProgress(progress)
      }

      const onMobileScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(updateMobileProgress)
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          if (
            visible?.target?.id &&
            visible.target.id !== activeSectionRef.current
          ) {
            activeSectionRef.current = visible.target.id
            window._nxwActiveSectionIndex = SECTION_IDS.indexOf(
              visible.target.id
            )
            setActiveSection(visible.target.id)
          }
        },
        {
          threshold: [0.35, 0.55, 0.75],
        }
      )

      SECTION_IDS.forEach((id) => {
        const section = document.getElementById(id)
        if (section) observer.observe(section)
      })

      window._nxwScrollToSection = (id) => {
        const section = document.getElementById(id)
        if (section)
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      window._nxwScrollProgress = Math.min(
        Math.max(window.scrollY / getMaxScroll(), 0),
        1
      )
      window._nxwFinaleProgress = 0
      window._nxwActiveSectionIndex = 0
      window.addEventListener('scroll', onMobileScroll, { passive: true })
      updateMobileProgress()

      return () => {
        observer.disconnect()
        window.removeEventListener('scroll', onMobileScroll)
        delete window._nxwScrollToSection
        delete window._nxwFinaleProgress
      }
    }

    let targetPanel = 0
    let smoothPanel = 0
    let lastUiProgress = -1
    let lastUiSection = -1
    let desiredPanel = 0
    let wheelAccumulator = 0
    let lastWheelStep = 0
    let snapTimer = null
    let programmaticScroll = false
    let scrollAnimationRef = null
    let scrollDirection = 0
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const sectionMaxPanel = SECTION_IDS.length - 1
    const maxPanel = SECTION_IDS.length
    const getMaxScroll = () =>
      Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    const panelToScroll = (index) => (index / maxPanel) * getMaxScroll()

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const scrollToPanel = (index) => {
      const currentPanel =
        clamp(window.scrollY / getMaxScroll(), 0, 1) * maxPanel
      desiredPanel = clamp(index, 0, maxPanel)
      scrollDirection = Math.sign(desiredPanel - currentPanel)
      programmaticScroll = true
      cancelAnimationFrame(scrollAnimationRef)
      clearTimeout(snapTimer)

      const startY = window.scrollY
      const endY = panelToScroll(desiredPanel)
      const distance = endY - startY
      const duration = 1650
      const startTime = performance.now()

      const animateScroll = (now) => {
        const progress = clamp((now - startTime) / duration, 0, 1)
        window.scrollTo(0, startY + distance * easeInOutCubic(progress))

        if (progress < 1) {
          scrollAnimationRef = requestAnimationFrame(animateScroll)
        } else {
          window.setTimeout(() => {
            programmaticScroll = false
            scrollDirection = 0
          }, 220)
        }
      }

      scrollAnimationRef = requestAnimationFrame(animateScroll)
    }

    window._nxwScrollToSection = (id) => {
      const index = SECTION_IDS.indexOf(id)
      if (index < 0) return
      scrollToPanel(index)
    }

    const snapToNearestPanel = () => {
      const nearest = clamp(Math.round(targetPanel), 0, maxPanel)
      if (Math.abs(targetPanel - nearest) > 0.025) {
        scrollToPanel(nearest)
      }
    }

    const onWheel = (event) => {
      // Section scroll assist: wheel input is translated into one panel step at
      // a time, so fast scrolling cannot accidentally blast past content.
      event.preventDefault()

      const now = performance.now()
      wheelAccumulator += event.deltaY
      const threshold = 72
      if (Math.abs(wheelAccumulator) < threshold) return

      const direction = Math.sign(wheelAccumulator)
      wheelAccumulator = 0

      // If the user changes their mind mid-transition, reverse immediately
      // instead of forcing the current section animation to finish first.
      if (programmaticScroll && scrollDirection !== 0) {
        if (direction !== scrollDirection) {
          cancelAnimationFrame(scrollAnimationRef)
          programmaticScroll = false
          scrollDirection = 0
          lastWheelStep = now
          const reverseTarget =
            direction > 0 ? Math.ceil(smoothPanel) : Math.floor(smoothPanel)
          scrollToPanel(reverseTarget)
        }
        return
      }

      if (now - lastWheelStep < 1550) return
      lastWheelStep = now
      const current = clamp(Math.round(targetPanel), 0, maxPanel)
      scrollToPanel(current + direction)
    }

    const onKeyDown = (event) => {
      const nextKeys = ['ArrowDown', 'PageDown', 'Space']
      const prevKeys = ['ArrowUp', 'PageUp']
      if (![...nextKeys, ...prevKeys].includes(event.code)) return
      event.preventDefault()
      const direction = nextKeys.includes(event.code) ? 1 : -1
      scrollToPanel(clamp(Math.round(targetPanel), 0, maxPanel) + direction)
    }

    const onScroll = () => {
      if (programmaticScroll) return
      clearTimeout(snapTimer)
      snapTimer = window.setTimeout(snapToNearestPanel, 170)
    }

    const updatePanels = () => {
      targetPanel = clamp(window.scrollY / getMaxScroll(), 0, 1) * maxPanel

      // Scroll lerp: wheel/touch movement sets a target, then requestAnimationFrame
      // eases the visible panel world toward it for a heavy cinematic scroll.
      smoothPanel += (targetPanel - smoothPanel) * 0.03
      const smoothProgress = clamp(smoothPanel / sectionMaxPanel, 0, 1)
      const finaleProgress = clamp(smoothPanel - sectionMaxPanel, 0, 1)

      window._nxwScrollProgress = smoothProgress
      window._nxwFinaleProgress = finaleProgress
      window._nxwSectionProgress = smoothPanel
      const activeIndex = clamp(Math.round(smoothPanel), 0, sectionMaxPanel)
      window._nxwActiveSectionIndex = activeIndex
      const activeId = SECTION_IDS[activeIndex]
      if (activeId !== activeSectionRef.current) {
        activeSectionRef.current = activeId
        setActiveSection(activeId)
      }

      const baseIndex = clamp(Math.floor(smoothPanel), 0, sectionMaxPanel)
      const localProgress = smoothPanel - baseIndex
      const returningFromFinale =
        finaleProgress > 0 && targetPanel < sectionMaxPanel + 0.45
      SECTION_IDS.forEach((id, index) => {
        const section = document.getElementById(id)
        if (!section) return

        let x = 0
        let y = 0
        let z = 0
        let rotate = 0
        let scale = 1
        let opacity = 0
        let blur = 0
        let landingPulse = 0

        if (finaleProgress > 0) {
          const settle = easeInOutCubic(finaleProgress)
          const initialX = index === sectionMaxPanel ? 0 : -68
          const initialY = index === sectionMaxPanel ? 0 : 62
          const initialZ = index === sectionMaxPanel ? 0 : -220
          const initialScale = index === sectionMaxPanel ? 1 : 0.88
          const initialOpacity = index === sectionMaxPanel ? 1 : 0
          const initialRotate = index === sectionMaxPanel ? 0 : -16
          const orbitX = FINALE_ORBIT_POINTS[index].x
          const orbitY = FINALE_ORBIT_POINTS[index].y

          x = initialX + (orbitX - initialX) * settle
          y = initialY + (orbitY - initialY) * settle
          z = initialZ + (40 - initialZ) * settle
          rotate = initialRotate * (1 - settle)
          scale = initialScale + (0.18 - initialScale) * settle
          opacity = initialOpacity + (0.94 - initialOpacity) * settle
          blur = (1 - settle) * 5
          landingPulse = Math.max(0, 1 - Math.abs(1 - settle) * 8)
        } else if (index === baseIndex) {
          // Knob-like circular movement: the current section turns out from the
          // center to the bottom-left along a clean quarter-circle path.
          const progress = clamp(localProgress / 0.48, 0, 1)
          const angle = progress * Math.PI * 0.5
          x = -Math.sin(angle) * 68
          y = (1 - Math.cos(angle)) * 62
          z = -progress * 440
          rotate = -progress * 16
          scale = 1 - progress * 0.12
          opacity = clamp(1 - progress * 1.15, 0, 1)
          blur = progress * 5.5
          landingPulse = Math.max(0, 1 - progress * 8)
        } else if (index === baseIndex + 1) {
          // The next section waits at bottom-right, then turns into the center
          // on the matching quarter-circle once the previous panel has left.
          const progress = clamp((localProgress - 0.52) / 0.48, 0, 1)
          const angle = (1 - progress) * Math.PI * 0.5
          x = Math.sin(angle) * 68
          y = (1 - Math.cos(angle)) * 62
          z = -(1 - progress) * 440
          rotate = (1 - progress) * 16
          scale = 0.88 + progress * 0.12
          opacity = clamp((progress - 0.08) * 1.3, 0, 1)
          blur = (1 - progress) * 5.5
          landingPulse = Math.max(0, 1 - Math.abs(1 - progress) * 8)
        } else if (
          index === sectionMaxPanel &&
          smoothPanel >= sectionMaxPanel - 0.01
        ) {
          opacity = 1
          landingPulse = 1
        }

        section.classList.toggle('depth-section--active', index === activeIndex)
        section.classList.toggle('depth-section--finale', finaleProgress > 0.01)
        section.classList.toggle(
          'depth-section--contact-return',
          index === sectionMaxPanel && returningFromFinale
        )
        section.dataset.finaleLabel = SECTION_LABELS[index]
        section.style.setProperty('--arc-x', `${x.toFixed(3)}vw`)
        section.style.setProperty('--arc-y', `${y.toFixed(3)}vh`)
        section.style.setProperty('--arc-z', `${z.toFixed(2)}px`)
        section.style.setProperty('--arc-rotate', `${rotate.toFixed(3)}deg`)
        section.style.setProperty('--arc-scale', scale.toFixed(4))
        section.style.setProperty('--arc-opacity', opacity.toFixed(4))
        const resolvedBlur =
          index === sectionMaxPanel && returningFromFinale ? 0 : blur
        section.style.setProperty('--arc-blur', `${resolvedBlur.toFixed(3)}px`)
        section.style.setProperty('--arc-pulse', landingPulse.toFixed(4))
        section.style.pointerEvents =
          opacity > 0.7 && finaleProgress < 0.7 ? 'auto' : 'none'
      })

      if (
        activeIndex !== lastUiSection ||
        Math.abs(smoothProgress - lastUiProgress) > 0.012
      ) {
        lastUiSection = activeIndex
        lastUiProgress = smoothProgress
        setScrollProgress(smoothProgress)
      }

      rafRef.current = requestAnimationFrame(updatePanels)
    }

    window._nxwScrollProgress = 0
    window._nxwFinaleProgress = 0
    window._nxwSectionProgress = 0
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    rafRef.current = requestAnimationFrame(updatePanels)

    return () => {
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(scrollAnimationRef)
      clearTimeout(snapTimer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      delete window._nxwScrollToSection
      delete window._nxwFinaleProgress
      delete window._nxwActiveSectionIndex
    }
  }, [loaded])

  return (
    <>
      {!loaded && <Loader />}
      <Cursor />
      {loaded && <PresenceField />}
      <div className="noise-overlay" />
      <ThreeScene loaded={loaded} />
      {loaded && (
        <>
          <Navbar
            scrollProgress={scrollProgress}
            activeSection={activeSection}
          />
          <JourneyRail scrollProgress={scrollProgress} />
          <main className="scroll-container">
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <WorkSection />
            <LogoReveal />
          </main>
          <div className="scroll-spacer" aria-hidden="true" />
        </>
      )}
    </>
  )
}

function PresenceField() {
  const visitors = [
    { id: 1, x: '12%', y: '24%', delay: '0s', label: 'live' },
    { id: 2, x: '78%', y: '18%', delay: '-4s', label: 'viewing' },
    { id: 3, x: '84%', y: '72%', delay: '-8s', label: 'exploring' },
  ]

  return (
    <div className="presence-field" aria-hidden="true">
      {visitors.map((visitor) => (
        <span
          key={visitor.id}
          className="presence-field__visitor"
          style={{
            '--x': visitor.x,
            '--y': visitor.y,
            '--delay': visitor.delay,
          }}
        >
          <span className="presence-field__dot" />
          <span className="presence-field__label">{visitor.label}</span>
        </span>
      ))}
    </div>
  )
}
