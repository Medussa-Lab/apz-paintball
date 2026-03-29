'use client'

import { motion } from 'framer-motion'

const contactItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Campo de juego',
    value: 'Av. Nueva York 33-35, La Zapateira, A Coruña',
    href: 'https://maps.google.com/?q=Av.+Nueva+York+33-35,+A+Coruña',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: 'Teléfonos',
    value: '981 151 871 · 653 101 094 · 722 124 321',
    href: 'tel:981151871',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M11.998 0C5.374 0 0 5.374 0 11.998c0 2.117.554 4.101 1.523 5.822L0 24l6.335-1.499c1.659.906 3.559 1.421 5.663 1.421C18.622 23.922 24 18.548 24 11.924 24 5.374 18.622 0 11.998 0zm0 21.818c-1.9 0-3.666-.512-5.175-1.404l-.371-.22-3.84.908.965-3.74-.242-.382a9.755 9.755 0 01-1.499-5.268c0-5.374 4.38-9.741 9.762-9.741 5.374 0 9.741 4.367 9.741 9.741 0 5.375-4.367 9.106-9.341 9.106z" />
      </svg>
    ),
    label: 'WhatsApp',
    value: '722 124 321',
    href: 'https://wa.me/34722124321',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Email',
    value: 'info@apzpaintball.com',
    href: 'mailto:info@apzpaintball.com',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    label: 'Transporte público',
    value: 'Bus línea 24 · Parada "O Carón"',
    href: null,
  },
]

const schedules = [
  {
    period: 'Verano',
    slots: ['Mañana: 10:00–13:00 / 11:00–14:00', 'Tarde: 15:30–18:30 / 16:00–19:00 / 18:30–21:30'],
  },
  {
    period: 'Invierno',
    slots: ['Mañana: 10:00–13:00 / 11:00–14:00', 'Tarde: 15:30–18:30 / 16:00–19:00'],
  },
]

export default function Contacto() {
  return (
    <section id="contacto" className="relative py-24 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // Cómo llegar
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            EL CAMPO TE <span className="text-accent">ESPERA</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-lg text-lg">
            A 10 minutos del centro de A Coruña. Bus línea 24, coche propio o taxi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: contact + schedule */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Contact items */}
            <ul className="flex flex-col gap-4">
              {contactItems.map((item, i) => (
                <li key={i}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 bg-forest border border-accent/20 rounded-tactical flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-accent group-hover:text-bg transition-all duration-200">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-text-muted text-xs font-display tracking-wide uppercase mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-text text-sm group-hover:text-accent transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-forest border border-accent/20 rounded-tactical flex items-center justify-center flex-shrink-0 text-accent">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-text-muted text-xs font-display tracking-wide uppercase mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-text text-sm">{item.value}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Schedule */}
            <div className="border-t border-white/8 pt-6">
              <h3 className="font-display text-sm tracking-widest text-text mb-4 uppercase">
                Horarios · Abierto todo el año
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schedules.map((s) => (
                  <div key={s.period} className="bg-bg border border-white/8 rounded-tactical p-4">
                    <p className="font-display text-accent text-xs tracking-widest mb-3 uppercase">
                      {s.period}
                    </p>
                    {s.slots.map((slot, i) => (
                      <p key={i} className="text-text-muted text-xs leading-relaxed">
                        {slot}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-[450px] rounded-tactical overflow-hidden border border-white/10"
          >
            <iframe
              src="https://maps.google.com/maps?q=Avenida+Nueva+York+33,+A+Coruña&output=embed&z=15"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.8) invert(0.9) contrast(0.9)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación APZ Paintball"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
