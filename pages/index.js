import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Gallery from '../components/Gallery'
import { getProjects, getAbout } from '../lib/sanity'

// Fallback data used when Sanity isn't connected yet
const FALLBACK_UI = [
  { _id: 'ui1', title: 'Meridian Analytics', type: 'Dashboard', year: '2026', description: 'Data visualization platform redesigned for clarity — a 40% drop in cognitive load.', slides: [{ label: 'Overview Dashboard', caption: 'Redesigned main analytics view to surface key metrics at a glance.' }] },
  { _id: 'ui2', title: 'Dusk Finance', type: 'Mobile App', year: '2026', description: 'Personal finance app with a warm, approachable aesthetic that makes money feel human.', tall: true, slides: [{ label: 'Onboarding Flow', caption: 'Warm step-by-step onboarding reduced drop-off by 28%.' }] },
  { _id: 'ui3', title: 'Ember UI Kit', type: 'Design System', year: '2023', description: '320-component library powering five products across two platforms.', slides: [{ label: 'Component Library', caption: '320 components in 12 categories.' }] },
  { _id: 'ui4', title: 'Solstice CMS', type: 'Web App', year: '2023', description: 'Editorial workflow platform with a new information architecture and redesigned nav.', slides: [{ label: 'Editorial Interface', caption: 'Distraction-free writing environment.' }] },
  { _id: 'ui5', title: 'Doom: The Dark Ages', type: 'Video Game', year: '2025', description: 'HUD and menu system design for id Software\'s dark medieval reimagining of the iconic franchise.', slides: [{ label: 'HUD System', caption: 'Minimalist HUD maintaining immersion.' }] },
  { _id: 'ui6', title: 'Cyberpunk Motion Resume', type: 'Motion / Interactive', year: '2024', description: 'An animated, interactive résumé built as a fully playable cyberpunk terminal experience.', tall: true, slides: [{ label: 'Terminal Boot', caption: 'Animated boot sequence sets the tone.' }] },
  { _id: 'ui7', title: 'Room Escape', type: 'Experience Design', year: '2024', description: 'Full UI design and visual identity for an immersive escape room experience.', slides: [{ label: 'Booking Flow', caption: 'Themed booking experience sets narrative expectations.' }] },
]

const FALLBACK_UX = [
  { _id: 'ux1', title: 'Healthcare Onboarding', type: 'Research', year: '2026', description: '12-week discovery sprint uncovering friction in patient intake flows.', slides: [{ label: 'Research Synthesis', caption: '12 weeks of discovery across 6 hospitals.' }] },
  { _id: 'ux2', title: 'Atlas Checkout', type: 'Service Design', year: '2026', description: 'End-to-end journey redesign reducing cart abandonment by 31%.', tall: true, slides: [{ label: 'Behavioural Analysis', caption: 'Heatmaps and session recordings identified 6 abandonment triggers.' }] },
  { _id: 'ux3', title: 'Waypoint Navigation', type: 'Systems Design', year: '2023', description: 'IA overhaul for a B2B SaaS platform. 60 user interviews, reduced support tickets by 44%.', slides: [{ label: 'IA Audit', caption: '60 user interviews and card sorting sessions.' }] },
  { _id: 'ux4', title: 'Nova Inclusive Design', type: 'Accessibility', year: '2023', description: 'Comprehensive audit and redesign bringing a fintech product to WCAG 2.1 AA compliance.', slides: [{ label: 'Accessibility Audit', caption: 'Full WCAG 2.1 audit across 140 screens.' }] },
  { _id: 'ux5', title: 'Fallout Shelter', type: 'Video Game', year: '2023', description: 'UX research and redesign of core vault management loops to reduce player confusion.', slides: [{ label: 'Player Research', caption: '200+ session recordings and surveys.' }] },
  { _id: 'ux6', title: 'Forza Motorsport', type: 'Video Game', year: '2024', description: 'Player journey research and menu flow restructuring for Xbox\'s flagship racing title.', tall: true, slides: [{ label: 'Onboarding Research', caption: '80-player study revealed new player pain points.' }] },
  { _id: 'ux7', title: 'Neurovine', type: 'Health Tech', year: '2025', description: 'End-to-end UX design for a concussion recovery platform.', slides: [{ label: 'Patient Research', caption: 'In-depth interviews with 30 concussion patients.' }] },
  { _id: 'ux8', title: 'Stealth Mode Startup', type: 'Fintech', year: '2025', description: 'UX strategy and zero-to-one product design for a pre-launch fintech venture. NDA protected.', slides: [{ label: 'Zero-to-One Strategy', caption: 'Full UX strategy from blank canvas.' }] },
  { _id: 'ux9', title: 'Souper Showdown', type: 'Experience Design', year: '2026', description: 'UX design and service blueprint for a competitive soup-tasting event platform.', slides: [{ label: 'Event Platform', caption: 'End-to-end UX for a competitive soup-tasting event.' }] },
]

const FALLBACK_ABOUT = {
  bio: 'While every design decision I make starts with the user, I believe the most impactful systems are the ones that carry a distinct personality; ones that feel intuitive to navigate and enjoyable to spend time in.',
  bio2: 'Based in Montreal, available worldwide.',
  availability: 'Available for Projects — 2026',
  skills: [
    { name: 'Interface Design', years: '10 yrs' },
    { name: 'Design Systems', years: '5 yrs' },
    { name: 'User Research', years: '5 yrs' },
    { name: 'Prototyping', years: '10 yrs' },
    { name: 'Motion Design', years: '3 yrs' },
    { name: 'Accessibility', years: '4 yrs' },
  ]
}

const gradients = [
  'rgba(120,80,255,0.08)',
  'rgba(255,80,80,0.08)',
  'rgba(80,200,120,0.08)',
  'rgba(80,160,255,0.08)',
  'rgba(255,160,80,0.08)',
  'rgba(80,200,200,0.08)',
  'rgba(200,80,160,0.08)',
]

function ProjectCard({ project, index, onClick }) {
  const bg = project.thumbnailUrl || null
  const gradient = gradients[index % gradients.length]
  const [staticRevealed, setStaticRevealed] = useState(false)

  const handleClick = () => {
    if (project.isStatic) {
      setStaticRevealed(true)
      setTimeout(() => setStaticRevealed(false), 2800)
      return
    }
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener noreferrer')
    } else {
      onClick(project)
    }
  }

  return (
    <div
      className={`pcard r ${project.tall ? 'tall' : ''} ${staticRevealed ? 'pcard-static-revealed' : ''}`}
      onClick={handleClick}
      style={project.isStatic ? { cursor: 'pointer' } : {}}
    >
      <div className="pcard-img">
        <div className="pcard-img-inner">
          {bg
            ? <img src={bg} alt={project.title} />
            : <div className="pcard-img-placeholder" style={{ background: gradient }}>[ Preview ]</div>
          }
        </div>
        {project.externalUrl && (
          <div className="pcard-external-badge">↗</div>
        )}
        {project.isStatic && (
          <div className={`pcard-static-overlay ${staticRevealed ? 'visible' : ''}`}>
            <div className="pcard-static-inner">
              <span className="pcard-static-label">Work Available</span>
              <span className="pcard-static-sub">upon request</span>
            </div>
          </div>
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className="pcard-type">{project.type}</span>
          <span className="pcard-year">{project.year}</span>
        </div>
        <h3 className="pcard-name">{project.title}</h3>
        <p className="pcard-desc">{project.description}</p>
      </div>
    </div>
  )
}

export default function Home({ uiProjects, uxProjects, about }) {
  const [isUX, setIsUX] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const toggledRef = useRef(false)

  const handleToggle = () => {
    toggledRef.current = true
    if (window._toggling) return
    window._toggling = true

    const uiSet = document.querySelector('.ui-set')
    const uxSet = document.querySelector('.ux-set')
    const cardsWrap = document.querySelector('.cards-wrap')
    const currentSet = isUX ? uxSet : uiSet
    const nextSet = isUX ? uiSet : uxSet
    const currentCards = currentSet.querySelectorAll('.pcard')

    // Lock current height to prevent jump
    if (cardsWrap) {
      cardsWrap.style.height = cardsWrap.offsetHeight + 'px'
      cardsWrap.style.transition = 'height 0.6s cubic-bezier(0.76,0,0.24,1)'
      cardsWrap.style.overflow = 'hidden'
    }

    // Stagger exit
    currentCards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.05}s`
      card.classList.remove('card-enter')
      card.classList.add('card-exit')
    })

    const totalExit = (currentCards.length - 1) * 50 + 450

    setTimeout(() => {
      // Hide current, show next
      currentSet.classList.add('hidden')
      nextSet.classList.remove('hidden')

      // Switch mode
      setIsUX(v => !v)

      // Animate to new height
      if (cardsWrap) {
        const newHeight = nextSet.offsetHeight
        cardsWrap.style.height = newHeight + 'px'
      }

      // Stagger enter
      setTimeout(() => {
        const nextCards = nextSet.querySelectorAll('.pcard')
        nextCards.forEach((card, i) => {
          card.classList.remove('card-exit')
          card.style.animationDelay = `${i * 0.06}s`
          card.classList.add('card-enter')
          card.addEventListener('animationend', () => {
            card.classList.remove('card-enter')
            card.style.animationDelay = ''
          }, { once: true })
        })

        // Release height lock after animation
        setTimeout(() => {
          if (cardsWrap) {
            cardsWrap.style.height = ''
            cardsWrap.style.transition = ''
            cardsWrap.style.overflow = ''
          }
          window._toggling = false
        }, nextCards.length * 60 + 500)
      }, 50)
    }, totalExit)
  }

  // Apply body class for CSS toggle
  useEffect(() => {
    document.body.classList.toggle('ux-mode', isUX)
  }, [isUX])

  // "Featured Projects" letter cascade + counter
  useEffect(() => {
    const titleEl = document.getElementById('selectedWorkTitle')
    if (!titleEl) return
    const text = 'Featured Projects'
    titleEl.innerHTML = text.split('').map((ch, i) =>
      ch === ' '
        ? '<span class="tl-space"> </span>'
        : `<span class="tl" style="transition-delay:${i * 0.04}s">${ch}</span>`
    ).join('')

    function animateCount(target, duration) {
      const el = document.getElementById('projectCount')
      if (!el) return
      const start = performance.now()
      function step(now) {
        const p = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        el.textContent = String(Math.round(target * ease)).padStart(2, '0')
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    let hasAnimated = false
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !hasAnimated) {
          hasAnimated = true
          titleEl.querySelectorAll('.tl').forEach(l => l.classList.add('in'))
          animateCount(isUX ? ux.length : ui.length, 1200)
        }
      })
    }, { threshold: 0.3 })

    const header = document.getElementById('projectsHeader')
    if (header) obs.observe(header)
    return () => obs.disconnect()
  }, [])

  // Recount on toggle
  useEffect(() => {
    const el = document.getElementById('projectCount')
    if (!el) return
    const target = isUX ? ux.length : ui.length
    const start = performance.now()
    function step(now) {
      const p = Math.min((now - start) / 800, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      el.textContent = String(Math.round(target * ease)).padStart(2, '0')
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isUX])

  // Scrolled nav + per-word parallax
  useEffect(() => {
    const nav = document.querySelector('nav')

    // Position nav directly below banner
    const positionNav = () => {
      const banner = document.getElementById('disclaimerBanner')
      if (banner && !banner.classList.contains('dismissed')) {
        nav.style.top = banner.offsetHeight + 'px'
      }
    }
    positionNav()
    window.addEventListener('resize', positionNav)

    const wordRates = {
      'hw-1': 0.35,
      'hw-2': 0.55,
      'hw-3': 0.20,
      'hw-4': 0.45,
      'hw-5': 0.15,
    }

    // Wait for entrance animations to finish before parallax takes over
    const lastDelay = 2300 + 900
    const timer = setTimeout(() => {
      document.querySelectorAll('.hw').forEach(word => {
        word.style.animation = 'none'
        word.style.opacity = word.classList.contains('outline-word') ? '0.3' : '1'
        word.style.transform = 'translateY(0px)'
      })
    }, lastDelay)

    const handler = () => {
      const scrollY = window.scrollY
      nav.classList.toggle('scrolled', scrollY > 60)
      Object.entries(wordRates).forEach(([cls, rate]) => {
        const el = document.querySelector(`.${cls}`)
        if (el) el.style.transform = `translateY(${scrollY * -rate}px)`
      })

      // About section parallax
      const aboutInner = document.getElementById('aboutInner')
      if (aboutInner) {
        const rect = aboutInner.getBoundingClientRect()
        const offset = (window.innerHeight - rect.top) * 0.06
        aboutInner.style.transform = `translateY(${Math.min(offset * -1, 0) + 30}px)`
      }
    }

    // Skill items float observer
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.skill-item.si').forEach((item, i) => {
            setTimeout(() => item.classList.add('si-in'), i * 180)
          })
          skillObs.disconnect()
        }
      })
    }, { threshold: 0.2 })
    const skillEl = document.getElementById('skillItems')
    if (skillEl) skillObs.observe(skillEl)

    // Ping toggle after 10s if not interacted with
    const pingTimer = setTimeout(() => {
      if (!toggledRef.current) {
        const ring = document.getElementById('togglePingRing')
        if (ring) {
          ring.classList.add('ping')
          setTimeout(() => ring.classList.remove('ping'), 2700)
        }
      }
    }, 10000)

    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', positionNav)
      clearTimeout(timer)
      clearTimeout(pingTimer)
      skillObs.disconnect()
    }
  }, [])

  // Custom cursor
  useEffect(() => {
    const cursor = document.getElementById('customCursor')
    const dot = cursor?.querySelector('.cursor-dot')
    const ring = cursor?.querySelector('.cursor-ring')
    const triangle = document.getElementById('cursorTriangle')
    const flyDot = document.getElementById('cursorDotFly')
    if (!cursor || !dot || !ring || !flyDot) return

    let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0
    let prevMouseX = 0
    let isFreakout = false
    let dotInFlight = false
    let triangleHidden = true  // hidden until 30s timer fires
    let shakeCount = 0
    const MAX_SHAKES = 5
    const SCROLL_TRIANGLE_DELAY = 30000
    let shakeHintCount = 0
    let orbitAngle = 0
    let lastX = 0, dirChanges = 0, lastDir = 0, lastDirTime = 0
    const SHAKE_THRESHOLD = 6, SHAKE_WINDOW = 750, SHAKES_NEEDED = 6

    // Show scroll triangle after 30s unless shaken 5+ times before then
    if (triangle) triangle.style.opacity = '0'
    setTimeout(() => {
      if (shakeCount < MAX_SHAKES) {
        triangleHidden = false
        if (triangle) triangle.style.opacity = ''
      }
    }, SCROLL_TRIANGLE_DELAY)

    // Orbiting triangle — orbits around center dot, visible even during freakout
    const animateTriangle = () => {
      if (!triangle || triangleHidden) {
        requestAnimationFrame(animateTriangle)
        return
      }
      const scrollEl = document.getElementById('heroScroll')
      if (scrollEl) {
        const sr = scrollEl.getBoundingClientRect()
        const targetX = sr.left + sr.width / 2
        const targetY = sr.top + sr.height / 2
        const angle = Math.atan2(targetY - mouseY, targetX - mouseX)
        const r = 16
        const tx = Math.cos(angle) * r
        const ty = Math.sin(angle) * r
        const deg = angle * (180 / Math.PI) + 90
        triangle.style.left = `calc(50% + ${tx}px)`
        triangle.style.top = `calc(50% + ${ty}px)`
        triangle.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`
      }
      requestAnimationFrame(animateTriangle)
    }
    animateTriangle()

    // Shake hint on scroll widget hover
    const scrollEl = document.getElementById('heroScroll')
    const shakeHint = document.getElementById('shakeHint')
    let footerTriangle = null
    let footerTriangleActive = false
    let footerTriangleTimer = null

    const spawnFooterTriangle = () => {
      if (footerTriangle || footerTriangleActive) return
      footerTriangleActive = true
      const tri = document.createElement('div')
      tri.className = 'cursor-triangle cursor-triangle-footer'
      tri.id = 'cursorTriangleFooter'
      cursor.appendChild(tri)
      footerTriangle = tri
    }

    const removeFooterTriangle = () => {
      if (footerTriangle) {
        footerTriangle.remove()
        footerTriangle = null
      }
      footerTriangleActive = false
    }

    // Animate footer triangle — runs in parallel with main triangle loop
    const animateFooterTriangle = () => {
      if (!footerTriangle) {
        return
      }
      const footerLogo = document.getElementById('footerLogo')
      if (footerLogo) {
        const fr = footerLogo.getBoundingClientRect()
        const targetX = fr.left + fr.width / 2
        const targetY = fr.top + fr.height / 2
        const angle = Math.atan2(targetY - mouseY, targetX - mouseX)
        const r = 16
        const tx = Math.cos(angle) * r
        const ty = Math.sin(angle) * r
        const deg = angle * (180 / Math.PI) + 90
        footerTriangle.style.left = `calc(50% + ${tx}px)`
        footerTriangle.style.top = `calc(50% + ${ty}px)`
        footerTriangle.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`
      }
      requestAnimationFrame(animateFooterTriangle)
    }

    let footerTriangleScheduled = false

    const showShakeHint = () => {
      if (!shakeHint || shakeCount >= MAX_SHAKES) return
      shakeHintCount++
      const chars = shakeHint.querySelectorAll('.shake-hint-char')
      chars.forEach((ch, i) => {
        setTimeout(() => ch.classList.add('char-show'), i * 40)
      })
      // Spawn footer triangle after 30s — only schedule once ever
      if (!footerTriangleScheduled && !footerTriangleActive) {
        footerTriangleScheduled = true
        footerTriangleTimer = setTimeout(() => {
          spawnFooterTriangle()
          animateFooterTriangle()
        }, 30000)
      }
    }
    const hideShakeHint = () => {
      if (!shakeHint) return
      const chars = shakeHint.querySelectorAll('.shake-hint-char')
      const total = chars.length
      chars.forEach((ch, i) => {
        setTimeout(() => ch.classList.remove('char-show'), (total - 1 - i) * 30)
      })
      // Do NOT clear footerTriangleTimer — let it fire regardless of hover state
    }

    // Footer logo hover — glow and remove triangle
    const footerLogoEl = document.getElementById('footerLogo')
    if (footerLogoEl) {
      footerLogoEl.addEventListener('mouseenter', () => {
        footerLogoEl.classList.add('footer-logo-glow')
        if (footerTriangle) removeFooterTriangle()
      })
      footerLogoEl.addEventListener('mouseleave', () => {
        footerLogoEl.classList.remove('footer-logo-glow')
      })
    }

    if (scrollEl) {
      scrollEl.addEventListener('mouseenter', showShakeHint)
      scrollEl.addEventListener('mouseleave', hideShakeHint)
    }

    const move = e => {
      prevMouseX = mouseX
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'

      const dx = e.clientX - lastX
      if (Math.abs(dx) > SHAKE_THRESHOLD) {
        const dir = dx > 0 ? 1 : -1
        const now = Date.now()
        if (dir !== lastDir) {
          if (now - lastDirTime > SHAKE_WINDOW) dirChanges = 0
          dirChanges++
          lastDirTime = now
          lastDir = dir
          if (dirChanges >= SHAKES_NEEDED) {
            dirChanges = 0
            toggleFreakout()
          }
        }
      }
      lastX = e.clientX
    }

    function spawnFlyDot() {
      const vx = (Math.random() - 0.5) * 10
      const vy = -10 - Math.random() * 6
      const vxVariance = (Math.random() - 0.5) * 2
      let px = mouseX, py = mouseY
      let velX = vx, velY = vy
      const gravity = 0.45 + (Math.random() - 0.5) * 0.1

      dotInFlight = true

      flyDot.style.left = px + 'px'
      flyDot.style.top = py + 'px'
      flyDot.style.opacity = '1'
      flyDot.style.transform = 'translate(-50%, -50%) scale(1)'
      flyDot.style.transition = 'none'

      const period = document.getElementById('aboutPeriod')

      let flyRaf
      let sucked = false
      const fly = () => {
        if (sucked) return
        velY += gravity
        velX += vxVariance * 0.05
        px += velX
        py += velY

        flyDot.style.left = px + 'px'
        flyDot.style.top = py + 'px'

        // Check proximity to period
        if (period && !blackHoleDisabled) {
          const pr = period.getBoundingClientRect()
          const periodCX = pr.left + pr.width / 2
          const periodCY = pr.top + pr.height / 2
          const dist = Math.hypot(px - periodCX, py - periodCY)
          if (dist < 322 && py > periodCY - 430) {
            sucked = true
            dotInFlight = false
            cancelAnimationFrame(flyRaf)
            suckIntoPeriod(px, py, periodCX, periodCY)
            return
          }
        }

        if (py > window.innerHeight + 10 || py < -10 || px < -10 || px > window.innerWidth + 10) {
          flyDot.style.opacity = '0'
          dotInFlight = false
          cancelAnimationFrame(flyRaf)
          return
        }
        flyRaf = requestAnimationFrame(fly)
      }
      flyRaf = requestAnimationFrame(fly)
    }

    function suckIntoPeriod(fromX, fromY, toX, toY) {
      let t = 0
      const duration = 18 // frames
      const startX = fromX, startY = fromY
      const suckRaf = () => {
        t++
        const p = t / duration
        const ease = p * p
        const cx = startX + (toX - startX) * ease
        const cy = startY + (toY - startY) * ease
        flyDot.style.left = cx + 'px'
        flyDot.style.top = cy + 'px'
        flyDot.style.transform = `translate(-50%, -50%)`
        if (t < duration) {
          requestAnimationFrame(suckRaf)
        } else {
          flyDot.style.opacity = '0'
          triggerPeriodPulse()
          activateNextSkillCard()
        }
      }
      requestAnimationFrame(suckRaf)
    }

    function triggerPeriodPulse() {
      const period = document.getElementById('aboutPeriod')
      if (!period) return
      period.classList.remove('period-pulse')
      void period.offsetWidth
      period.classList.add('period-pulse')
      setTimeout(() => period.classList.remove('period-pulse'), 600)
    }

    let activatedCards = 0
    let dotsFed = 0
    let blackHoleDisabled = false

    function activateNextSkillCard() {
      const cards = Array.from(document.querySelectorAll('.skill-item.si'))
      const totalCards = cards.length
      dotsFed++

      // Dot 1 → 1 card, Dot 2 → 2 cards, Dot 3 → 3 cards
      const batchSize = Math.min(dotsFed, 3)

      for (let i = 0; i < batchSize; i++) {
        const targetIndex = totalCards - 1 - activatedCards
        if (targetIndex >= 0) {
          const delay = i * 160
          setTimeout(() => {
            cards[targetIndex - i < 0 ? 0 : targetIndex - i]?.classList.add('skill-powered')
          }, delay)
          activatedCards++
        }
      }

      if (activatedCards >= totalCards) {
        blackHoleDisabled = true
        setTimeout(() => showApproachHeading(), batchSize * 160 + 100)
      }
    }

    function showApproachHeading() {
      const navMenu = document.getElementById('navMenu')
      const approach = document.getElementById('navApproach')
      if (navMenu) navMenu.classList.add('approach-active')
      if (approach) approach.classList.add('approach-visible')

      // Ping after 5s if not clicked
      setTimeout(() => {
        if (approach && !approach.classList.contains('approach-clicked')) {
          approach.classList.add('approach-ping')

          // Spawn ripple centered on the My Approach item
          const nav = document.querySelector('nav')
          if (nav && approach) {
            const navRect = nav.getBoundingClientRect()
            const approachRect = approach.getBoundingClientRect()
            const rippleX = ((approachRect.left + approachRect.width / 2 - navRect.left) / navRect.width * 100) + '%'
            const ripple = document.createElement('div')
            ripple.className = 'nav-ripple'
            ripple.style.setProperty('--ripple-x', rippleX)
            nav.appendChild(ripple)
            setTimeout(() => ripple.remove(), 1800)
          }

          setTimeout(() => approach.classList.remove('approach-ping'), 3600)
        }
      }, 5000)
    }

    function toggleFreakout() {
      if (!isFreakout) {
        // Circle → Square: spawn dot
        isFreakout = true
        shakeCount++
        // Hide shake hint text once max reached
        if (shakeCount >= MAX_SHAKES) {
          const shakeHint = document.getElementById('shakeHint')
          if (shakeHint) shakeHint.style.display = 'none'
        }
        cursor.classList.add('freakout')
        spawnFlyDot()
      } else {
        // Square → Circle: only if dot has landed
        if (dotInFlight) return
        isFreakout = false
        cursor.classList.remove('freakout')
        cursor.classList.add('recovering')
        setTimeout(() => cursor.classList.remove('recovering'), 400)
      }
    }

    let rafId
    const animateDot = () => {
      dotX += (mouseX - dotX) * 0.18
      dotY += (mouseY - dotY) * 0.18
      if (!isFreakout) {
        const ox = dotX - mouseX, oy = dotY - mouseY
        dot.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`
      }
      rafId = requestAnimationFrame(animateDot)
    }
    rafId = requestAnimationFrame(animateDot)

    const hover = () => cursor.classList.add('hovering')
    const unhover = () => cursor.classList.remove('hovering')
    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, .pcard, .toggle-wrap').forEach(el => {
      el.addEventListener('mouseenter', hover)
      el.addEventListener('mouseleave', unhover)
    })
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Approach sequence
  // Mobile: tap "form." to activate skill cards
  const handleMobileCardTap = (card) => {
    if (window.innerWidth > 900) return
    if (card.classList.contains('skill-powered')) return

    // Light up this card
    card.classList.add('skill-powered')

    // Period ripple
    const period = document.getElementById('aboutPeriod')
    if (period) {
      period.classList.remove('period-pulse')
      void period.offsetWidth
      period.classList.add('period-pulse')
      setTimeout(() => period.classList.remove('period-pulse'), 700)
    }

    // Check if all cards are now powered
    const cards = Array.from(document.querySelectorAll('.skill-item.si'))
    const allPowered = cards.every(c => c.classList.contains('skill-powered'))

    if (allPowered) {
      // Show My Approach in nav then auto-trigger sequence
      const navMenu = document.getElementById('navMenu')
      const approach = document.getElementById('navApproach')
      if (navMenu) navMenu.classList.add('approach-active')
      if (approach) approach.classList.add('approach-visible')
      // Small delay so user sees nav appear, then trigger
      setTimeout(() => {
        triggerApproachSequence()
      }, 800)
    }
  }

  const triggerApproachSequence = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Hide widget and update description immediately
    const heroTag = document.getElementById('heroTag')
    if (heroTag) heroTag.style.display = 'none'

    const heroDesc = document.getElementById('heroDesc')
    if (heroDesc) heroDesc.textContent = 'While making the design of a system user-centric is my highest priority, the aspect I enjoy most about design is infusing personality into it. A great system is one that feels natural to use and leaves the user enjoying their experience.'

    const swapWord = (id, newText, delay) => {
      setTimeout(() => {
        const el = document.getElementById(id)
        if (!el) return
        el.style.transition = 'none'
        el.textContent = newText
      }, 1500 + delay)
    }

    swapWord('hw-organic', 'Design', 0)
    swapWord('hw-solutions', 'should', 500)
    swapWord('hw-through', 'feel', 1000)

    // "digital interfaces." → "fun." — each on own line
    setTimeout(() => {
      const digital = document.getElementById('hw-digital')
      const interfaces = document.getElementById('hw-interfaces')
      if (digital && interfaces) {
        digital.style.transition = 'none'
        interfaces.style.transition = 'none'
        digital.textContent = 'fun'
        digital.classList.remove('outline-word')
        interfaces.textContent = ''
        // hide empty line-outline wrapper
        if (interfaces.parentElement) interfaces.parentElement.style.display = 'none'
      }
      startRacingBackground()

      // White flash on mobile
      if (window.innerWidth <= 900) {
        const flash = document.getElementById('approachFlash')
        if (flash) {
          flash.classList.remove('flash-in')
          void flash.offsetWidth
          flash.classList.add('flash-in')
          setTimeout(() => flash.classList.remove('flash-in'), 800)
        }
      }

      // Update hero description text
      const desc = document.getElementById('heroDesc')
      if (desc) {
        desc.style.transition = 'none'
        desc.innerHTML = 'What excites me most about design is something that often gets overlooked: the character of an interface. Whether you\'re building a banking app or a AAA title, there\'s almost always room to make the experience feel impactful. You don\'t need to sacrifice professionalism or accessibility to make the experience enjoyable.<br><br>This philosophy guides all of my work. Using motion that makes interactions feel tactile and alive. Moments of surprise. Humans are messy and funny and imperfect, and I think the best systems reflect a little of that back. From ideation to execution, the goal is about the feeling a user walks away with. Not just "this works", but "I actually liked using that."'
      }

      // Hide scroll widget on mobile so text centers
      if (window.innerWidth <= 900) {
        const heroScroll = document.querySelector('.hero-scroll')
        if (heroScroll) heroScroll.style.display = 'none'
      }
    }, 1500 + 1750)
  }

  const startRacingBackground = () => {
    const existing = document.getElementById('racingCanvas')
    if (existing) return
    const canvas = document.createElement('canvas')
    canvas.id = 'racingCanvas'
    canvas.style.cssText = `position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: 0; transition: opacity 0.15s ease;`
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    // scroll progress 0 = top (B), 1 = bottom (C)
    let scrollT = 0
    const updateScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      scrollT = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }
    window.addEventListener('scroll', updateScroll, { passive: true })

    // Shared colors
    const bColors = ['#00ffaa','#00ccff','#aaff00','#ffcc00','#ff6600']
    const cColors = ['#ff3cac','#784ba0','#2b86c5','#ff6b35','#00f5d4']

    // Option B — streaks
    class Streak {
      constructor() { this.reset(true) }
      reset(init = false) {
        this.x = init ? Math.random() * canvas.width : -600
        this.y = Math.random() * canvas.height
        this.len = 180 + Math.random() * 400   // much longer
        this.speed = 5 + Math.random() * 14
        this.width = 1.5 + Math.random() * 3.5  // thicker
        this.color = bColors[Math.floor(Math.random() * bColors.length)]
        this.opacity = 0.7 + Math.random() * 0.3  // brighter
        this.vy = (Math.random() - 0.5) * 1.2
      }
      draw(alpha) {
        if (alpha <= 0) return
        this.x += this.speed
        this.y += this.vy
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
        if (this.x > canvas.width + this.len) this.reset()
        // Long smearing tail — color holds bright for most of the length, fades only at the very end
        const g = ctx.createLinearGradient(this.x - this.len, this.y, this.x, this.y)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.15, this.color + Math.round(this.opacity * alpha * 0.3 * 255).toString(16).padStart(2,'0'))
        g.addColorStop(0.5, this.color + Math.round(this.opacity * alpha * 255).toString(16).padStart(2,'0'))
        g.addColorStop(0.85, this.color + Math.round(this.opacity * alpha * 255).toString(16).padStart(2,'0'))
        g.addColorStop(1, 'transparent')
        ctx.save()
        ctx.shadowBlur = 22; ctx.shadowColor = this.color
        ctx.strokeStyle = g; ctx.lineWidth = this.width
        ctx.beginPath(); ctx.moveTo(this.x - this.len, this.y); ctx.lineTo(this.x, this.y); ctx.stroke()
        // Second thinner core for glow intensity
        ctx.lineWidth = this.width * 0.4
        ctx.globalAlpha = alpha * 0.6
        ctx.strokeStyle = '#ffffff'
        ctx.beginPath(); ctx.moveTo(this.x - this.len * 0.4, this.y); ctx.lineTo(this.x, this.y); ctx.stroke()
        ctx.restore()
      }
    }

    // Option C — blobs + streaks
    class Blob {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.r = 50 + Math.random() * 90
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        this.color = cColors[Math.floor(Math.random() * cColors.length)]
        this.phase = Math.random() * Math.PI * 2
      }
      draw(alpha) {
        if (alpha <= 0) return
        this.phase += 0.018
        this.x += this.vx + Math.sin(this.phase) * 0.5
        this.y += this.vy + Math.cos(this.phase) * 0.4
        if (this.x < -this.r || this.x > canvas.width + this.r) this.vx *= -1
        if (this.y < -this.r || this.y > canvas.height + this.r) this.vy *= -1
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
        g.addColorStop(0, this.color + 'bb')
        g.addColorStop(0.4, this.color + '44')
        g.addColorStop(1, 'transparent')
        ctx.save()
        ctx.globalAlpha = 0.5 * alpha
        ctx.shadowBlur = 40; ctx.shadowColor = this.color
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
    }

    class DriftStreak {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 7
        this.vy = (Math.random() - 0.5) * 3
        this.len = 20 + Math.random() * 70
        this.color = cColors[Math.floor(Math.random() * cColors.length)]
        this.alpha = 0.3 + Math.random() * 0.5
        this.w = 0.5 + Math.random() * 1.5
      }
      draw(alpha) {
        if (alpha <= 0) return
        this.x += this.vx; this.y += this.vy
        if (this.x < -100 || this.x > canvas.width + 100) this.vx *= -1
        if (this.y < -40 || this.y > canvas.height + 40) this.vy *= -1
        const ang = Math.atan2(this.vy, this.vx)
        ctx.save()
        ctx.shadowBlur = 10; ctx.shadowColor = this.color
        ctx.strokeStyle = this.color; ctx.lineWidth = this.w
        ctx.globalAlpha = this.alpha * alpha
        ctx.beginPath()
        ctx.moveTo(this.x - Math.cos(ang) * this.len, this.y - Math.sin(ang) * this.len)
        ctx.lineTo(this.x, this.y); ctx.stroke()
        ctx.restore()
      }
    }

    const streaks = Array.from({ length: 20 }, () => new Streak())
    const blobs = Array.from({ length: 8 }, () => new Blob())
    const driftStreaks = Array.from({ length: 25 }, () => new DriftStreak())

    // Burst state — speed multiplier that decays after activation
    let burstMult = 4.0
    let burstDecay = 0.97 // multiplied each frame until ~1.0
    const BASE_MULT = 1.0

    const animate = () => {
      const t = scrollT

      // Decay burst
      if (burstMult > BASE_MULT) {
        burstMult = Math.max(BASE_MULT, burstMult * burstDecay)
      }

      // Clear properly — no more ghost trails
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dark bg overlay — solid, not semi-transparent
      ctx.fillStyle = t < 0.5 ? '#000a04' : '#08000a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // B elements fade out as we scroll — apply burst to speed
      streaks.forEach(s => {
        const origSpeed = s.speed
        s.speed *= burstMult
        s.draw(1 - t)
        s.speed = origSpeed
      })

      // C elements fade in as we scroll — apply burst to velocity
      blobs.forEach(b => {
        const ox = b.vx, oy = b.vy
        b.vx *= burstMult; b.vy *= burstMult
        b.draw(t)
        b.vx = ox; b.vy = oy
      })
      driftStreaks.forEach(d => {
        const ox = d.vx, oy = d.vy
        d.vx *= burstMult; d.vy *= burstMult
        d.draw(t)
        d.vx = ox; d.vy = oy
      })

      requestAnimationFrame(animate)
    }
    animate()

    requestAnimationFrame(() => { canvas.style.opacity = '1' })
    document.body.style.transition = 'none'
    document.body.style.background = '#000a04'
    document.body.classList.add('approach-active')
    document.querySelectorAll('.orb').forEach(o => {
      o.style.transition = 'none'
      o.style.opacity = '0'
    })

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap'
    document.head.appendChild(link)

    const heroWords = ['hw-organic', 'hw-solutions', 'hw-through', 'hw-digital']
    link.onload = () => {
      heroWords.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return
        el.style.fontFamily = "'Space Grotesk', sans-serif"
        el.style.fontWeight = '700'
        el.style.letterSpacing = '-0.01em'
        el.style.textTransform = 'uppercase'
      })
    }
  }

  // Footer logo cascade — desktop only
  useEffect(() => {
    if (window.innerWidth <= 900) return
    const logo = document.getElementById('footerLogo')
    if (!logo) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          logo.querySelectorAll('.footer-logo-char').forEach(ch => ch.classList.add('char-in'))
          obs.disconnect()
        }
      })
    }, { threshold: 0.8 })
    obs.observe(logo)
    return () => obs.disconnect()
  }, [])

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.r')
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('v'), i * 70)
      })
    }, { threshold: 0.08 })
    els.forEach(r => obs.observe(r))
    return () => obs.disconnect()
  }, [isUX])

  const ui = uiProjects?.length ? uiProjects : FALLBACK_UI
  const ux = uxProjects?.length ? uxProjects : FALLBACK_UX
  const bio = about || FALLBACK_ABOUT

  return (
    <>
      <Head>
        <title>Quinn — UI/UX Designer</title>
        <meta name="description" content="Quinn — UI/UX Designer based in Montreal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="custom-cursor" id="customCursor">
        <div className="cursor-ring" />
        <div className="cursor-dot" />
        <div className="cursor-triangle" id="cursorTriangle" />
      </div>
      <div className="cursor-dot-fly" id="cursorDotFly" />
      <div className="approach-flash" id="approachFlash" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* DISCLAIMER BANNER */}
      <div className="disclaimer-banner" id="disclaimerBanner">
        <p className="disclaimer-text">A selection of my recent work is shown here. Proprietary projects from confidential engagements are available to view upon request.</p>
        <a href="mailto:hi@quxnn.com" className="disclaimer-btn">Connect</a>
        <button className="disclaimer-close" onClick={() => {
          const banner = document.getElementById('disclaimerBanner')
          const nav = document.querySelector('nav')
          const hero = document.querySelector('.hero')
          banner.classList.add('dismissed')
          nav.style.transition = 'top 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease'
          nav.style.top = '0px'
          if (hero) {
            hero.style.transition = 'padding 0.4s ease'
            hero.style.paddingTop = window.innerWidth < 900 ? '72px' : '140px'
          }
        }}>✕</button>
      </div>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <span className="logo-name">
            <span className="logo-letter q" style={{ transitionDelay: '0s' }}>Q</span>
            <span className="logo-letter accent" style={{ transitionDelay: '0.05s' }}>U</span>
            <span className="logo-letter-i accent" style={{ transitionDelay: '0.1s' }}>
              <span className={`ll-i${isUX ? ' ll-hidden' : ''}`}>I</span>
              <span className={`ll-x${isUX ? ' ll-visible' : ''}`}>X</span>
            </span>
            <span className="logo-letter nn" style={{ transitionDelay: '0.15s' }}>N</span>
            <span className="logo-letter nn" style={{ transitionDelay: '0.2s' }}>N</span>
          </span>
        </a>
        <ul className="nav-menu" id="navMenu">
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="mailto:hi@quxnn.com">Contact</a></li>
          <li className="nav-approach" id="navApproach"><a href="#" onClick={e => {
            e.preventDefault()
            document.getElementById('navApproach')?.classList.add('approach-clicked')
            triggerApproachSequence()
          }}>My Approach</a></li>
        </ul>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <div className="toggle-ping-ring" id="togglePingRing" />
          <div className={`toggle-wrap ${isUX ? 'ux-active' : ''}`} id="toggleWrap" onClick={handleToggle}>
            <span className={`t-opt ${!isUX ? 'active' : ''}`}>UI</span>
            <span className={`t-opt ${isUX ? 'active' : ''}`}>UX</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="heroSection">
        <div className="hero-tag" id="heroTag">
          <div className="hero-tag-dot" />
          <span className="hero-tag-text">{bio.availability || 'Available for Projects — 2026'}</span>
        </div>
        <h1 className="hero-title">
          <span className="hw hw-1" id="hw-organic" style={{display:'block'}}>Organic</span>
          <span className="hw hw-4" id="hw-solutions" style={{display:'block'}}>solutions</span>
          <span className="hw hw-5" id="hw-through" style={{display:'block'}}><span className="line-em">through</span></span>
          <span className="hero-inline-row" id="hw-last-row">
            <span className="line-outline"><span className="hw hw-3 outline-word" id="hw-digital">digital</span></span>
            <span className="line-outline"><span className="hw hw-2 outline-word" id="hw-interfaces">interfaces.</span></span>
          </span>
        </h1>
        <div className="hero-row" id="heroRow">
          <p className="hero-desc" id="heroDesc">
            Quinn is a UI/UX designer crafting digital experiences that feel effortless to use and beautiful to inhabit. Based in {bio.location || 'Montreal'}.
          </p>
          <div className="hero-scroll" id="heroScroll">
            <div className="hero-scroll-line" />
            <span>Scroll</span>
            <div className="shake-hint" id="shakeHint">
              {'Shake it off'.split('').map((ch, i) => (
                <span key={i} className="shake-hint-char" data-idx={i}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects-section" id="work">
        <div className="projects-header r" id="projectsHeader">
          <h2 className="projects-title" id="selectedWorkTitle"></h2>
          <div className="mode-indicator" id="modeIndicator">
            {isUX ? 'UX Design — ' : 'UI Design — '}
            <span id="projectCount">{isUX ? String(ux.length).padStart(2,'0') : String(ui.length).padStart(2,'0')}</span>
            {' Projects'}
          </div>
        </div>

        <div className="cards-wrap">
          <div className="cards-set ui-set">
            {ui.map((p, i) => <ProjectCard key={p._id} project={{...p, tall: i === 0}} index={i} onClick={setActiveProject} />)}
          </div>
          <div className="cards-set ux-set hidden">
            {ux.map((p, i) => <ProjectCard key={p._id} project={{...p, tall: i === 0}} index={i} onClick={setActiveProject} />)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="view-toggle-btn" id="viewToggleBtn" onClick={handleToggle}>
            {isUX ? 'View UI Projects' : 'View UX Projects'}
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-inner r" id="aboutInner">
          <div className="about-left">
            <div className="about-tag">
              <div className="about-tag-line" />
              <span className="about-tag-text">About</span>
            </div>
            <h2 className="about-heading" id="aboutHeading">
              Shaping<br />
              <em>ideas</em> into form<span id="aboutPeriod" className="about-period">.</span>
            </h2>
            <p className="about-text-body">{bio.bio}</p>
            {bio.bio2 && <p className="about-text-body">{bio.bio2}</p>}
            <a href="mailto:hi@quxnn.com" className="contact-link">Start a Conversation</a>
          </div>
          <div className="about-right">
            <h3 className="approach-heading" id="approachHeading">My Approach</h3>
            <div className="skill-items" id="skillItems">
              {(bio.skills || FALLBACK_ABOUT.skills).map((s, i) => (
                <div
                  className="skill-item si"
                  key={i}
                  data-skill-index={i}
                  onClick={e => handleMobileCardTap(e.currentTarget)}
                >
                  <div className="skill-icon" />
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-note">{s.years}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo" id="footerLogo">
          {'Feed the form'.split('').map((ch, i) => (
            <span key={i} className="footer-logo-char" style={{ transitionDelay: `${i * 0.06}s` }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>
        <ul className="footer-nav">
          <li><a href="https://www.linkedin.com/in/quintonrodriques/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="/QuinnRodriques_Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a></li>
          <li><a href="mailto:hi@quxnn.com">hi@quxnn.com</a></li>
        </ul>
      </footer>

      {/* GALLERY */}
      {activeProject && <Gallery project={activeProject} onClose={() => setActiveProject(null)} />}
    </>
  )
}

export async function getStaticProps() {
  try {
    const [uiProjects, uxProjects, about] = await Promise.all([
      getProjects('ui'),
      getProjects('ux'),
      getAbout(),
    ])
    return { props: { uiProjects, uxProjects, about }, revalidate: 60 }
  } catch (e) {
    // Sanity not connected yet — site still works with fallback data
    return { props: { uiProjects: [], uxProjects: [], about: null } }
  }
}
