import { Link, useOutletContext } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import matchImage from '../../assets/Websites/Match.png'
import dnaImage from '../../assets/Websites/HomePage/DNA.png'
import type { MainLayoutOutletContext } from './mainLayoutContext'

const modalityItems = [
  {
    name: 'X-ray',
    body: 'quick, widely available imaging for bones, the chest, and many structural questions.',
  },
  {
    name: 'CT',
    parenthetical: '(computed tomography)',
    body: 'thin cross sectional slices through the body for detailed anatomy and many acute conditions.',
  },
  {
    name: 'MRI',
    parenthetical: '(magnetic resonance imaging)',
    body: 'excellent soft-tissue contrast for the brain, spine, muscles, and many organs.',
  },
  {
    name: 'Ultrasound',
    body: 'real time, radiation free imaging for organs, blood flow, and obstetric care.',
  },
] as const

export default function HomePage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'
  const reduceMotion = useReducedMotion()

  const panelBg = isDark ? 'bg-zinc-950' : 'bg-white'
  const panelBorder = isDark ? 'border-zinc-800' : 'border-slate-200/80'
  const panelShadow = isDark
    ? 'shadow-[0_-24px_80px_rgba(0,0,0,0.55)]'
    : 'shadow-[0_-20px_60px_rgba(15,23,42,0.12)]'

  return (
    <main className="relative pt-[4.75rem]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 top-[4.75rem] z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${matchImage})` }}
      />

      <div className="relative z-10">
        <section className="relative flex min-h-[calc(100dvh-4.75rem)] flex-col">
          <div className="flex min-h-[inherit] flex-col items-center justify-center px-5 pb-20 pt-10 text-center sm:px-10 sm:pb-24 sm:pt-14">
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
        <section
          id="ai-medical-imaging"
          className={`relative z-20 overflow-x-visible scroll-mt-20 rounded-t-[1.75rem] border-t py-16 pl-0 pr-5 sm:rounded-t-[2rem] sm:py-20 sm:pr-10 md:py-24 ${panelBg} ${panelBorder} ${panelShadow}`}
          aria-labelledby="home-ai-imaging-heading"
        >
          <div className="relative isolate w-full overflow-x-visible">
            <div className="relative z-10 min-w-0 max-w-3xl px-5 text-left sm:px-10 lg:ml-auto lg:max-w-3xl lg:pl-10 lg:pr-2 xl:pl-12 xl:pr-4">
            <h2
              id="home-ai-imaging-heading"
              className={`font-serif text-2xl font-normal tracking-tight sm:text-3xl md:text-[2rem] ${
                isDark ? 'text-zinc-50' : 'text-slate-900'
              }`}
            >
              AI and medical imaging
            </h2>

            <div className="mt-6 space-y-4 sm:space-y-5">
              <p
                className={`text-justify text-base leading-relaxed sm:text-lg ${
                  isDark ? 'text-zinc-400' : 'text-slate-600'
                }`}
              >
                Medical imaging lets clinicians look inside the body without surgery supporting
                diagnosis, staging, and follow up. For a long time, interpretation depended heavily on
                expert radiologists reading each study by hand. That work is skilled and demanding, and
                subtle signs can be easy to overlook when volume is high or findings are early.
              </p>
              <p
                className={`text-justify text-base leading-relaxed sm:text-lg ${
                  isDark ? 'text-zinc-400' : 'text-slate-600'
                }`}
              >
                Artificial intelligence is changing that workflow. Models can scan complex images of
                major organs the brain, lungs, heart, liver, and more and surface patterns and anomalies
                that are hard to spot at a glance. The aim is not perfection in isolation, but faster,
                more consistent triage so important cases get attention sooner and treatment can start
                earlier when it matters most.
              </p>
              <p
                className={`text-justify text-base leading-relaxed sm:text-lg ${
                  isDark ? 'text-zinc-400' : 'text-slate-600'
                }`}
              >
                In practice, AI often works as decision support: highlighting suspicious regions,
                suggesting differential considerations, and in some systems offering probability-style
                readouts or tracking change across prior exams. Over time, that can help teams monitor
                progression and compare options not to replace clinical judgment, but to strengthen it.
              </p>
            </div>

            <h3
              className={`mt-10 text-left text-sm font-semibold uppercase tracking-[0.18em] ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Common imaging modalities
            </h3>
            <ul
              className={`mt-6 grid list-none gap-4 p-0 text-sm sm:grid-cols-2 sm:gap-x-10 sm:text-base ${
                isDark ? 'text-zinc-300' : 'text-slate-700'
              }`}
            >
              {modalityItems.map((item, index) => {
                const fromLeft = index % 2 === 0
                const slide = reduceMotion ? 0 : fromLeft ? -56 : 56
                return (
                  <motion.li
                    key={item.name}
                    className="flex gap-3"
                    initial={reduceMotion ? false : { opacity: 0, x: slide }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35, margin: '0px 0px -10% 0px' }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 28,
                      delay: reduceMotion ? 0 : index * 0.08,
                    }}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" aria-hidden />
                    <span className="text-left">
                      <strong className={isDark ? 'text-zinc-100' : 'text-slate-900'}>{item.name}</strong>
                      {'parenthetical' in item && item.parenthetical ? (
                        <>
                          {' '}
                          {item.parenthetical} :
                        </>
                      ) : (
                        ' : '
                      )}
                      {item.body}
                    </span>
                  </motion.li>
                )
              })}
            </ul>

            <p
              className={`mt-10 text-justify text-base leading-relaxed sm:text-lg ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
              }`}
            >
              Together, these technologies and thoughtful AI assistance can reduce friction in busy
              reading rooms, improve standardization, and help patients benefit from timely,
              well-informed imaging interpretation.
            </p>
            </div>

            <motion.figure
              className="pointer-events-none hidden overflow-visible lg:absolute lg:inset-y-0 lg:left-0 lg:z-0 lg:block lg:w-[min(92vw,52rem)] xl:w-[min(90vw,56rem)]"
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35, margin: '0px 0px -8% 0px' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: 'spring',
                      stiffness: 260,
                      damping: 32,
                      mass: 0.85,
                    }
              }
            >
              <img
                src={dnaImage}
                alt="DNA double helix illustration"
                className="h-full w-full object-contain object-left-bottom lg:absolute lg:inset-0 lg:max-h-none"
                decoding="async"
              />
            </motion.figure>
          </div>
        </section>
      </div>
    </main>
  )
}
