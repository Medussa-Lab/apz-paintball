import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Experiencia from '@/components/landing/Experiencia'
import SobrePaintball from '@/components/landing/SobrePaintball'
import PorQueAPZ from '@/components/landing/PorQueAPZ'
import Proceso from '@/components/landing/Proceso'
import Reservas from '@/components/landing/Reservas'
import Precios from '@/components/landing/Precios'
import Galeria from '@/components/landing/Galeria'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'
import ChatButton from '@/components/landing/ChatButton'
import WhatsAppButton from '@/components/landing/WhatsAppButton'
import FogBackground from '@/components/landing/FogBackground'

export default function Home() {
  return (
    <main>
      <FogBackground />
      <Navbar />
      <Hero />
      <Experiencia />
      <SobrePaintball />
      <PorQueAPZ />
      <Proceso />
      <Precios />
      <Galeria />
      <Reservas />
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <ChatButton />
    </main>
  )
}
