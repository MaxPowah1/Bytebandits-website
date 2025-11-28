// src/components/SplashScreen.jsx
import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import SplashVideo from '../assets/Splash.mp4'

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  45% { opacity: 0.98; }
  46% { opacity: 0.8; }
  47% { opacity: 1; }
  92% { opacity: 0.99; }
`

const glitch = keyframes`
  0% { transform: translate3d(0,0,0); }
  25% { transform: translate3d(-1px, -1px, 0); }
  26% { transform: translate3d(1px, 1px, 0); }
  52% { transform: translate3d(0.5px, -0.5px, 0); }
  53% { transform: translate3d(-0.5px, 0.5px, 0); }
  100% { transform: translate3d(0,0,0); }
`

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`

const Container = styled.div.withConfig({
  shouldForwardProp: prop => prop !== '$fade'
})`
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(0,255,148,0.12), transparent 55%),
    radial-gradient(circle at 70% 10%, rgba(255,77,184,0.2), transparent 50%),
    #000305;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: ${({ $fade }) => ($fade ? 0 : 1)};
  transition: opacity 1s ease;
  animation: ${flicker} 6s linear infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 255, 148, 0.02) 0,
      rgba(0, 255, 148, 0.02) 2px,
      transparent 2px,
      transparent 4px
    );
    mix-blend-mode: screen;
    pointer-events: none;
    opacity: 0.65;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.6));
    pointer-events: none;
  }
`

const VideoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: 100%;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 120px 60px black;
    pointer-events: none;
    z-index: 2;
  }
`

const Video = styled.video`
  position: relative;
  z-index: 1;
  width: auto;
  height: 100%;
  object-fit: contain;
  filter: contrast(1.05) saturate(1.1);
  animation: ${glitch} 4.5s steps(2) infinite;
`

const UIOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.65)
  );

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 3rem;
    padding-bottom: 1rem;
  }
`

const StatusLine = styled.div`
  white-space: pre-wrap;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(0, 255, 148, 0.8);
  letter-spacing: 0.05em;

  &::after {
    content: '▌';
    margin-left: 0.35rem;
    animation: ${blink} 0.9s steps(1) infinite;
  }
`

const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(0,255,0,0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: inset 0 0 12px rgba(0,255,148,0.4);
`

const ProgressBar = styled.div`
  width: ${({ pct }) => pct}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 255, 148, 0.1),
    #00ff94 40%,
    rgba(255, 77, 184, 0.9)
  );
  transition: width 0.1s linear;
  box-shadow: 0 0 15px rgba(0,255,148,0.8);
`

const OverlayFooter = styled.div`
  margin-top: auto;
`

const SkipWrapper = styled.div`
  align-self: flex-end;
`

const SkipButton = styled.button`
  padding: 0.35rem 1rem;
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.75);
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 12px rgba(0,255,148,0.4);

  &:hover:not(:disabled) {
    background: #00ff00;
    color: #030303;
    box-shadow: 0 0 16px rgba(0,255,148,0.7);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

const DiagnosticGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
`

const DiagnosticCell = styled.div`
  padding: 0.35rem 0.5rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 255, 148, 0.2);
  border-radius: 4px;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const CellLabel = styled.span`
  font-size: 0.65rem;
  color: rgba(0, 255, 148, 0.6);
`

const CellValue = styled.span`
  font-size: 0.85rem;
`

export default function SplashScreen({ onFinish }) {
  const videoRef = useRef()
  const fallbackTimerRef = useRef()
  const [fade, setFade] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [bootId] = useState(
    () =>
      '0x' +
      Math.random()
        .toString(16)
        .slice(2, 10)
        .toUpperCase()
  )

  const statusLines = [
    '[00:00:01] INIT >> Injecting shellcode…',
    '[00:00:03] CORE >> Bypassing ICE lattice…',
    '[00:00:07] GRID >> Decrypting nexus mainframe…',
    '[00:00:11] LINK >> Uploading payload…',
    '[00:00:13] SEAL >> Establishing Bytebandits uplink…',
    '[00:00:16] COMPLETE >> Access granted.'
  ]

  const diagCells = [
    { label: 'Node', value: 'BB-NEXUS/42' },
    { label: 'Cipher', value: 'AES-512/QKD' },
    { label: 'Signal', value: bootId },
    { label: 'Latency', value: progress < 99 ? '7ms·stabilizing' : 'LOCK' }
  ]

  useEffect(() => {
    const video = videoRef.current
    let rafId

    video.play().catch(() => {
      // mobile browsers sometimes block autoplay, ensure progress still advances
      setProgress(p => (p > 95 ? p : p + 5))
    })

    function update() {
      setProgress(prev => {
        const hasDuration =
          video.duration && Number.isFinite(video.duration) && video.duration > 0
        const nextPct = hasDuration
          ? (video.currentTime / video.duration) * 100
          : Math.min(prev + 0.4, 99)

        setCurrentLine(c => {
          const step = 100 / statusLines.length
          const next = Math.floor(nextPct / step)
          return next > c && next < statusLines.length ? next : c
        })

        return nextPct
      })

      if (!video.ended) rafId = requestAnimationFrame(update)
    }

    function onPlay() {
      rafId = requestAnimationFrame(update)
    }

    function onEnded() {
      setFade(true)
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = undefined
      }
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('ended', onEnded)
    fallbackTimerRef.current = setTimeout(() => {
      setFade(true)
    }, 17000)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('ended', onEnded)
      cancelAnimationFrame(rafId)
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = undefined
      }
    }
  }, [statusLines.length])

  useEffect(() => {
    if (!fade) return
    // Fallback for mobile: ensure we finish even if the transitionend event is missed
    const t = setTimeout(() => {
      onFinish()
    }, 900)
    return () => clearTimeout(t)
  }, [fade, onFinish])

  function handleSkip() {
    if (fade) return
    const video = videoRef.current
    if (video) {
      video.pause()
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = undefined
    }
    setCurrentLine(statusLines.length - 1)
    setProgress(100)
    setFade(true)
  }

  return (
    <Container $fade={fade}>
      <VideoWrapper>
        <Video ref={videoRef} src={SplashVideo} muted playsInline />
      </VideoWrapper>

      <UIOverlay>
        <SkipWrapper>
          <SkipButton type="button" onClick={handleSkip} disabled={fade}>
            Skip intro
          </SkipButton>
        </SkipWrapper>
        <DiagnosticGrid>
          {diagCells.map(cell => (
            <DiagnosticCell key={cell.label}>
              <CellLabel>{cell.label}</CellLabel>
              <CellValue>{cell.value}</CellValue>
            </DiagnosticCell>
          ))}
        </DiagnosticGrid>
        <OverlayFooter>
          <StatusLine>
            {statusLines.slice(0, currentLine + 1).join('\n')}
          </StatusLine>
          <ProgressContainer>
            <ProgressBar pct={progress} />
          </ProgressContainer>
        </OverlayFooter>
      </UIOverlay>
    </Container>
  )
}
