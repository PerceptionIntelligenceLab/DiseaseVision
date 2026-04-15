import React, { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { MainLayoutOutletContext } from './mainLayoutContext'
import debeshImg from '../../assets/DebeshJha.png'
import harshithImg from '../../assets/Harshith.png'
import saiImg from '../../assets/Sai.png'

interface TeamMember {
  name: string
  role: string
  image: string
  description: string
  portfolioLink: string
  objectPosition?: string
  photoScale?: number
}

interface TeamCardProps {
  member: TeamMember
  index: number
  isDark: boolean
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Debesh Jha',
    role: 'Principal Investigator · Assistant Professor (TT), USD',
    image: debeshImg,
    portfolioLink: 'https://debeshjha.com/',
    description:
      'AI Scientist and Assistant Professor (Tenure Track) at the University of South Dakota, leading the Perception Intelligence Lab. Former Senior Research Associate at Northwestern Medicine. Stanford Top 2% Scientist and IEEE Senior Member.',
  },
  {
    name: 'Harshith Reddy Nalla',
    role: 'Undergraduate Research Assistant · AI Research, USD',
    image: harshithImg,
    portfolioLink: 'https://harshithreddy01.github.io/My-Web/',
    photoScale: 0.8,
    description:
      'Computer Science undergraduate at USD, contributing to AI and deep learning research under Dr. Debesh Jha.',
  },
  {
    name: 'Swarna Sai Sankar',
    role: 'Graduate Research Assistant · Full Stack Engineer, USD',
    image: saiImg,
    portfolioLink: 'https://swarna7414.github.io/SwarnaSaiSankar/',
    description:
      'Currently a Graduate Research Assistant at USD, crafting React-based interfaces for AI and ML models. Pursuing an MS in Computer Science at USD.',
  },
]

function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

function TeamCard({ member, index, isDark }: TeamCardProps) {
  const [ref, isVisible] = useInView(0.15)
  const [hovered, setHovered] = useState(false)

  const textPrimary = isDark ? '#f1f5f9' : '#1a1a1a'
  const textSecondary = isDark ? '#94a3b8' : '#999'
  const textBody = isDark ? '#cbd5e1' : '#666'
  const textBodyHover = isDark ? '#e2e8f0' : '#444'
  const dividerColor = isDark ? '#e2e8f0' : '#1a1a1a'
  const shadowHover = isDark
    ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 4px #334155'
    : '0 20px 60px rgba(0,0,0,0.12), 0 0 0 4px #1a1a1a'

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
        transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.2}s`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: '1 1 280px',
        maxWidth: '340px',
        cursor: 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 270,
          height: 270,
          borderRadius: 24,
          overflow: 'hidden',
          marginBottom: 32,
          boxShadow: hovered ? shadowHover : '0 8px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: member.objectPosition ?? 'center top',
            filter: hovered ? 'grayscale(0%)' : 'grayscale(15%)',
            transition: 'filter 0.6s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? 'transparent'
              : 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.08) 100%)',
            transition: 'all 0.5s ease',
          }}
        />
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 26,
          fontWeight: 700,
          color: textPrimary,
          margin: '0 0 6px 0',
          letterSpacing: hovered ? '0.02em' : '-0.02em',
          transition: 'letter-spacing 0.4s ease, color 0.3s ease',
          textAlign: 'center',
        }}
      >
        {member.name}
      </h3>

      <span
        style={{
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: hovered ? textPrimary : textSecondary,
          marginBottom: 20,
          transition: 'color 0.4s ease',
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 280,
        }}
      >
        {member.role}
      </span>

      <div
        style={{
          width: hovered ? 60 : 30,
          height: 2,
          background: dividerColor,
          marginBottom: 20,
          transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          borderRadius: 1,
        }}
      />

      <p
        style={{
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          fontSize: 15,
          lineHeight: 1.75,
          color: hovered ? textBodyHover : textBody,
          textAlign: 'center',
          margin: 0,
          maxWidth: 300,
          transition: 'color 0.4s ease',
        }}
      >
        {member.description}
      </p>

      <a
        href={member.portfolioLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 20,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 500,
          color: isDark ? '#60a5fa' : '#2563eb',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'opacity 0.2s ease',
          opacity: hovered ? 1 : 0.7,
        }}
      >
        View Portfolio →
      </a>
    </div>
  )
}

export default function OurTeamPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const bg = isDark ? 'transparent' : '#ffffff'
  const headingColor = isDark ? '#f1f5f9' : '#1a1a1a'
  const subColor = isDark ? '#94a3b8' : '#999'
  const lineColor = isDark ? 'linear-gradient(to bottom, #334155, transparent)' : 'linear-gradient(to bottom, #ddd, transparent)'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '100px 24px 80px',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        transition: 'background 0.3s ease',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500&display=swap');`}</style>

      <div
        style={{
          textAlign: 'center',
          marginBottom: 32,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: headingColor,
            margin: '0 0 20px 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Meet Our Team
        </h1>

        <p
          style={{
            fontSize: 17,
            color: subColor,
            maxWidth: 480,
            lineHeight: 1.7,
            margin: '0 auto',
          }}
        >
          The researchers and engineers behind the AI models powering DiseaseVision.
        </p>

        <div
          style={{
            width: 1,
            height: 24,
            background: lineColor,
            margin: '16px auto 0',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 56,
          maxWidth: 1200,
          width: '100%',
        }}
      >
        {teamMembers.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} isDark={isDark} />
        ))}
      </div>

    </div>
  )
}
