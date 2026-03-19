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

  return (
    <div className={`pcard r ${project.tall ? 'tall' : ''}`} onClick={() => onClick(project)}>
      <div className="pcard-img">
        <div className="pcard-img-inner">
          {bg
            ? <img src={bg} alt={project.title} />
            : <div className="pcard-img-placeholder" style={{ background: gradient }}>[ Preview ]</div>
          }
        </div>
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

  const handleToggle = () => {
    if (window._toggling) return
    window._toggling = true

    const uiSet = document.querySelector('.ui-set')
    const uxSet = document.querySelector('.ux-set')
    const currentSet = isUX ? uxSet : uiSet
    const nextSet = isUX ? uiSet : uxSet
    const currentCards = currentSet.querySelectorAll('.pcard')

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
        setTimeout(() => { window._toggling = false }, nextCards.length * 60 + 500)
      }, 50)
    }, totalExit)
  }

  // Apply body class for CSS toggle
  useEffect(() => {
    document.body.classList.toggle('ux-mode', isUX)
  }, [isUX])

  // Scrolled nav
  useEffect(() => {
    const nav = document.querySelector('nav')
    const handler = () => nav.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
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

      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="logo-ring"><span>Q</span></div>
          <span className="logo-name">
            <span className="logo-letter" style={{ transitionDelay: '0s' }}>Q</span>
            <span className="logo-letter accent" style={{ transitionDelay: '0.05s' }}>U</span>
            <span className="logo-letter-i accent" style={{ transitionDelay: '0.1s' }}>
              <span className={`ll-i${isUX ? ' ll-hidden' : ''}`}>I</span>
              <span className={`ll-x${isUX ? ' ll-visible' : ''}`}>X</span>
            </span>
            <span className="logo-letter" style={{ transitionDelay: '0.15s' }}>N</span>
            <span className="logo-letter" style={{ transitionDelay: '0.2s' }}>N</span>
          </span>
        </a>
        <ul className="nav-menu">
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="mailto:hello@quinn.design">Contact</a></li>
        </ul>
        <div className="toggle-wrap" onClick={handleToggle}>
          <span className={`t-opt ${!isUX ? 'active' : ''}`}>UI</span>
          <span className={`t-opt ${isUX ? 'active' : ''}`}>UX</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">
          <div className="hero-tag-dot" />
          <span className="hero-tag-text">{bio.availability || 'Available for Projects — 2026'}</span>
        </div>
        <h1 className="hero-title">
          Organic solutions<br />
          <span className="line-em">through</span>
          <span className="hero-inline-row">
            <span className="line-outline">digital</span>
            <span className="line-outline">interfaces.</span>
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
        <div className="projects-header r">
          <h2 className="projects-title">Selected Work</h2>
          <div className="mode-indicator">
            {isUX ? `UX Design — ${ux.length.toString().padStart(2, '0')} Projects` : `UI Design — ${ui.length.toString().padStart(2, '0')} Projects`}
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
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-inner r">
          <div className="about-left">
            <div className="about-tag">
              <div className="about-tag-line" />
              <span className="about-tag-text">About</span>
            </div>
            <h2 className="about-heading">
              Shaping<br />
              <em>ideas</em><br />
              into form.
            </h2>
            <p className="about-text-body">{bio.bio}</p>
            {bio.bio2 && <p className="about-text-body">{bio.bio2}</p>}
            <a href="mailto:hello@quinn.design" className="contact-link">Start a Conversation</a>
          </div>
          <div className="about-right">
            <div className="skill-items">
              {(bio.skills || FALLBACK_ABOUT.skills).map((s, i) => (
                <div className="skill-item" key={i}>
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
        <div className="footer-logo">Quinn</div>
        <ul className="footer-nav">
          <li><a href="#">Dribbble</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">Read.cv</a></li>
          <li><a href="mailto:hello@quinn.design">hello@quinn.design</a></li>
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
