'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isAdmin])

  if (isAdmin) return null

  return (
    <div ref={cursorRef} className="cursor-tactical">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle cx="18" cy="18" r="11" stroke="#FFD000" strokeWidth="1.5" opacity="0.75" />
        {/* Center dot */}
        <circle cx="18" cy="18" r="2" fill="#FFD000" />
        {/* Top line */}
        <line x1="18" y1="2" x2="18" y2="9" stroke="#FFD000" strokeWidth="1.5" strokeLinecap="round" />
        {/* Bottom line */}
        <line x1="18" y1="27" x2="18" y2="34" stroke="#FFD000" strokeWidth="1.5" strokeLinecap="round" />
        {/* Left line */}
        <line x1="2" y1="18" x2="9" y2="18" stroke="#FFD000" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right line */}
        <line x1="27" y1="18" x2="34" y2="18" stroke="#FFD000" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
