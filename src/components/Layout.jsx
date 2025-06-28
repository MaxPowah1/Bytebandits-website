// src/components/Layout.jsx
import React from 'react'

// These already render a <Terminal>
import Home     from '@/pages/Home'
import Services from '@/pages/Services'
import About    from '@/pages/About'
import Contact  from '@/pages/Contact'

// Your section assets
import homeImg     from '@/assets/section-home.png'
import servicesImg from '@/assets/section-services.png'
import aboutImg    from '@/assets/section-about.png'
import contactImg  from '@/assets/section-contact.png'

const sections = [
  { id: 'home',     Component: Home,     image: homeImg },
  { id: 'services', Component: Services, image: servicesImg },
  { id: 'about',    Component: About,    image: aboutImg },
  { id: 'contact',  Component: Contact,  image: contactImg },
]

export default function Layout() {
  return (
    <div
      className="
        h-screen w-screen
        overflow-y-scroll
        snap-y snap-mandatory
        scroll-smooth
        bg-black
      "
    >
      {sections.map(({ id, Component, image }) => (
        <section
          key={id}
          className="
            relative
            h-screen
            snap-start
            flex items-center justify-center
            bg-black
            overflow-visible
          "
        >
          <div className="relative flex items-center justify-center">
            {/* art, full-height to match the terminal */}
            <img
              src={image}
              alt=""
              className="
                absolute top-0 right-full
                h-full
                object-contain
                z-0
                pointer-events-none select-none
              "
            />

            {/* the terminal itself, fixed to 60vw×60vh */}
            <Component />
          </div>
        </section>
      ))}
    </div>
  )
}