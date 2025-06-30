import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>' // Replace with your verified sender

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body } = await request.json()

    console.log('[SEND-EMAIL] Incoming:', { to, subject, body })
    console.log('[SEND-EMAIL] API Key present:', !!process.env.RESEND_API_KEY)
    console.log('[SEND-EMAIL] FROM_EMAIL:', FROM_EMAIL)

    if (!to || !subject || !body) {
      console.error('[SEND-EMAIL] Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html: body,
    })

    if (error) {
      console.error('[SEND-EMAIL] Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    console.log('[SEND-EMAIL] Success:', data)
    return NextResponse.json({ data, success: true })
  } catch (err) {
    console.error('[SEND-EMAIL] Exception:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
} 