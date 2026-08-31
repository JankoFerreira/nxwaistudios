import { Suspense, lazy, useEffect, useState } from 'react'
import './Loader.css'

const LoaderScene = lazy(() => import('./LoaderScene'))

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase(1), 520)
          setTimeout(() => setPhase(2), 1450)
          return 100
        }
        const increment =
          prev < 68 ? Math.random() * 5 + 1.8 : Math.random() * 1.7 + 0.55
        return Math.min(100, prev + increment)
      })
    }, 74)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`loader ${phase === 1 ? 'loader--settled' : ''} ${phase === 2 ? 'loader--exit' : ''}`}
    >
      <div className="loader__bg" />
      <Suspense fallback={<div className="loader__scene" aria-hidden="true" />}>
        <LoaderScene />
      </Suspense>

      <div className="loader__mark" aria-label="NXW loading">
        <div className="loader__letters" aria-hidden="true">
          <span className="loader__letter loader__letter--n">N</span>
          <span className="loader__letter loader__letter--x">X</span>
          <span className="loader__letter loader__letter--w">W</span>
        </div>
      </div>

      <div className="loader__hud">
        <div className="loader__bar-wrap">
          <div className="loader__bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader__meta">
          <span>{String(Math.round(progress)).padStart(3, '0')}</span>
          <span>Building Interface</span>
        </div>
      </div>
    </div>
  )
}
