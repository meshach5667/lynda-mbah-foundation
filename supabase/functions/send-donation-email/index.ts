
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SITE_URL = Deno.env.get('SITE_URL') || 'https://lyndambahfoundation.org'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  name: string;
  email: string;
  amount: number;
  projectName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, amount, projectName } = await req.json() as EmailData

    // Create email content
    const subject = 'Thank You for Your Donation - Lynda Mbah Foundation'
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank You for Your Donation!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your generous donation of ₦${amount.toLocaleString()} to the Lynda Mbah Foundation${projectName ? ` - ${projectName}` : ''}.</p>
        <p>Your support helps us continue our mission of empowering communities and creating lasting positive change.</p>
        <p>We will keep you updated on the impact of your contribution.</p>
        <br/>
        <p>Best regards,</p>
        <p>The Lynda Mbah Foundation Team</p>
      </div>
    `

    // Send email using Supabase
    const { error } = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lynda Mbah Foundation <no-reply@lyndambahfoundation.org>',
        to: email,
        subject,
        html: htmlContent,
      }),
    }).then(res => res.json())

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ message: 'Donation confirmation email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
