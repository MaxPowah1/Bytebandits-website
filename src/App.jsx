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
  background-color: var(--terminal-bg);
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  position: relative;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 10% 10%, rgba(0, 255, 148, 0.08), transparent 50%),
      radial-gradient(circle at 90% 20%, rgba(123, 92, 255, 0.15), transparent 45%);
    filter: blur(40px);
    pointer-events: none;
    z-index: -1;
  }
`

const Section = styled.section`
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1rem, 4vw, 4rem);
  padding: clamp(1rem, 3vw, 4rem);
  box-sizing: border-box;
  perspective: 1200px;
  position: relative;

  @media (max-width: ${MOBILE_BREAK}px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
`

const distort = keyframes`
  0% { filter: none; transform: none; }
  20% { filter: hue-rotate(3deg) saturate(1.2); transform: skewX(0.3deg); }
  21% { filter: contrast(1.4) saturate(1.5); transform: translateX(-1px); }
  22% { filter: contrast(1) saturate(1); transform: translateX(0); }
  55% { filter: drop-shadow(0 0 4px rgba(0,255,148,0.5)); }
  100% { filter: none; transform: none; }
`

const sweep = keyframes`
  0% { transform: translateX(-150%) skewX(-10deg); }
  100% { transform: translateX(200%) skewX(-10deg); }
`

const float = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.015); }
  100% { transform: translateY(0) scale(1); }
`

const ledPulse = keyframes`
  0%, 60%, 100% { opacity: 0.2; }
  30% { opacity: 1; }
`

const Terminal = styled.div`
  position: relative;
  width: clamp(560px, 65vw, 1000px);
  height: clamp(520px, 70vh, 680px);
  background: linear-gradient(135deg, rgba(4, 12, 24, 0.95), rgba(3, 4, 12, 0.9));
  border: 1px solid rgba(0,255,148,0.3);
  border-radius: 18px;
  box-shadow: var(--terminal-shadow);
  backdrop-filter: blur(8px);
  overflow: hidden;

  @media (max-width: ${MOBILE_BREAK}px) {
    width: 100vw;
    height: min(85vh, 600px);
    border-radius: 0;
    box-shadow: none;
  }
`

const TerminalBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 3.5rem;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    z-index: 0;
  }

  &::before {
    background: repeating-linear-gradient(
        to bottom,
        rgba(0, 255, 148, 0.04) 0px,
        rgba(0, 255, 148, 0.04) 2px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(
        to right,
        rgba(0, 255, 148, 0.01) 0,
        rgba(0, 255, 148, 0.01) 2px,
        transparent 2px,
        transparent 6px
      );
    mix-blend-mode: overlay;
    opacity: 0.5;
  }

  &::after {
    background: linear-gradient(120deg, rgba(0,255,148,0) 40%, rgba(0,255,148,0.12));
    mix-blend-mode: screen;
    animation: ${sweep} 6s linear infinite;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;

  &.distort {
    animation: ${distort} 0.8s ease-in-out 1;
  }
`

const LinesContainer = styled.div`
  flex: 1;
  padding: 1.25rem;
  padding-bottom: clamp(3rem, 10vw, 6rem);
  padding-right: clamp(1.25rem, 6vw, 4rem);
  color: #00ff00;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow-y: auto;
  text-shadow: 0 0 8px #00ff00;
  font-size: clamp(1rem, 2.5vw, 1rem);
  background: rgba(3, 9, 18, 0.75);
  border-left: 1px solid rgba(0,255,148,0.15);
  border-top: 1px solid rgba(0,255,148,0.05);
  clip-path: polygon(0 0, 100% 0, 100% 95%, 98% 100%, 0 100%);
  position: relative;

  @media (max-width: ${MOBILE_BREAK}px) {
    padding: 0.5rem;
    font-size: clamp(0.6rem, 2.5vw, 1rem);
  }
`

const ImpressumLink = styled.span`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  text-decoration: underline;
  text-shadow: 0 0 8px rgba(0,255,148,0.8);
`

const glow = keyframes`
  0%   { text-shadow: none; }
  50%  { text-shadow: 0 0 12px #00ff00; }
  100% { text-shadow: 0 0 8px #00ff00; }
`

const TerminalGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: clamp(1rem, 2vw, 2.5rem);

  @media (max-width: ${MOBILE_BREAK}px) {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }
`

const MenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.55);
  padding: 1rem 1.25rem;
  border: 1px solid rgba(0,255,148,0.2);
  border-radius: 12px;
  backdrop-filter: blur(6px);
  box-shadow: 0 0 18px rgba(0,255,148,0.25);
  min-width: 130px;

  @media (max-width: ${MOBILE_BREAK}px) {
    flex-direction: row;
    justify-content: center;
    border-radius: 0;
    width: 100%;
    padding: 0.75rem 0;
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
  text-transform: uppercase;

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

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -14px;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${p => (p.active ? '#00ff94' : 'rgba(0,255,148,0.25)')};
    box-shadow: ${p =>
      p.active ? '0 0 8px rgba(0,255,148,0.8)' : 'none'};
    animation: ${p => (p.active ? ledPulse : 'none')} 1.5s ease-in-out infinite;
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

const ImagePanel = styled.div`
  position: absolute;
  bottom: clamp(0.75rem, 2vw, 2rem);
  right: clamp(0.75rem, 2vw, 2.5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1;

  img {
    width: clamp(140px, 18vw, 220px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 0 32px rgba(0,255,148,0.45));
    transform: scaleX(-1);
    animation: ${float} 10s ease-in-out infinite;
  }

  @media (max-width: ${MOBILE_BREAK}px) {
    position: static;
    margin: 1rem auto 0;

    img {
      width: 55vw;
      transform: scaleX(-1);
    }
  }
`

const TerminalHud = styled.div`
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${MOBILE_BREAK}px) {
    top: 3.25rem;
    left: 50%;
    transform: translateX(-50%);
  }
`

const HudBadge = styled.div`
  padding: 0.35rem 0.9rem;
  border: 1px solid rgba(0,255,148,0.4);
  border-radius: 999px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(0,0,0,0.45);
  box-shadow: 0 0 12px rgba(0,255,148,0.3);
`

const LedPanel = styled.div`
  display: flex;
  gap: 0.4rem;
`

const LedDot = styled.span.withConfig({
  shouldForwardProp: prop => prop !== '$active'
})`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.1);
  background: ${({ $active }) =>
    $active ? 'linear-gradient(180deg,#00ff94,#00c46f)' : 'rgba(0,255,148,0.15)'};
  box-shadow: ${({ $active }) =>
    $active ? '0 0 6px rgba(0,255,148,0.8)' : 'none'};
  animation: ${({ $active }) => ($active ? ledPulse : 'none')} 1.2s ease-in-out infinite;
`

function SectionComponent({ id, lines, img, onCommand, currentSection }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const contentRef = useRef()
  const [leds, setLeds] = useState(() =>
    Array.from({ length: 4 }, () => Math.random() > 0.5)
  )

  useEffect(() => {
    if (currentSection !== id) return
    const interval = setInterval(() => {
      setLeds(Array.from({ length: 4 }, () => Math.random() > 0.4))
    }, 1200)
    return () => clearInterval(interval)
  }, [currentSection, id])

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

  const labels = ['home', 'services', 'about', 'contact']
  const hudLabel = `//${id.toUpperCase()}`

  return (
    <Section id={`${id}-section`}>
      <TerminalGroup>
        <Terminal>
          <TerminalHud>
            <HudBadge>{hudLabel}</HudBadge>
            <LedPanel>
              {leds.map((active, index) => (
                <LedDot key={index} $active={active} />
              ))}
            </LedPanel>
          </TerminalHud>
          <TerminalBody>
            <Content ref={contentRef}>
              <LinesContainer>
                {lines.slice(0, count).join('\n')}
                {img && (
                  <ImagePanel>
                    <img src={img} alt={`${id} illustration`} />
                  </ImagePanel>
                )}
              </LinesContainer>
            </Content>
          </TerminalBody>
        </Terminal>
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
      </TerminalGroup>
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
