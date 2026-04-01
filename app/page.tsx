import Navbar          from '@/components/landing/Navbar'
import Hero            from '@/components/landing/Hero'
import SobreNosotros   from '@/components/landing/SobreNosotros'
import Experiencia     from '@/components/landing/Experiencia'
import SobrePaintball  from '@/components/landing/SobrePaintball'
import PorQueAPZ       from '@/components/landing/PorQueAPZ'
import Proceso         from '@/components/landing/Proceso'
import Precios         from '@/components/landing/Precios'
import Galeria         from '@/components/landing/Galeria'
import Reservas        from '@/components/landing/Reservas'
import FAQ             from '@/components/landing/FAQ'
import Footer          from '@/components/landing/Footer'
import ChatButton      from '@/components/landing/ChatButton'
import WhatsAppButton  from '@/components/landing/WhatsAppButton'
import FogBackground   from '@/components/landing/FogBackground'

export default function Home() {
  return (
    <>
      <FogBackground />
      <Navbar />
      <main>
        <Hero />
        {/* Gradient bridge: hero fades into unified body background */}
        <div aria-hidden="true" style={{
          height: 140,
          marginTop: -140,
          background: 'linear-gradient(to bottom, transparent, #080807)',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }} />
        <SobreNosotros />
        <PorQueAPZ />
        <SobrePaintball />
        <Experiencia />
        <Proceso />
        <Precios />
        <Galeria />
        <Reservas />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatButton />
    </>
  )
}
