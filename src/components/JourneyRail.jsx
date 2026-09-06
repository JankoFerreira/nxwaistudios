import './JourneyRail.css'

const stops = [
  { id: 'hero', label: 'Enter', progress: 0 },
  { id: 'about', label: 'About', progress: 0.2 },
  { id: 'services', label: 'Services', progress: 0.4 },
  { id: 'work', label: 'Work', progress: 0.6 },
  { id: 'pricing', label: 'Pricing', progress: 0.8 },
  { id: 'contact', label: 'Contact', progress: 1 },
]

export default function JourneyRail({ scrollProgress }) {
  const active = stops.reduce((closest, stop, index) => {
    const currentDistance = Math.abs(scrollProgress - stop.progress)
    const closestDistance = Math.abs(scrollProgress - stops[closest].progress)
    return currentDistance < closestDistance ? index : closest
  }, 0)

  const jumpTo = (id) => {
    window._nxwScrollToSection?.(id)
  }

  return (
    <aside className="journey-rail" aria-label="Page journey">
      <span className="journey-rail__hint text-mono">Depth Scroll</span>
      <div className="journey-rail__line">
        <span
          className="journey-rail__fill"
          style={{ transform: `scaleY(${scrollProgress})` }}
        />
      </div>
      <div className="journey-rail__stops">
        {stops.map((stop, index) => (
          <button
            key={stop.id}
            type="button"
            className={`journey-rail__stop hoverable ${active === index ? 'journey-rail__stop--active' : ''}`}
            onClick={() => jumpTo(stop.id)}
            aria-label={`Go to ${stop.label}`}
          >
            <span className="journey-rail__dot" />
            <span className="journey-rail__label text-mono">{stop.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
