'use client'

import { motion } from 'framer-motion'

export default function WhatsAppButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Tooltip */}
      <div className="bg-bg border border-white/10 rounded-tactical px-3 py-1.5 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chatea con nosotros
      </div>

      {/* Button with pulse ring */}
      <div className="relative group">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring opacity-60" />

        <a
          href="https://wa.me/34722124321"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden"
          style={{ padding: '12px 18px' }}
        >
          {/* WhatsApp icon */}
          <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.998 0C5.374 0 0 5.374 0 11.998c0 2.117.554 4.101 1.523 5.822L0 24l6.335-1.499c1.659.906 3.559 1.421 5.663 1.421C18.622 23.922 24 18.548 24 11.924 24 5.374 18.622 0 11.998 0zm0 21.818c-1.9 0-3.666-.512-5.175-1.404l-.371-.22-3.84.908.965-3.74-.242-.382a9.755 9.755 0 01-1.499-5.268c0-5.374 4.38-9.741 9.762-9.741 5.374 0 9.741 4.367 9.741 9.741 0 5.375-4.367 9.106-9.341 9.106z" />
          </svg>

          {/* Label text — hidden on small screens */}
          <span className="hidden sm:block text-sm font-semibold whitespace-nowrap">
            ¡Reserva ya!
          </span>
        </a>
      </div>
    </motion.div>
  )
}
