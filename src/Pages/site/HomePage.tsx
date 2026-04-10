import { Link, useOutletContext } from 'react-router-dom'
import matchImage from '../../assets/Websites/Match.png'
import type { MainLayoutOutletContext } from './mainLayoutContext'

export default function HomePage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'

  return (
    <main className="pt-[4.75rem]">
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${matchImage})` }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-10 text-center sm:px-10 sm:pb-24 sm:pt-14">
          <div
            className={`w-full max-w-4xl translate-y-2 rounded-3xl sm:translate-y-6 md:translate-y-10 ${
              isDark ? 'px-6 py-10 sm:px-10 sm:py-12' : 'px-2 py-4 sm:px-4'
            }`}
          >
            <h1
              className={`font-serif text-[clamp(2.75rem,8vw,5.5rem)] font-normal leading-[1.05] tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900 [text-shadow:0_1px_2px_rgba(255,255,255,0.85)]'
              }`}
            >
              DiseaseVision
            </h1>

            <p
              className={`mt-8 text-sm font-medium uppercase tracking-[0.28em] sm:mt-10 sm:text-base ${
                isDark ? 'text-zinc-300' : 'text-slate-600'
              }`}
            >
              Presented By
            </p>

            <p
              className={`mt-4 font-sans text-[clamp(1.35rem,3.8vw,2.75rem)] font-semibold leading-snug tracking-tight ${
                isDark ? 'text-zinc-50' : 'text-slate-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]'
              }`}
            >
              PerceptionIntelligenceLab
            </p>

            <div
              className={`mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent to-transparent sm:mt-14 ${
                isDark ? 'via-white/35' : 'via-slate-400/70'
              }`}
            />

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <Link
                to="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-400 px-10 py-3 text-base font-semibold tracking-wide text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Explore Models
              </Link>
              <Link
                to="/about"
                className={`inline-flex min-h-12 items-center justify-center rounded-md border-2 px-10 py-3 text-base font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isDark
                    ? 'border-blue-400/90 bg-blue-950/35 text-blue-100 hover:border-blue-300 hover:bg-blue-900/45 focus-visible:outline-blue-300'
                    : 'border-blue-600 bg-white/90 text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-600'
                }`}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
