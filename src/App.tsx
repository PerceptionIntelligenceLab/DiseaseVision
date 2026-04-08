import { useState } from 'react'
import Navbar from './Components/Navbar'
import HomePage from './Components/HomePage'

function App() {
  const [theme, setTheme] = useState<'white' | 'black'>('black')
  const isBlack = theme === 'black'

  return (
    <div
      className={`${isBlack ? 'bg-black text-zinc-100' : 'bg-white text-zinc-900'} min-h-screen transition-colors duration-300`}
    >
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'black' ? 'white' : 'black'))}
      />
      <HomePage />
    </div>
  )
}

export default App
