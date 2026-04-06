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
  bio: 'Quinn is a UX designer with ten years of experience shaping the way people interact with complex systems. From award-winning video games to fintech platforms and health tech products, the through-line has always been the same: making the difficult feel effortless.',
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
  'linear-gradient(135deg,#221D35,#312660)',
  'linear-gradient(135deg,#35201D,#602626)',
  'linear-gradient(135deg,#1D3026,#204D35)',
  'linear-gradient(135deg,#1D2835,#204060)',
  'linear-gradient(135deg,#2D2016,#4D3520)',
  'linear-gradient(135deg,#16222D,#203040)',
  'linear-gradient(135deg,#1A0808,#3D0C0C)',
]

function ProjectCard({ project, index, onClick }) {
  const bg = project.thumbnailUrl || null
  const gradient = gradients[index % gradients.length]

  const handleClick = () => {
    if (project.isStatic) return
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener noreferrer')
    } else {
      onClick(project)
    }
  }

  return (
    <div className={`pcard r ${project.tall ? 'tall' : ''}`} onClick={handleClick} style={project.isStatic ? { cursor: 'default' } : {}}>
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
    const flyDot = document.getElementById('cursorDotFly')
    if (!cursor || !dot || !ring || !flyDot) return

    let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0
    let prevMouseX = 0
    let isFreakout = false
    let lastX = 0, dirChanges = 0, lastDir = 0, lastDirTime = 0
    const SHAKE_THRESHOLD = 6, SHAKE_WINDOW = 750, SHAKES_NEEDED = 6

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
        if (period) {
          const pr = period.getBoundingClientRect()
          const periodCX = pr.left + pr.width / 2
          const periodCY = pr.top + pr.height / 2
          const dist = Math.hypot(px - periodCX, py - periodCY)
          if (dist < 60 && py > periodCY - 80) {
            sucked = true
            cancelAnimationFrame(flyRaf)
            suckIntoPeriod(px, py, periodCX, periodCY)
            return
          }
        }

        if (py > window.innerHeight + 10 || py < -10 || px < -10 || px > window.innerWidth + 10) {
          flyDot.style.opacity = '0'
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
        const scale = 1 - ease * 0.9
        flyDot.style.left = cx + 'px'
        flyDot.style.top = cy + 'px'
        flyDot.style.transform = `translate(-50%, -50%) scale(${scale})`
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
    function activateNextSkillCard() {
      const cards = Array.from(document.querySelectorAll('.skill-item.si'))
      const totalCards = cards.length
      // Activate from bottom up
      const targetIndex = totalCards - 1 - activatedCards
      if (targetIndex >= 0) {
        cards[targetIndex].classList.add('skill-powered')
        activatedCards++
      }
      // All cards activated — show MY APPROACH heading
      if (activatedCards >= totalCards) {
        showApproachHeading()
      }
    }

    function showApproachHeading() {
      const skillItems = document.querySelectorAll('.skill-item.si')
      skillItems.forEach(el => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.76,0,0.24,1), opacity 0.4s ease'
        el.style.transform = 'translateX(-40px)'
        el.style.opacity = '0.3'
      })
      setTimeout(() => {
        const heading = document.getElementById('approachHeading')
        if (heading) heading.classList.add('approach-visible')
      }, 500)
    }

    function toggleFreakout() {
      if (!isFreakout) {
        // Circle → Square: spawn dot
        isFreakout = true
        cursor.classList.add('freakout')
        spawnFlyDot()
      } else {
        // Square → Circle: no dot, just recover
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
      </div>
      <div className="cursor-dot-fly" id="cursorDotFly" />
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
        <ul className="nav-menu">
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="mailto:hi@quxnn.com">Contact</a></li>
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
      <section className="hero">
        <div className="hero-tag">
          <div className="hero-tag-dot" />
          <span className="hero-tag-text">{bio.availability || 'Available for Projects — 2026'}</span>
        </div>
        <h1 className="hero-title">
          <span className="hw hw-1">Organic</span> <span className="hw hw-4">solutions</span><br />
          <span className="line-em"><span className="hw hw-5">through</span></span>
          <span className="hero-inline-row">
            <span className="line-outline"><span className="hw hw-3 outline-word">digital</span></span>
            <span className="line-outline"><span className="hw hw-2 outline-word">interfaces.</span></span>
          </span>
        </h1>
        <div className="hero-row">
          <p className="hero-desc">
            Quinn is a UI/UX designer crafting digital experiences that feel effortless to use and beautiful to inhabit. Based in {bio.location || 'Montreal'}.
          </p>
          <div className="hero-scroll">
            <div className="hero-scroll-line" />
            <span>Scroll</span>
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
                <div className="skill-item si" key={i} data-skill-index={i}>
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
        <div className="footer-logo"></div>
        <ul className="footer-nav">
          <li><a href="https://www.linkedin.com/in/quintonrodriques/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="#">Read.cv</a></li>
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
