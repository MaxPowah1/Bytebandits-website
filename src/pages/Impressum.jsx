// src/pages/Impressum.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import ImpressumImg from '../assets/section-Impressum.png'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Modal = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 0.5rem;
  box-shadow: 0 0 1.25rem rgba(0,255,0,0.6);

  width: clamp(280px, 90vw, 640px);
  padding: clamp(1rem, 2vw, 2rem);

  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  line-height: 1.4;
  white-space: pre-wrap;
  overflow: visible;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 92vw;
    max-height: 88vh;
    padding: 1rem;
  }
`

const Logo = styled.img`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(-55%, -50%);
  z-index: 1001;
  width: clamp(6rem, 20vw, 16rem);
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin: 0 auto 0.75rem;
    width: 7rem;
  }
`

const Content = styled.div`
  margin-left: clamp(2.5rem, 10vw, 8rem);
  flex: 1;
  overflow-y: auto;
  max-height: 80vh;
  position: relative;
  z-index: 0;

  @media (max-width: 768px) {
    margin-left: 0;
    max-height: 60vh;
  }
`

const CloseButton = styled.span`
  position: absolute;
  top: 0.5rem; right: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #ff0000; }
`

const RevealEmail = () => {
  const [visible, setVisible] = useState(false)
  const emailUser = 'max'
  const emailDomain = 'byte-bandits.com'
  const email = `${emailUser}@${emailDomain}`

  return (
    <div>
      {!visible ? (
        <button
          onClick={() => setVisible(true)}
          style={{
            background: 'transparent',
            color: '#00ff00',
            border: '1px solid #00ff00',
            padding: '0.3rem 0.6rem',
            fontFamily: 'Courier New, monospace',
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}
        >
          Show email
        </button>
      ) : (
        <a
          href={`mailto:${email}`}
          style={{ color: '#00ff00', textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' }}
        >
          {email}
        </a>
      )}
    </div>
  )
}

export default function Impressum({ onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Logo src={ImpressumImg} alt="Logo" />
        <CloseButton onClick={onClose}>✕</CloseButton>
        <Content>
{`
Impressum

Bytebandits OÜ
Tartu mnt 67/1-13b, Kesklinna linnaosa
Tallinn 10115, Eesti

Management Board: M. Scherb

Kontakt:`}
          <RevealEmail />
{`
Registration code: 17265228
Registered with Harju County Court

VAT ID (KMKR): The legal entity is not liable for VAT registration.
`.trim()}
        </Content>
      </Modal>
    </Overlay>
  )
}
