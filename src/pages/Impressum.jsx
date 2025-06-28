// src/pages/Impressum.jsx
import React from 'react'
import styled from 'styled-components'
import ImpressumImg from '../assets/section-Impressum.png'

export const lines = [
  '$ echo "Impressum"',
  'ByteBandits GmbH',
  'Musterstraße 1',
  '12345 Berlin',
  'Deutschland',
  '',
  'Geschäftsführer: Max Mustermann',
  '',
  'Kontakt:',
  'Telefon: +49 (0)30 1234567',
  'E-Mail: impressum@bytebandits.com',
  '',
  'Handelsregister:',
  'Amtsgericht Berlin Charlottenburg',
  'HRB 123456',
  '',
  'Umsatzsteuer-ID:',
  'DE123456789',
]

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`

const Modal = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: flex-start;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 0.5rem;
  box-shadow: 0 0 1.25rem rgba(0,255,0,0.6);

  /* fluid width: never below 280px, ideal 25vw, max 600px */
  width: clamp(280px, 25vw, 600px);
  padding: clamp(1rem, 2vw, 2rem);

  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  line-height: 1.4;
  white-space: pre-wrap;
  overflow: visible;
`

const Logo = styled.img`
  position: absolute;
  top: 50%;                         /* halfway down the modal */
  left: 0%;                         /* exactly on the left edge */
  transform: translate(-55%, -50%); /* move its own center to that point */
  z-index: 1001;                    /* above overlay & content */
  width: clamp(6rem, 20vw, 16rem);  /* min 6rem, ideal 20vw, max 16rem */
  height: auto;
  object-fit: contain;
`

const Content = styled.div`
  margin-left: clamp(2.5rem, 10vw, 8rem); /* make room for half the logo */
  flex: 1;
  overflow-y: auto;
  max-height: 80vh;
  position: relative;
  z-index: 0;
`

const CloseButton = styled.span`
  position: absolute;
  top: 0.5rem; right: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #ff0000; }
`

export default function Impressum({ onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Logo src={ImpressumImg} alt="Logo" />
        <CloseButton onClick={onClose}>✕</CloseButton>
        <Content>
{`
ByteBandits GmbH
Musterstraße 1
12345 Berlin
Deutschland

Geschäftsführer: Max Mustermann

Kontakt:
Telefon: +49 (0)30 1234567
E-Mail: impressum@bytebandits.com

Handelsregister:
Amtsgericht Berlin Charlottenburg
HRB 123456

Umsatzsteuer-ID:
DE123456789
`.trim()}
        </Content>
      </Modal>
    </Overlay>
  )
}
