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

/* bold distortion keyframes */
const distort = keyframes`
  0%   { transform: none; filter: none; }
  10%  { transform: skew(3deg,1deg) translate(2px,-2px); filter: blur(1px) hue-rotate(10deg); }
  30%  { transform: skew(-2deg,2deg) translate(-2px,2px); filter: blur(2px) hue-rotate(-10deg); }
  50%  { transform: skew(1deg,-3deg) translate(3px,1px); filter: blur(1.5px) hue-rotate(5deg); }
  70%  { transform: skew(-1deg,1deg) translate(-1px,-3px); filter: blur(1px) hue-rotate(-5deg); }
  100% { transform: none; filter: none; }
`;

const Terminal = styled.div`
  position: relative;
  display: flex;
  width: 80vw;    max-width: 800px;
  height: 60vh;   max-height: 600px;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,255,0,0.6);
  overflow: visible;

  /* scanlines overlay stays static */
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
`;

// New wrapper for text + input, where we apply distortion
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &.distort {
    animation: ${distort} 0.8s ease-in-out 1;
  }
`;

const ImagePanel = styled.div`
  flex: 0 0 200px;
  margin-left: -220px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  img { width: 400px; height: auto; object-fit: contain; }
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

function SectionComponent({ id, lines, img, onCommand }) {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const [input, setInput]     = useState('');
  const sectionRef = useRef();
  const contentRef = useRef();  // <- now targets <Content>

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          contentRef.current.classList.add('distort');
          setTimeout(() => contentRef.current.classList.remove('distort'), 800);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
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
      <Terminal>
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
  );
}

export default function App() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  function onCommand(cmd) {
    const valid = ['home','services','about','contact','footer'];
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
