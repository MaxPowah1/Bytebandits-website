import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import About from '@/pages/About'
import Contact from '@/pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
