import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const links = ['About', 'Services', 'Work', 'Contact']

export default function Navbar({ scrollProgress, activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setScrolled(scrollProgress > 0.02)
  }, [scrollProgress])

  const scrollTo = (id) => {
    window._nxwScrollToSection?.(id.toLowerCase())
    setMenuOpen(false)
  }

  const scrollToTop = () => {
    window._nxwScrollToSection?.('hero')
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button className="navbar__logo hoverable" type="button" onClick={scrollToTop} aria-label="Go to top">
          <span className="navbar__logo-nxw grad-cyan">NXW</span>
          <span className="navbar__logo-dot" />
          <span className="navbar__logo-studios text-mono">Studios</span>
        </button>

        <div className="navbar__links">
          {links.map(link => (
            <button
              key={link}
              className={`navbar__link hoverable ${activeSection === link.toLowerCase() ? 'navbar__link--active' : ''}`}
              onClick={() => scrollTo(link)}
              type="button"
            >
              <span className="navbar__link-text text-mono">{link}</span>
            </button>
          ))}
          <button className="btn btn-primary navbar__cta hoverable" type="button" onClick={() => scrollTo('Contact')}>
            Let's Build
          </button>
        </div>

        <button
          className={`navbar__burger hoverable ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          type="button"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {links.map((link, i) => (
          <button
            key={link}
            className="navbar__mobile-link hoverable"
            onClick={() => scrollTo(link)}
            type="button"
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <span className="text-mono" style={{ color: 'var(--cyan)', fontSize: '0.7rem', marginRight: '0.75rem' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="display-md" style={{ fontSize: '2rem' }}>{link}</span>
          </button>
        ))}
      </div>

      <div className="navbar__progress" style={{ transform: `scaleX(${scrollProgress})` }} />
    </nav>
  )
}
