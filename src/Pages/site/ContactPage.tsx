import { useOutletContext } from 'react-router-dom'
import type { MainLayoutOutletContext } from './mainLayoutContext'

export default function ContactPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'

  return (
    <main className="px-6 pb-16 pt-[5.5rem] md:px-10">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact</h1>
      <p className={`mt-4 max-w-2xl text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
        Content smale
      </p>
    </main>
  )
}
