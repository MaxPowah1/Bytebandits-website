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
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
`

export default function SplashScreen({ onFinish }) {
  const videoRef = useRef()
  const [fade, setFade] = useState(false)

  useEffect(() => {
    videoRef.current
      .play()
      .catch(() => {
        /* autoplay blocked */
      })
  }, [])

  function handleEnded() {
    setFade(true)
  }

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
        onEnded={handleEnded}
      />
    </Container>
  )
}
