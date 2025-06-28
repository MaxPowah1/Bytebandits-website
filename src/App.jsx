import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

import { lines as homeLines }     from './pages/Home';
import { lines as servicesLines } from './pages/Services';
import { lines as aboutLines }    from './pages/About';
import { lines as contactLines }  from './pages/Contact';
import { lines as footerLines }   from './pages/Footer';

import homeImg     from './assets/section-home.png';
import servicesImg from './assets/section-services.png';
import aboutImg    from './assets/section-about.png';
import contactImg  from './assets/section-contact.png';

// Hide native scrollbars but keep scroll
const ScrollContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  background-color: #121212;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Section = styled.section`
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// glitch keyframes
const glitchAnim = keyframes`
  0%   { clip: rect(10px, 9999px, 115px, 0); transform: translate(0); }
  20%  { clip: rect(20px, 9999px,  90px, 0); transform: translate(-2px, -2px); }
  40%  { clip: rect(80px, 9999px, 140px, 0); transform: translate(2px, 2px); }
  60%  { clip: rect(30px, 9999px, 100px, 0); transform: translate(-2px, 2px); }
  80%  { clip: rect(50px, 9999px, 130px, 0); transform: translate(2px, -2px); }
  100% { clip: rect(10px, 9999px, 115px, 0); transform: translate(0); }
`;

const Terminal = styled.div`
  position: relative;
  display: flex;
  width: 80vw;    max-width: 800px;
  height: 60vh;   max-height: 600px;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
  overflow: visible;

  /* scanlines overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0,255,0,0.04) 0px,
      rgba(0,255,0,0.04) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  &.glitch {
    animation: ${glitchAnim} 0.4s ease-in-out;
  }
`;

const ImagePanel = styled.div`
  flex: 0 0 200px;
  margin-left: -220px;   /* overlap */
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 400px;
    height: auto;
    object-fit: contain;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const LinesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow: hidden;
  text-shadow: 0 0 8px #00ff00;
`;

const InputLine = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  color: #00ff00;
  font-family: 'Courier New', monospace;
`;

const Prompt = styled.span`margin-right: 0.5rem;`;
const CommandInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  outline: none;
`;

/**
 * SectionComponent handles:
 * - glitch/scanline animation on enter
 * - line-by-line reveal
 * - a CLI prompt that only autofocuses Home
 */
function SectionComponent({ id, lines, img, onCommand }) {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const [input, setInput]     = useState('');
  const sectionRef = useRef();
  const termRef    = useRef();

  useEffect(() => {
    // Scroll glitch observer
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          termRef.current.classList.add('glitch');
          setTimeout(() => termRef.current.classList.remove('glitch'), 400);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    sectionRef.current && obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || count >= lines.length) return;
    const t = setTimeout(() => setCount(c => c + 1), 600);
    return () => clearTimeout(t);
  }, [started, count, lines.length]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim().toLowerCase());
      setInput('');
    }
  }

  return (
    <Section id={`${id}-section`} ref={sectionRef}>
      <Terminal ref={termRef}>
        {img && (
          <ImagePanel>
            <img src={img} alt={`${id} illustration`} />
          </ImagePanel>
        )}
        <Inner>
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
        </Inner>
      </Terminal>
    </Section>
  );
}

export default function App() {
  // ensure we start scrolled at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function onCommand(cmd) {
    const valid = ['home', 'services', 'about', 'contact', 'footer'];
    if (valid.includes(cmd)) {
      document
        .getElementById(`${cmd}-section`)
        .scrollIntoView({ behavior: 'smooth' });
    }
  }

  const sections = [
    { id: 'home',     lines: homeLines,     img: homeImg },
    { id: 'services', lines: servicesLines, img: servicesImg },
    { id: 'about',    lines: aboutLines,    img: aboutImg },
    { id: 'contact',  lines: contactLines,  img: contactImg },
    { id: 'footer',   lines: footerLines,   img: null },
  ];

  return (
    <ScrollContainer>
      {sections.map(s => (
        <SectionComponent
          key={s.id}
          {...s}
          onCommand={onCommand}
        />
      ))}
    </ScrollContainer>
  );
}
