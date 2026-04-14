import { useOutletContext } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import teamImage from '../../assets/Websites/About/Team.jpeg'
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

const intro =
  'At PerceptionIntelligenceLab, we conduct research at the intersection of deep learning and medical image analysis, with a primary focus on developing robust and generalizable models for clinical decision support. Our work emphasizes advanced image segmentation and classification techniques applied to endoscopic and radiological data, leveraging architectures such as convolutional neural networks and transformer based models. We investigate domain generalization and cross dataset adaptability to address distribution shifts across multi center and multi modal medical data. In addition, we design and curate large-scale annotated datasets to enable reproducible benchmarking and facilitate the development of reliable AI systems. Our research also explores hybrid approaches that integrate detection, segmentation, and foundation models to enhance performance in complex clinical scenarios. Through this work, we aim to translate state-of-the-art machine learning methodologies into scalable and clinically relevant solutions for improved diagnostic accuracy and efficiency.'

export default function AboutPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'
  const reduceMotion = useReducedMotion()

  return (
    <main className={isDark ? 'bg-black text-zinc-100' : 'bg-[#F8F9FA] text-zinc-900'}>
      <section
        className={`flex min-h-screen flex-col justify-center px-6 py-12 pt-[calc(5.5rem+2rem)] md:px-10 md:py-16 lg:py-20 ${isDark ? 'bg-black' : 'bg-[#F8F9FA]'}`}
      >
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">

          <div className="flex flex-col justify-center">
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
              About
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.35rem] lg:leading-tight">
              PerceptionIntelligenceLab
            </h1>
            <p className={`mt-6 max-w-xl text-justify text-base leading-relaxed md:max-w-none md:text-lg ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {intro}
            </p>
          </div>

          <div className="flex justify-center overflow-x-clip lg:justify-end">
            <motion.figure
              className="w-full max-w-md lg:max-w-none"
              initial={reduceMotion ? false : { opacity: 0, x: 56 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 90, damping: 22, mass: 0.85 }
              }
            >
              <img
                src={teamImage}
                alt="PerceptionIntelligenceLab team"
                className="h-auto w-full max-w-full rounded-2xl align-middle"
                loading="eager"
                decoding="async"
              />
            </motion.figure>
          </div>

        </div>
      </section>

      {/* ── AI and medical imaging section ── */}
      <section
        id="ai-medical-imaging"
        className={`relative overflow-x-visible border-t py-16 pl-0 pr-5 sm:py-20 sm:pr-10 md:py-24 ${isDark ? 'border-zinc-800 bg-black' : 'border-zinc-200/90 bg-[#F8F9FA]'}`}
        aria-labelledby="about-ai-imaging-heading"
      >
        <div className="relative isolate w-full overflow-x-visible">
          <div className="relative z-10 min-w-0 max-w-3xl px-5 text-left sm:px-10 lg:ml-auto lg:max-w-3xl lg:pl-10 lg:pr-2 xl:pl-12 xl:pr-4">
            <h2
              id="about-ai-imaging-heading"
              className={`font-serif text-2xl font-normal tracking-tight sm:text-3xl md:text-[2rem] ${isDark ? 'text-zinc-50' : 'text-slate-900'}`}
            >
              AI and medical imaging
            </h2>

            <div className="mt-6 space-y-4 sm:space-y-5">
              <p className={`text-justify text-base leading-relaxed sm:text-lg ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Medical imaging lets clinicians look inside the body without surgery supporting
                diagnosis, staging, and follow up. For a long time, interpretation depended heavily on
                expert radiologists reading each study by hand. That work is skilled and demanding, and
                subtle signs can be easy to overlook when volume is high or findings are early.
              </p>
              <p className={`text-justify text-base leading-relaxed sm:text-lg ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Artificial intelligence is changing that workflow. Models can scan complex images of
                major organs the brain, lungs, heart, liver, and more and surface patterns and anomalies
                that are hard to spot at a glance. The aim is not perfection in isolation, but faster,
                more consistent triage so important cases get attention sooner and treatment can start
                earlier when it matters most.
              </p>
              <p className={`text-justify text-base leading-relaxed sm:text-lg ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                In practice, AI often works as decision support: highlighting suspicious regions,
                suggesting differential considerations, and in some systems offering probability-style
                readouts or tracking change across prior exams. Over time, that can help teams monitor
                progression and compare options not to replace clinical judgment, but to strengthen it.
              </p>
            </div>

            <h3 className={`mt-10 text-left text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-white' : 'text-black'}`}>
              Common imaging modalities
            </h3>
            <ul className={`mt-6 grid list-none gap-4 p-0 text-sm sm:grid-cols-2 sm:gap-x-10 sm:text-base ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
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
                    transition={{ type: 'spring', stiffness: 320, damping: 28, delay: reduceMotion ? 0 : index * 0.08 }}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" aria-hidden />
                    <span className="text-left">
                      <strong className={isDark ? 'text-zinc-100' : 'text-slate-900'}>{item.name}</strong>
                      {'parenthetical' in item && item.parenthetical ? <> {item.parenthetical} :</> : ' : '}
                      {item.body}
                    </span>
                  </motion.li>
                )
              })}
            </ul>

            <p className={`mt-10 text-justify text-base leading-relaxed sm:text-lg ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
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
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32, mass: 0.85 }}
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
    </main>
  )
}
