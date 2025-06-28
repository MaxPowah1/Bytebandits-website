import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { lines as homeLines }    from './pages/Home';
import { lines as aboutLines }   from './pages/About';
import { lines as contactLines } from './pages/Contact';

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

  /* ── Hide native scrollbars but retain scrolling ── */
  -ms-overflow-style: none;  /* IE & Edge */
  scrollbar-width: none;     /* Firefox */
  &::-webkit-scrollbar {     /* Chrome, Safari, Opera */
    display: none;
  }
`;

const Section = styled.section`
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
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

  &::before {
    content: '';
    position: absolute; inset: 0;
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

const Content = styled.pre`
  flex: 1;
  margin: 0;
  padding: 1rem;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow: hidden;
  text-shadow: 0 0 8px #00ff00;
  position: relative;

  &::after {
    content: '_';
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    animation: blink 1s step-end infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
`;

/**
 * Reveals lines one-by-one once scrolled into view.
 */
function AnimatedContent({ lines, speed = 600 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    ref.current && obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || count >= lines.length) return;
    const t = setTimeout(() => setCount(c => c + 1), speed);
    return () => clearTimeout(t);
  }, [started, count, lines.length, speed]);

  return (
    <Content ref={ref}>
      {lines.slice(0, count).join('\n')}
    </Content>
  );
}

const sections = [
  { id: 'home',     lines: homeLines,     img: homeImg },
  { id: 'services', lines: ['$ echo "Services coming soon…"'], img: servicesImg },
  { id: 'about',    lines: aboutLines,    img: aboutImg },
  { id: 'contact',  lines: contactLines,  img: contactImg },
];

export default function App() {
  return (
    <ScrollContainer>
      {sections.map(({ id, lines, img }) => (
        <Section key={id}>
          <Terminal>
            <ImagePanel>
              <img src={img} alt={`${id} illustration`} />
            </ImagePanel>
            <AnimatedContent lines={lines} />
          </Terminal>
        </Section>
      ))}
    </ScrollContainer>
  );
}
