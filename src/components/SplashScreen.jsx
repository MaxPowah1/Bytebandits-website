// src/components/SplashScreen.jsx
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SplashVideo from '../assets/Splash.mp4'

// filter out our transient prop
const Container = styled.div.withConfig({
  shouldForwardProp: prop => prop !== '$fade'
})`
  position: fixed;
  inset: 0;
  background: black;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* fade transition */
  opacity: ${({ $fade }) => ($fade ? 0 : 1)};
  transition: opacity 1s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;

    /* blur what's behind (the video) */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    /* only show that blur near the edges */
    mask-image: radial-gradient(
      circle at center,
      transparent 80%,
      black 100%
    );
    mask-mode: alpha;
  }
`

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`

// -- New overlay UI elements --

const UIOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  pointer-events: none;
`

const StatusLine = styled.div`
  white-space: pre-wrap;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`

const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(0,255,0,0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
`

const ProgressBar = styled.div`
  width: ${({ pct }) => pct}%;
  height: 100%;
  background: #00ff00;
  transition: width 0.1s linear;
`

const SkipPrompt = styled.div`
  align-self: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: auto;
`

export default function SplashScreen({ onFinish }) {
  const videoRef = useRef()
  const [fade, setFade] = useState(false)

  // UI overlay state
  const statusLines = [
    'Initializing modules…',
    'Decrypting payload…',
    'Loading assets…',
    'Finalizing…'
  ]
  const [currentLine, setCurrentLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    video.play().catch(() => {
      /* autoplay blocked */
    })

    function onTimeUpdate() {
      const pct = (video.currentTime / video.duration) * 100
      setProgress(pct)

      const next = Math.floor((pct / 100) * statusLines.length)
      if (next > currentLine && next < statusLines.length) {
        setCurrentLine(next)
      }

      if (video.currentTime > 3 && !showSkip) {
        setShowSkip(true)
      }
    }

    function onEnded() {
      setFade(true)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [currentLine, showSkip])

  // allow skipping early
  useEffect(() => {
    function skip() {
      setFade(true)
    }

    if (showSkip && !fade) {
      window.addEventListener('keydown', skip)
      window.addEventListener('click', skip)
      return () => {
        window.removeEventListener('keydown', skip)
        window.removeEventListener('click', skip)
      }
    }
  }, [showSkip, fade])

  function handleTransitionEnd(e) {
    if (e.propertyName === 'opacity' && fade) {
      onFinish()
    }
  }

  return (
    <Container $fade={fade} onTransitionEnd={handleTransitionEnd}>
      <Video
        ref={videoRef}
        src={SplashVideo}
        muted
        playsInline
      />

      <UIOverlay>
        <StatusLine>
          {statusLines.slice(0, currentLine + 1).join('\n')}
        </StatusLine>

        <ProgressContainer>
          <ProgressBar pct={progress} />
        </ProgressContainer>

        <SkipPrompt show={showSkip}>
          Press any key or click to skip…
        </SkipPrompt>
      </UIOverlay>
    </Container>
  )
}
