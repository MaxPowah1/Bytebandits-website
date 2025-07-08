// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import SplashScreen from './components/SplashScreen'

import { lines as homeLines }       from './pages/Home'
import { lines as servicesLines }   from './pages/Services'
import { lines as aboutLines }      from './pages/About'
import { lines as contactLines }    from './pages/Contact'
import { lines as homeLinesMobile } from './pages/HomeMobile'

import homeImg     from './assets/section-home.png'
import servicesImg from './assets/section-services2.png'
import aboutImg    from './assets/section-about2.png'
import contactImg  from './assets/section-contact3.png'

import Impressum   from './pages/Impressum'

// breakpoint
const MOBILE_BREAK = 768

// — custom hook to detect mobile width —
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth <= MOBILE_BREAK
      : false
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAK)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return isMobile
}

// — styled components —

// scroll‐snap container (always on)
const ScrollContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  background-color: #121212;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const Section = styled.section`
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
`

const distort = keyframes`
  /* unchanged glitch animation */
`

const Terminal = styled.div`
  position: relative;
  display: flex;
  width: 80vw;
  max-width: 800px;
  height: 60vh;
  max-height: 600px;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,255,0,0.6);

  &::before {
    /* CRT scanlines */
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0,255,0,0.1) 0px,
      rgba(0,255,0,0.1) 2px,
      transparent 2px,
      transparent 4px
    );
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  @media (max-width: ${MOBILE_BREAK}px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
    flex-direction: column;
    /* push content down so menu doesn’t cover it */
    padding-top: 4rem;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &.distort {
    animation: ${distort} 0.8s ease-in-out 1;
  }
`

const ImagePanel = styled.div`
  flex: 0 0 200px;
  margin-left: -280px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  img { width: 400px; height: auto; object-fit: contain; }

  @media (max-width: ${MOBILE_BREAK}px) {
    display: flex;
    position: absolute;

    /* push it right down into the corner */
    bottom: -2rem;
    left: -1rem;

    margin: 0;
    flex: 0 0 auto;

    img {
      width: 50vw;
      height: auto;
    }
  }
`

const LinesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow: hidden;
  text-shadow: 0 0 8px #00ff00;
  font-size: clamp(1rem, 2.5vw, 1rem);

  @media (max-width: ${MOBILE_BREAK}px) {
    padding: 0.5rem;
    font-size: clamp(0.6rem, 2.5vw, 1rem);
  }
`

const InputLine = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  color: #00ff00;
  font-family: 'Courier New', monospace;
`
const Prompt = styled.span` margin-right: 0.5rem; `
const CommandInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  outline: none;
`

const ImpressumLink = styled.span`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  text-decoration: underline;
`

const glow = keyframes`
  0%   { text-shadow: none; }
  50%  { text-shadow: 0 0 12px #00ff00; }
  100% { text-shadow: 0 0 8px #00ff00; }
`

const MenuLinks = styled.div`
  position: absolute;
  top: 1rem;
  right: -6rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: ${MOBILE_BREAK}px) {
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 0.75rem 0;
    background: rgba(0, 0, 0, 0.8);
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
`

const MenuLink = styled.span`
  position: relative;
  display: block;
  padding-left: 0.6rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: ${p => (p.active ? '#00ff00' : '#00ff00aa')};
  transition: color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 2px;
    height: 1em;
    background-color: ${p => (p.active ? '#00ff00' : 'transparent')};
  }

  &:hover {
    color: #00ff00;
  }
  &:hover::before {
    background-color: #00ff00aa;
  }

  ${p =>
    p.active &&
    css`
      animation: ${glow} 1.8s ease-out forwards;
    `}

  @media (max-width: ${MOBILE_BREAK}px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
  }
`

function SectionComponent({ id, lines, img, onCommand, currentSection }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [input, setInput] = useState('')
  const contentRef = useRef()

  useEffect(() => {
    if (currentSection === id) {
      setCount(0)
      setStarted(true)
      contentRef.current.classList.add('distort')
      setTimeout(() => contentRef.current.classList.remove('distort'), 800)
    } else {
      setStarted(false)
    }
  }, [currentSection, id])

  useEffect(() => {
    if (!started || count >= lines.length) return
    const t = setTimeout(() => setCount(c => c + 1), 50)
    return () => clearTimeout(t)
  }, [started, count, lines.length])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim().toLowerCase())
      setInput('')
    }
  }

  const labels = ['home', 'services', 'about', 'contact']

  return (
    <Section id={`${id}-section`}>
      <Terminal>
        <MenuLinks>
          {labels.map(label => (
            <MenuLink
              key={label}
              active={currentSection === label}
              onClick={() => onCommand(label)}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </MenuLink>
          ))}
        </MenuLinks>

        {img && (
          <ImagePanel>
            <img src={img} alt={`${id} illustration`} />
          </ImagePanel>
        )}

        <Content ref={contentRef}>
          <LinesContainer>
            {lines.slice(0, count).join('\n')}
          </LinesContainer>
          <InputLine>
            <Prompt>$</Prompt>
            <CommandInput
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus={id === 'home'}
            />
          </InputLine>
        </Content>
      </Terminal>
    </Section>
  )
}

export default function App() {
  // 1) ALL hooks up-front in stable order
  const isMobile           = useIsMobile()
  const [showImpressum, setShowImpressum]   = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
  const [showSplash, setShowSplash]         = useState(true)
  const scrollRef         = useRef(null)

  // 2) Define your sections and helpers once
  const sectionMap = [
    { id: 'home',     lines: isMobile ? homeLinesMobile : homeLines, img: homeImg },
    { id: 'services', lines: servicesLines,                         img: servicesImg },
    { id: 'about',    lines: aboutLines,                            img: aboutImg },
    { id: 'contact',  lines: contactLines,                          img: contactImg },
  ]
  const sectionIds = sectionMap.map(s => s.id)

  const scrollTo = id => {
    document
      .getElementById(`${id}-section`)
      .scrollIntoView({ behavior: 'smooth' })
  }
  const onCommand = cmd => {
    if (sectionIds.includes(cmd)) scrollTo(cmd)
  }

  // 3) Scroll‐spy effect
  useEffect(() => {
    const container = scrollRef.current
    const onScroll = () => {
      for (let id of sectionIds) {
        const rect = document
          .getElementById(`${id}-section`)
          .getBoundingClientRect()
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          setCurrentSection(id)
          break
        }
      }
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [sectionIds])

  // 4) Reset to top on mount
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [])

  // 5) Splash finish handler
  const handleSplashFinish = () => {
    setShowSplash(false)
    // Ensure we start at top of main app
    setTimeout(() => scrollRef.current?.scrollTo(0, 0), 0)
  }

  return (
    <>
      {/* Main site always mounted under the splash */}
      <ScrollContainer ref={scrollRef}>
        {sectionMap.map(s => (
          <SectionComponent
            key={s.id}
            {...s}
            onCommand={onCommand}
            currentSection={currentSection}
          />
        ))}
      </ScrollContainer>

      <ImpressumLink onClick={() => setShowImpressum(true)}>
        Impressum
      </ImpressumLink>
      {showImpressum && <Impressum onClose={() => setShowImpressum(false)} />}

      {/* Splash overlay */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  )
}
