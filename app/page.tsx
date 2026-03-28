import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Experiencia from '@/components/landing/Experiencia'
import SobrePaintball from '@/components/landing/SobrePaintball'
import PorQueAPZ from '@/components/landing/PorQueAPZ'
import Reservas from '@/components/landing/Reservas'
import Precios from '@/components/landing/Precios'
import Galeria from '@/components/landing/Galeria'
import FAQ from '@/components/landing/FAQ'
import Contacto from '@/components/landing/Contacto'
import Footer from '@/components/landing/Footer'
import ChatButton from '@/components/landing/ChatButton'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Experiencia />
      <SobrePaintball />
      <PorQueAPZ />
      <Reservas />
      <Precios />
      <Galeria />
      <FAQ />
      <Contacto />
      <Footer />
      <ChatButton />
    </main>
  )
}
