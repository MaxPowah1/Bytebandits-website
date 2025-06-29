// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

import { lines as homeLines }     from './pages/Home'
import { lines as servicesLines } from './pages/Services'
import { lines as aboutLines }    from './pages/About'
import { lines as contactLines }  from './pages/Contact'
import { lines as footerLines }   from './pages/Footer'

import homeImg     from './assets/section-home.png'
import servicesImg from './assets/section-services2.png'
import aboutImg    from './assets/section-about2.png'
import contactImg  from './assets/section-contact3.png'

import Impressum   from './pages/Impressum'

// ————————————————— styled components —————————————————

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
  /* untouched */
`

const Terminal = styled.div`
  position: relative;
  display: flex;
  width: 80vw;    max-width: 800px;
  height: 60vh;   max-height: 600px;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,255,0,0.6);

  &::before {
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
`

const LinesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow: hidden;
  text-shadow: 0 0 8px #00ff00;
`

const InputLine = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  color: #00ff00;
  font-family: 'Courier New', monospace;
`

const Prompt = styled.span`margin-right: 0.5rem;`
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

// ———————————————— menu now just outside the terminal ————————————————

const MenuLinks = styled.div`
  position: absolute;
  top: 1rem;
  right: -6rem;            /* move outside the right border */
  z-index: 3;              /* ensure it's above other layers */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: auto;
`

const MenuLink = styled.span`
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: ${props => (props.active ? '#00ff00' : '#00ff00aa')};
  text-decoration: ${props => (props.active ? 'underline' : 'none')};
  &:hover {
    color: #00ff00;
    text-decoration: underline;
  }
`

// ————————————————— SectionComponent —————————————————

function SectionComponent({ id, lines, img, onCommand, currentSection }) {
  const [count, setCount]     = useState(0)
  const [started, setStarted] = useState(false)
  const [input, setInput]     = useState('')
  const sectionRef = useRef()
  const contentRef = useRef()

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          contentRef.current.classList.add('distort')
          setTimeout(() => contentRef.current.classList.remove('distort'), 800)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started || count >= lines.length) return
    const t = setTimeout(() => setCount(c => c + 1), 200)
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
    <Section id={`${id}-section`} ref={sectionRef}>
      <Terminal>
        {/* menu sits just outside the right border */}
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

// ————————————————— App —————————————————

export default function App() {
  const [showImpressum, setShowImpressum] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')

  const sections = [
    { id: 'home',     lines: homeLines,     img: homeImg },
    { id: 'services', lines: servicesLines, img: servicesImg },
    { id: 'about',    lines: aboutLines,    img: aboutImg },
    { id: 'contact',  lines: contactLines,  img: contactImg },
  ]
  const sectionIds = sections.map(s => s.id)

  // scroll-spy to update the active link
  useEffect(() => {
    const onScroll = () => {
      for (let id of sectionIds) {
        const rect = document.getElementById(`${id}-section`).getBoundingClientRect()
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          if (id !== currentSection) setCurrentSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [currentSection, sectionIds])

  function scrollTo(id) {
    document.getElementById(`${id}-section`).scrollIntoView({ behavior: 'smooth' })
  }

  function onCommand(cmd) {
    if (sectionIds.includes(cmd)) scrollTo(cmd)
  }

  // start at top
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <ScrollContainer>
        {sections.map(s => (
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
    </>
  )
}
