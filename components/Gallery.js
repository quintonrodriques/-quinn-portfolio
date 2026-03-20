import { useState, useEffect, useCallback } from 'react'

export default function Gallery({ project, onClose }) {
  const [index, setIndex] = useState(0)
  const [captionVisible, setCaptionVisible] = useState(false)
  const [blurbVisible, setBlurbVisible] = useState(false)
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

  // Reset blurb when project changes
  useEffect(() => {
    setBlurbVisible(false)
    setCaptionVisible(false)
    setIndex(0)
  }, [project])

  if (!project) return null
  const slide = slides[index]

  const gradients = [
    'linear-gradient(135deg,#221D35,#312660)',
    'linear-gradient(135deg,#35201D,#602626)',
    'linear-gradient(135deg,#1D3026,#204D35)',
    'linear-gradient(135deg,#1D2835,#204060)',
    'linear-gradient(135deg,#2D2016,#4D3520)',
  ]

  const fullscreenBtnStyle = {
    position: 'absolute', bottom: '12px', right: '12px',
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px', padding: '7px 13px', color: 'white',
    fontSize: '11px', fontFamily: "'Syne Mono', monospace",
    letterSpacing: '0.12em', textTransform: 'uppercase',
    textDecoration: 'none', display: 'flex', alignItems: 'center',
    gap: '6px', zIndex: 10, cursor: 'pointer', transition: 'background 0.2s',
  }

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

        <div className={`gallery-stage${blurbVisible && window.innerWidth < 768 ? ' contracted' : ''}`}>
          {slides.map((s, i) => (
            <div key={i} className={`gallery-slide ${i === index ? (exiting ? 'exit' : 'active') : ''}`}>
              {s.imageUrl ? (
                <>
                  <img src={s.imageUrl} alt={s.label || ''} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                  <a href={s.imageUrl} target="_blank" rel="noopener noreferrer" style={fullscreenBtnStyle}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.85)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}>
                    Full Size
                  </a>
                </>
              ) : (
                <div className="gallery-slide-placeholder" style={{ background: gradients[i % gradients.length] }}>
                  <span>{s.label || '[ Preview ]'}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Caption text below stage on mobile */}
        {slide?.caption && captionVisible && (
          <div className="gallery-caption-text-mobile visible" style={{
            display: 'none',
            fontSize: '13px', lineHeight: '1.6', color: 'var(--muted)',
            fontStyle: 'italic', marginTop: '12px', width: '100%'
          }}>
            {slide.caption}
          </div>
        )}

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
                <div className={`gallery-caption-text gallery-caption-desktop ${captionVisible ? 'visible' : ''}`}>
                  {slide.caption}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {project.blurb && (
              <button className={`gallery-blurb-btn ${blurbVisible ? 'open' : ''}`} onClick={() => setBlurbVisible(v => !v)}>
                <span className="btn-icon">+</span> Overview
              </button>
            )}
            <div className="gallery-dots">
              {slides.map((_, i) => (
                <button key={i} className={`gallery-dot ${i === index ? 'active' : ''}`} onClick={() => { setIndex(i); setCaptionVisible(false) }} />
              ))}
            </div>
          </div>
        </div>

        {/* Blurb panel */}
        {project.blurb && (
          <div className={`gallery-blurb-panel ${blurbVisible ? 'visible' : ''}`}>
            <div className="gallery-blurb-inner">
              <p className="gallery-blurb-text">{project.blurb}</p>
              <div className="gallery-blurb-meta">
                {project.role && (
                  <div className="gallery-blurb-tag">
                    <span className="gallery-blurb-tag-label">Role</span>
                    <span className="gallery-blurb-tag-value">{project.role}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="gallery-blurb-tag">
                    <span className="gallery-blurb-tag-label">Duration</span>
                    <span className="gallery-blurb-tag-value">{project.duration}</span>
                  </div>
                )}
                {project.platform && (
                  <div className="gallery-blurb-tag">
                    <span className="gallery-blurb-tag-label">Platform</span>
                    <span className="gallery-blurb-tag-value">{project.platform}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
