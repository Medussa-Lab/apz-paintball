import { NextRequest, NextResponse } from 'next/server'
import type { ReservaForm } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body: ReservaForm = await req.json()

  const { nombre, telefono, email, fecha, jugadores, modalidad, tipoGrupo, mensaje } = body

  if (!nombre || !telefono || !email || !fecha || !jugadores) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const resendApiKey = process.env.RESEND_API_KEY

  const htmlEmail = `
    <div style="background:#080807;color:#f0ede6;font-family:sans-serif;padding:32px;max-width:600px;margin:0 auto;border:1px solid rgba(255,208,0,0.2);border-radius:2px;">
      <div style="margin-bottom:24px;">
        <h1 style="font-size:24px;color:#FFD000;margin:0 0 4px;letter-spacing:0.1em;">
          🎯 NUEVA SOLICITUD DE RESERVA
        </h1>
        <p style="color:#a09d96;margin:0;font-size:13px;">APZ Paintball · A Coruña</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Nombre', nombre],
          ['Teléfono', telefono],
          ['Email', email],
          ['Fecha deseada', fecha],
          ['Nº jugadores', String(jugadores)],
          ['Modalidad', modalidad],
          ['Tipo de grupo', tipoGrupo === 'adultos' ? 'Solo adultos' : tipoGrupo === 'ninos' ? 'Solo niños' : 'Mixto'],
          ['Mensaje', mensaje || '—'],
        ]
          .map(
            ([key, val]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#a09d96;font-size:13px;width:40%;vertical-align:top;">${key}</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f0ede6;font-size:14px;vertical-align:top;">${val}</td>
          </tr>`
          )
          .join('')}
      </table>
      <div style="margin-top:28px;padding:16px;background:rgba(255,208,0,0.08);border-left:4px solid #FFD000;border-radius:2px;">
        <p style="margin:0;font-size:13px;color:#f0ede6;">Responde a esta solicitud contactando directamente al cliente.</p>
      </div>
      <p style="margin-top:24px;font-size:11px;color:#a09d96;">APZ Paintball · Av. Nueva York 33-35, La Zapateira, A Coruña · info@apzpaintball.com</p>
    </div>
  `

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'APZ Paintball Web <onboarding@resend.dev>',
          to: ['info@apzpaintball.com'],
          subject: `Nueva reserva: ${nombre} — ${jugadores} jugadores el ${fecha}`,
          html: htmlEmail,
          reply_to: email,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        console.error('Resend error:', err)
      }
    } catch (err) {
      console.error('Email send error:', err)
    }
  } else {
    // No API key configured — log to console in development
    console.log('📬 Nueva reserva recibida (sin Resend configurado):', body)
  }

  return NextResponse.json({ success: true, message: 'Solicitud recibida' })
}
