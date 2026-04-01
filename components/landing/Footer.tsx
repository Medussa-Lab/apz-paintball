'use client'
import Image from 'next/image'

const navLinks = [
  { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { label: 'Modalidades',    href: '#experiencia' },
  { label: 'El Deporte',     href: '#sobre-paintball' },
  { label: 'Proceso',        href: '#proceso' },
  { label: 'Precios',        href: '#precios' },
  { label: 'Galería',        href: '#galeria' },
  { label: 'Reservas',       href: '#reservas' },
  { label: 'FAQ',            href: '#faq' },
]

export default function Footer() {
  const handleLink = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-accent/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Col 1 — Logo + CTA */}
          <div className="flex flex-col gap-6">
            <Image src="/logo.png" alt="APZ Paintball" width={68} height={68} className="object-contain" unoptimized />
            <p className="text-text/40 text-sm leading-relaxed font-body">
              El campo de paintball más grande de Galicia. 20.000m² de bosque en La Zapateira, A Coruña.
            </p>
            <button
              onClick={() => handleLink('#reservas')}
              className="btn-tactical w-fit px-6 py-3 text-xs tracking-widest"
            >
              RESERVAR AHORA
            </button>
            {/* Instagram */}
            <a
              href="https://instagram.com/apzpaintball"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-accent/30 flex items-center justify-center text-accent/70 hover:text-accent hover:bg-accent/10 hover:border-accent/60 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Col 2 — Navegación */}
          <div>
            <p className="font-display text-[0.65rem] tracking-[0.25em] text-text/30 uppercase mb-6">Navegación</p>
            <nav className="flex flex-col gap-3">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleLink(link.href)}
                  className="text-text/45 text-sm hover:text-accent transition-colors text-left w-fit font-body"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Col 3 — Contacto */}
          <div>
            <p className="font-display text-[0.65rem] tracking-[0.25em] text-text/30 uppercase mb-6">Contacto</p>
            <div className="flex flex-col gap-3 text-sm text-text/45 font-body">
              <a href="tel:981151871" className="hover:text-accent transition-colors">981 151 871</a>
              <a href="tel:653101094" className="hover:text-accent transition-colors">653 101 094</a>
              <a href="tel:722124321" className="hover:text-accent transition-colors">722 124 321</a>
              <a href="mailto:info@apzpaintball.com" className="hover:text-accent transition-colors">info@apzpaintball.com</a>
              <span className="text-text/25 text-xs leading-relaxed mt-2">
                Av. Nueva York 33-35<br />La Zapateira, A Coruña
              </span>
            </div>
          </div>

          {/* Col 4 — Ubicación */}
          <div>
            <p className="font-display text-[0.65rem] tracking-[0.25em] text-text/30 uppercase mb-6">Ubicación</p>
            <div className="rounded-tactical overflow-hidden border border-white/[0.06] mb-3" style={{ height: 160 }}>
              <iframe
                title="APZ Paintball"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2898.3569812345678!2d-8.449400!3d43.356700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2e7c000000000%3A0x0!2sAv.+Nueva+York+33-35%2C+15008+A+Coru%C3%B1a!5e0!3m2!1ses!2ses!4v1"
                width="100%"
                height="160"
                style={{ border: 0, filter: 'grayscale(1) brightness(0.5) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/GsPu9yExTn1DiCJx5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent/70 text-xs hover:text-accent transition-colors font-body"
            >
              Ver en Google Maps →
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-text/25 text-xs font-body">
          <p>© 2025 APZ Paintball · A Coruña · Todos los derechos reservados</p>
          <p>IVA 21% incluido en todos los precios</p>
        </div>

      </div>
    </footer>
  )
}
