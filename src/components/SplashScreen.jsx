// src/components/SplashScreen.jsx
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SplashVideo from '../assets/Splash.mp4'

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
  opacity: ${({ $fade }) => ($fade ? 0 : 1)};
  transition: opacity 1s ease;
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
`

const UIOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  pointer-events: none;

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

export default function SplashScreen({ onFinish }) {
  const videoRef = useRef()
  const [fade, setFade] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [progress, setProgress] = useState(0)

  const statusLines = [
    'Initializing modules…',
    'Decrypting payload…',
    'Loading assets…',
    'Finalizing…'
  ]

  useEffect(() => {
    const video = videoRef.current
    let rafId

    video.play().catch(() => {})

    function update() {
      const pct = (video.currentTime / video.duration) * 100
      setProgress(pct)

      setCurrentLine(c => {
        const step = 100 / statusLines.length
        const next = Math.floor(pct / step)
        return next > c && next < statusLines.length ? next : c
      })

      if (!video.ended) rafId = requestAnimationFrame(update)
    }

    function onPlay() {
      rafId = requestAnimationFrame(update)
    }

    function onEnded() {
      setFade(true)
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('ended', onEnded)
      cancelAnimationFrame(rafId)
    }
  }, [])

  function handleTransitionEnd(e) {
    if (e.propertyName === 'opacity' && fade) {
      onFinish()
    }
  }

  return (
    <Container $fade={fade} onTransitionEnd={handleTransitionEnd}>
      <VideoWrapper>
        <Video ref={videoRef} src={SplashVideo} muted playsInline />
      </VideoWrapper>

      <UIOverlay>
        <StatusLine>
          {statusLines.slice(0, currentLine + 1).join('\n')}
        </StatusLine>
        <ProgressContainer>
          <ProgressBar pct={progress} />
        </ProgressContainer>
      </UIOverlay>
    </Container>
  )
}
