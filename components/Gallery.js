import { useState, useEffect, useCallback } from 'react'

export default function Gallery({ project, onClose }) {
  const [index, setIndex] = useState(0)
  const [captionVisible, setCaptionVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const slides = project?.slides || []
  const total = slides.length

  const changeSlide = useCallback((dir) => {
    const next = index + dir
    if (next < 0 || next >= total) return
    setExiting(true)
    setTimeout(() => {
      setIndex(next)
      setExiting(false)
      setCaptionVisible(false)
    }, 200)
  }, [index, total])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') changeSlide(1)
      if (e.key === 'ArrowLeft') changeSlide(-1)
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [changeSlide, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!project) return null
  const slide = slides[index]

  // Placeholder gradient colors cycling
  const gradients = [
    'linear-gradient(135deg,#221D35,#312660)',
    'linear-gradient(135deg,#35201D,#602626)',
    'linear-gradient(135deg,#1D3026,#204D35)',
    'linear-gradient(135deg,#1D2835,#204060)',
    'linear-gradient(135deg,#2D2016,#4D3520)',
  ]

  return (
    <div className="gallery-overlay open" onClick={(e) => e.target.classList.contains('gallery-overlay') && onClose()}>
      <div className="gallery-modal">
        <div className="gallery-topbar">
          <div>
            <div className="gallery-meta">
              <span className="gallery-type">{project.type}</span>
              <span className="gallery-type" style={{ opacity: 0.3 }}>{project.year}</span>
            </div>
            <div className="gallery-project-name">{project.title}</div>
          </div>
          <button className="gallery-close" onClick={onClose}>✕</button>
        </div>

        <div className="gallery-stage">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`gallery-slide ${i === index ? (exiting ? 'exit' : 'active') : ''}`}
            >
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="gallery-slide-placeholder" style={{ background: gradients[i % gradients.length] }}>
                  <span>{s.label || '[ Preview ]'}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="gallery-bottombar">
          <div className="gallery-nav">
            <button className="gallery-btn" onClick={() => changeSlide(-1)} disabled={index === 0}>←</button>
            <span className="gallery-counter">{index + 1} / {total}</span>
            <button className="gallery-btn" onClick={() => changeSlide(1)} disabled={index === total - 1}>→</button>
          </div>

          <div className="gallery-caption-wrap">
            {slide?.caption && (
              <>
                <button className="gallery-caption-toggle" onClick={() => setCaptionVisible(v => !v)}>
                  {captionVisible ? 'Hide Caption' : 'Show Caption'}
                </button>
                <div className={`gallery-caption-text ${captionVisible ? 'visible' : ''}`}>
                  {slide.caption}
                </div>
              </>
            )}
          </div>

          <div className="gallery-dots">
            {slides.map((_, i) => (
              <button key={i} className={`gallery-dot ${i === index ? 'active' : ''}`} onClick={() => { setIndex(i); setCaptionVisible(false) }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
