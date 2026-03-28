import type { Metadata } from 'next'
import { Black_Ops_One, DM_Sans } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/landing/CustomCursor'

const blackOpsOne = Black_Ops_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'APZ Paintball — Campo de Batalla en A Coruña',
  description:
    'El campo de paintball más grande de Galicia. 20.000m² de bosque en La Zapateira, A Coruña. Reserva tu partida online.',
  keywords: ['paintball', 'A Coruña', 'Galicia', 'campo paintball', 'paintball nocturno', 'paintball infantil', 'team building'],
  openGraph: {
    title: 'APZ Paintball — A Coruña',
    description: '20.000m² de bosque. Adrenalina real.',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${blackOpsOne.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-text font-body antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
