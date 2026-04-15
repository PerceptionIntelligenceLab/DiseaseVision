import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  IoMailOutline,
  IoLocationOutline,
  IoCallOutline,
} from 'react-icons/io5'
import {
  BiLogoGmail,
} from 'react-icons/bi'
import {
  PiMicrosoftOutlookLogo,
} from 'react-icons/pi'
import {
  TiSocialLinkedin,
} from 'react-icons/ti'
import {
  RiTwitterXLine,
} from 'react-icons/ri'
import type { MainLayoutOutletContext } from './mainLayoutContext'
import './ContactPage.css'

const LINKS = {
  gmail:    () => window.open('mailto:debeshjha1@gmail.com', '_blank'),
  outlook:  () => window.open('mailto:debeshjha1@gmail.com', '_blank'),
  linkedin: () => window.open('https://www.linkedin.com/in/debesh-jha/', '_blank'),
  twitter:  () => window.open('https://x.com/DebeshJha', '_blank'),
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setToast(null)
    try {
      const res = await fetch('https://formsubmit.co/ajax/swarnasaisankar044@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setToast({ type: 'success', text: 'Thank you for reaching out! We\'ll get back to you shortly.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setToast({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`contact-page${isDark ? '' : ' light'}`}>
      <div className="contact-header">
        <h1>Let's Get In Touch</h1>
        <div className="contact-header-line" />
        <p>
          Have a question about our models, interested in collaboration, or want to discuss
          research? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-grid">
        {/* ── Left: Info ── */}
        <div className="contact-info-panel">
          <h2>Contact Us</h2>

          <div className="contact-info-items">
            <a href="mailto:debeshjha1@gmail.com" className="contact-info-item">
              <span className="contact-info-icon"><IoMailOutline /></span>
              <div className="contact-info-text">
                <h3>Email</h3>
                <p>debeshjha1@gmail.com</p>
              </div>
            </a>

            <a href="tel:+13125305020" className="contact-info-item">
              <span className="contact-info-icon"><IoCallOutline /></span>
              <div className="contact-info-text">
                <h3>Phone</h3>
                <p>+1 (312) 530-5020</p>
              </div>
            </a>

            <div className="contact-info-item">
              <span className="contact-info-icon"><IoLocationOutline /></span>
              <div className="contact-info-text">
                <h3>Address</h3>
                <p>
                  Department of Computer Science,<br />
                  414 E. Clark Street,<br />
                  Vermillion, SD 57069
                </p>
              </div>
            </div>
          </div>

          <div className="contact-socials">
            <button type="button" className="contact-social-btn" onClick={LINKS.gmail} aria-label="Gmail">
              <BiLogoGmail />
            </button>
            <button type="button" className="contact-social-btn" onClick={LINKS.outlook} aria-label="Outlook">
              <PiMicrosoftOutlookLogo />
            </button>
            <button type="button" className="contact-social-btn" onClick={LINKS.linkedin} aria-label="LinkedIn">
              <TiSocialLinkedin />
            </button>
            <button type="button" className="contact-social-btn" onClick={LINKS.twitter} aria-label="Twitter">
              <RiTwitterXLine />
            </button>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="contact-form-panel">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="ct-name">Name</label>
              <input
                id="ct-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="ct-email">Email</label>
              <input
                id="ct-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="ct-subject">Purpose of Inquiry</label>
              <select
                id="ct-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Professional Talk">Professional Talk</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Support">Support</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="ct-message">Message</label>
              <textarea
                id="ct-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry…"
                required
              />
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          {toast && (
            <div className={`contact-toast ${toast.type}`}>
              {toast.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
