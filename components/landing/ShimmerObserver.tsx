'use client'
import { useEffect } from 'react'

export default function ShimmerObserver() {
  useEffect(() => {
    const restart = (el: Element) => {
      el.classList.remove('shimmer-active')
      void (el as HTMLElement).offsetHeight
      el.classList.add('shimmer-active')
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) restart(e.target)
      }),
      { threshold: 0.4 }
    )

    document.querySelectorAll('.heading-shimmer').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
