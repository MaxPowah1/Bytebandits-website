// src/pages/Home.jsx
import { useMemo } from 'react'
import Terminal from '@/components/Terminal'
import useTypingEffect from '@/hooks/useTypingEffect'

export default function Home() {
  const headerArt = useMemo(() => `
███████╗██╗   ██╗████████╗██████╗  █████╗ ███╗   ██╗██████╗ ████████╗███████╗███████╗
██╔════╝██║   ██║╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔══██╗╚══██╔══╝██╔════╝██╔════╝
█████╗  ██║   ██║   ██║   ██████╔╝███████║██╔██╗ ██║██║  ██║   ██║   █████╗  ███████╗
██╔══╝  ██║   ██║   ██║   ██╔══██╗██╔══██║██║╚██╗██║██║  ██║   ██║   ██╔══╝  ╚════██║
██║     ╚██████╔╝   ██║   ██║  ██║██║  ██║██║ ╚████║██████╔╝   ██║   ███████╗███████║
╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝    ╚═╝   ╚══════╝╚══════╝
  `, [])

  const bodyText = useMemo(() => `
Welcome to Bytebandits GmbH!
We create pixel-perfect, retro-styled web experiences that stand the test of time.

Our tagline:
  “Nostalgia meets modern performance.”
`, [])

  const fullText = headerArt + '\n' + bodyText + '\n[Press ENTER or click below to see our Services]'

  // Type at 30ms per character
  const displayed = useTypingEffect(fullText, 30)

  return (
    <Terminal title="BYTEBANDITS">
      {displayed}

      {/* Show the button once typing is complete */}
      {displayed === fullText && (
        <div className="mt-4 flex justify-center">
          <a
            href="/services"
            className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded inline-block"
          >
            View Services
          </a>
        </div>
      )}
    </Terminal>
  )
}
