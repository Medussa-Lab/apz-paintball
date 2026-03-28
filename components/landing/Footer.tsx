'use client'

import Image from 'next/image'

const navLinks = [
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Sobre Paintball', href: '#sobre-paintball' },
  { label: 'Reservas', href: '#reservas' },
  { label: 'Precios', href: '#precios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/apzpaintball',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/apzpaintball',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@apzpaintball',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
      </svg>
    ),
  },
]

export default function Footer() {
  const handleLink = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-bg border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Main row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="APZ Paintball"
              width={72}
              height={72}
              className="object-contain"
              unoptimized
            />
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              El campo de paintball más grande de Galicia. 20.000m² de bosque en La Zapateira, A Coruña.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 border border-white/12 rounded-tactical flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/50 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="font-display text-xs tracking-[0.25em] text-text-muted uppercase mb-5">Secciones</p>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLink(link.href)}
                  className="text-text-muted text-sm hover:text-accent transition-colors text-left w-fit"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-xs tracking-[0.25em] text-text-muted uppercase mb-5">Contacto</p>
            <div className="flex flex-col gap-3 text-sm text-text-muted">
              <a href="tel:722124321" className="hover:text-accent transition-colors">722 124 321</a>
              <a href="tel:981151871" className="hover:text-accent transition-colors">981 151 871</a>
              <a href="mailto:info@apzpaintball.com" className="hover:text-accent transition-colors">info@apzpaintball.com</a>
              <span>Av. Nueva York 33-35, A Coruña</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-text-muted text-xs">
          <p>© 2025 APZ Paintball · A Coruña · Todos los derechos reservados</p>
          <p>IVA 21% incluido en todos los precios</p>
        </div>
      </div>
    </footer>
  )
}
