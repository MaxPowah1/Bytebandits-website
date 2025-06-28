// src/pages/Impressum.jsx
import React from 'react';
import styled from 'styled-components';
import ImpressumImg from '../assets/section-Impressum.png';

// terminal lines for the “Impressum” section
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
];

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

// pin to bottom-right, no scrollbars
const Modal = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
  width: 320px;
  padding: 1rem;
  padding-left: 5rem;       /* leave space for the image */
  color: #00ff00;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow: hidden;          /* no scrollbars */
`;

// overlap the left border
const Image = styled.img`
  position: absolute;
  top: 1rem;
  left: calc(100% * -0.2);   /* 20% of modal width to the left */
  width: 80px;
  height: auto;
  object-fit: contain;
  border: 2px solid #00ff00;
  border-radius: 4px;
  background: #0d0d0d;
`;

// close button
const CloseButton = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover { color: #ff0000; }
`;

export default function Impressum({ onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <Image src={ImpressumImg} alt="Impressum logo" />
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
      </Modal>
    </Overlay>
  );
}
