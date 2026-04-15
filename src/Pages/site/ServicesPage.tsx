import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { MainLayoutOutletContext } from './mainLayoutContext'
import dentimapVideo from '../../assets/videos/dentimap.mp4'
import polypVideo from '../../assets/videos/polyp.mp4'
import vceEndoVideo from '../../assets/videos/vce-endo.mp4'
import './ServicesPage.css'

const projects = [
  {
    id: 'dentimap',
    badge: 'Dental Panoramic X-Ray',
    title: 'DentiMap',
    description:
      'Dental panoramic X-ray analysis model. Detects and maps teeth, identifies anomalies, and generates structured diagnostic reports for clinical review.',
    videoSrc: dentimapVideo,
    link: '/models/dentimap',
    videoLeft: true,
  },
  {
    id: 'polyp',
    badge: 'Colonoscopy Segmentation',
    title: 'Polyp Detection',
    description:
      'Colonoscopy polyp segmentation model. Delivers real-time polyp detection with pixel-level precision, designed to support colorectal cancer screening.',
    videoSrc: polypVideo,
    link: '/models/polyp',
    videoLeft: false,
  },
  {
    id: 'vce-endo',
    badge: 'GI Tract Analysis',
    title: 'VCE Endoscopy',
    description:
      'Video Capsule Endoscopy AI. Classifies GI tract conditions and automatically flags bleeding, ulcers, and lesions across video frames in real time.',
    videoSrc: vceEndoVideo,
    link: '/models/vce',
    videoLeft: true,
  },
] as const

export default function ServicesPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [loadedVideos, setLoadedVideos] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    projects.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return

      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible')
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('visible')
            setLoadedVideos((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <main className={`services-page${isDark ? '' : ' light'}`}>
      <header className="services-page-header">
        <p className="services-eyebrow">PerceptionIntelligenceLab</p>
        <h1 className="services-main-title">
          AI-Powered Medical Models
        </h1>
      </header>

      <div className="services-projects">
        {projects.map((project) => {
          const videoBlock = (
            <div className="video-section">
              <div className="video-wrapper">
                <video autoPlay={!!loadedVideos[project.id]} muted loop playsInline preload="metadata">
                  {loadedVideos[project.id] && <source src={project.videoSrc} type="video/mp4" />}
                </video>
              </div>
              <div className="video-overlay-gradient" />
            </div>
          )

          const textBlock = (
            <div className="text-section">
              <span className="model-badge">{project.badge}</span>
              <h2 className="project-title">{project.title}</h2>
              <div className="title-underline" />
              <div className="project-description">
                <p>{project.description}</p>
              </div>
              {'external' in project && project.external ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-arrow-link"
                >
                  Try our model&nbsp;
                  <span className="bouncing-arrow">→</span>
                </a>
              ) : (
                <Link to={project.link} className="project-arrow-link">
                  Try our model&nbsp;
                  <span className="bouncing-arrow">→</span>
                </Link>
              )}
            </div>
          )

          return (
            <section
              key={project.id}
              id={project.id}
              ref={(el) => {
                sectionRefs.current[project.id] = el
              }}
              className="split-screen-container"
            >
              {project.videoLeft ? (
                <>
                  {videoBlock}
                  {textBlock}
                </>
              ) : (
                <>
                  {textBlock}
                  {videoBlock}
                </>
              )}
            </section>
          )
        })}
      </div>
    </main>
  )
}
