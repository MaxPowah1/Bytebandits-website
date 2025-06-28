// src/App.jsx
import React from 'react';
import styled from 'styled-components';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import homeImg from './assets/section-home.png';
import servicesImg from './assets/section-services.png';
import aboutImg from './assets/section-about.png';
import contactImg from './assets/section-contact.png';

const ScrollContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  background-color: #242424;
`;

const Section = styled.section`
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/*
  Terminal wrapper is relative & visible overflow so
  our image can poke out of its left side.
*/
const Terminal = styled.div`
  position: relative;
  display: flex;
  width: 80vw;
  max-width: 800px;
  height: 60vh;
  max-height: 600px;
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  overflow: visible;
`;

/*
  Sidebar panel is now wider, shifted left with a negative margin,
  and sits above the terminal border with a higher z-index.
*/
const ImagePanel = styled.div`
  flex: 0 0 200px;
  margin-left: -220px;   /* overlap amount */
  z-index: 2;           /* sit on top of terminal border */
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 400px;       /* bigger image */
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
  overflow: auto;
`;

const sections = [
  { id: 'home',     Component: Home,     img: homeImg },
  { id: 'services', Component: () => <>$ echo "Services"</>, img: servicesImg },
  { id: 'about',    Component: About,    img: aboutImg },
  { id: 'contact',  Component: Contact,  img: contactImg },
];

export default function App() {
  return (
    <ScrollContainer>
      {sections.map(({ id, Component, img }) => (
        <Section key={id}>
          <Terminal>
            <ImagePanel>
              <img src={img} alt={`${id} icon`} />
            </ImagePanel>
            <Content>
              <Component />
            </Content>
          </Terminal>
        </Section>
      ))}
    </ScrollContainer>
  );
}
