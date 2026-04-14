import { FiLinkedin, FiGlobe, FiGithub } from 'react-icons/fi'
import { FiTwitter } from 'react-icons/fi'

export interface AboutPersonLink {
  label: string
  href: string
  kind: 'linkedin' | 'x' | 'web' | 'github'
}

export interface AboutPerson {
  name: string
  role: string
  bio: string
  photo: string
  links: AboutPersonLink[]
}

interface Props {
  people: AboutPerson[]
  isDark: boolean
  linkClass: string
}

function LinkIcon({ kind }: { kind: AboutPersonLink['kind'] }) {
  const size = 15
  if (kind === 'linkedin') return <FiLinkedin size={size} />
  if (kind === 'github')   return <FiGithub size={size} />
  if (kind === 'x')        return <FiTwitter size={size} />
  return <FiGlobe size={size} />
}

export default function AboutPeopleStrip({ people, isDark, linkClass }: Props) {
  const cardBg    = isDark ? 'bg-zinc-900/60'  : 'bg-white'
  const cardBorder = isDark ? 'border-zinc-800' : 'border-zinc-200'
  const nameCls   = isDark ? 'text-zinc-50'    : 'text-zinc-900'
  const roleCls   = isDark ? 'text-blue-300'   : 'text-blue-600'
  const bioCls    = isDark ? 'text-zinc-400'   : 'text-zinc-600'

  return (
    <div>
      <h2
        id="people-heading"
        className={`mb-10 text-2xl font-bold tracking-tight md:text-3xl ${isDark ? 'text-zinc-50' : 'text-zinc-900'}`}
      >
        The Team
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <article
            key={person.name}
            className={`flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-lg ${cardBg} ${cardBorder}`}
          >
            {/* Photo */}
            <div className="mb-5 flex justify-center">
              <img
                src={person.photo}
                alt={person.name}
                className="h-28 w-28 rounded-2xl object-cover object-top"
              />
            </div>

            {/* Name + role */}
            <h3 className={`text-center text-lg font-semibold leading-snug ${nameCls}`}>
              {person.name}
            </h3>
            <p className={`mt-1 text-center text-xs font-medium uppercase tracking-wide ${roleCls}`}>
              {person.role}
            </p>

            {/* Divider */}
            <div className={`my-4 h-px w-12 self-center rounded ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

            {/* Bio */}
            <p className={`flex-1 text-center text-sm leading-relaxed ${bioCls}`}>
              {person.bio}
            </p>

            {/* Links */}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {person.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`${person.name} ${link.label}`}
                >
                  <LinkIcon kind={link.kind} />
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
