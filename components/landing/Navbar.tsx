'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Nosotros',   href: '#sobre-nosotros' },
  { label: 'Modalidades', href: '#experiencia' },
  { label: 'Galería',    href: '#galeria' },
  { label: 'Precios',    href: '#precios' },
  { label: 'Por qué APZ', href: '#por-que-apz' },
  { label: 'FAQ',        href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="APZ Paintball - Inicio"
          >
            <Image
              src="/logo.png"
              alt="APZ Paintball"
              width={72}
              height={72}
              className="object-contain"
              priority
              unoptimized
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLink(link.href)}
                className="text-text-muted hover:text-text text-sm font-medium tracking-wide transition-colors duration-150"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLink('#reservas')}
              className="hidden md:block btn-tactical px-5 py-2 text-sm font-display tracking-widest"
            >
              RESERVAR
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1 focus:outline-none"
              aria-label="Menú"
            >
              <span
                className={`block w-6 h-0.5 bg-text transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`block w-6 h-0.5 bg-text transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-6 h-0.5 bg-text transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleLink(link.href)}
                className="text-3xl font-display tracking-widest text-text hover:text-accent transition-colors"
              >
                {link.label.toUpperCase()}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.07 }}
              onClick={() => handleLink('#reservas')}
              className="btn-tactical px-8 py-3 text-lg font-display tracking-widest mt-4"
            >
              RESERVAR PARTIDA
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
