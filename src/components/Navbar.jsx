import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const links = ['About', 'Services', 'Work', 'Pricing', 'Contact']
const mobileMenuId = 'site-mobile-menu'

export default function Navbar({ scrollProgress, activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const burgerRef = useRef(null)

  useEffect(() => {
    setScrolled(scrollProgress > 0.02)
  }, [scrollProgress])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || !menuOpen) return
      setMenuOpen(false)
      burgerRef.current?.focus()
    }

    document.body.classList.toggle('menu-open', menuOpen)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const scrollTo = (id) => {
    window._nxwScrollToSection?.(id.toLowerCase())
    setMenuOpen(false)
  }

  const scrollToTop = () => {
    window._nxwScrollToSection?.('hero')
  }

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      aria-label="Primary navigation"
    >
      <div className="navbar__inner">
        <button
          className="navbar__logo hoverable"
          type="button"
          onClick={scrollToTop}
          aria-label="Go to top"
        >
          <span className="navbar__logo-nxw grad-cyan">NXW</span>
          <span className="navbar__logo-dot" />
          <span className="navbar__logo-studios text-mono">Studios</span>
        </button>

        <div className="navbar__links">
          {links.map((link) => (
            <button
              key={link}
              className={`navbar__link hoverable ${activeSection === link.toLowerCase() ? 'navbar__link--active' : ''}`}
              onClick={() => scrollTo(link)}
              type="button"
              aria-current={
                activeSection === link.toLowerCase() ? 'page' : undefined
              }
            >
              <span className="navbar__link-text text-mono">{link}</span>
            </button>
          ))}
          <button
            className="btn btn-primary navbar__cta hoverable"
            type="button"
            onClick={() => scrollTo('Contact')}
          >
            Let&apos;s Build
          </button>
        </div>

        <button
          ref={burgerRef}
          className={`navbar__burger hoverable ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls={mobileMenuId}
          aria-expanded={menuOpen}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        id={mobileMenuId}
        aria-hidden={!menuOpen}
      >
        {links.map((link, i) => (
          <button
            key={link}
            className="navbar__mobile-link hoverable"
            onClick={() => scrollTo(link)}
            type="button"
            tabIndex={menuOpen ? 0 : -1}
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <span
              className="text-mono"
              style={{
                color: 'var(--cyan)',
                fontSize: '0.7rem',
                marginRight: '0.75rem',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="display-md" style={{ fontSize: '2rem' }}>
              {link}
            </span>
          </button>
        ))}
      </div>

      <div
        className="navbar__progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </nav>
  )
}
