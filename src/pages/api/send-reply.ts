import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Try both import.meta.env for Astro and process.env for Node/Vercel
    const appPassword = import.meta.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
    
    if (!appPassword) {
      return new Response(JSON.stringify({ error: 'Server email configuration missing (GMAIL_APP_PASSWORD not set)' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vexoritsolutions@gmail.com',
        // Remove spaces cleanly just in case
        pass: appPassword.replace(/\s+/g, '')
      }
    });

    await transporter.sendMail({
      from: '"Vexora IT Solutions" <vexoritsolutions@gmail.com>',
      to: to,
      subject: subject || 'Reply from Vexora IT Solutions',
      text: message,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;"/>
          <p style="font-size: 0.85em; color: #777;">
            <strong>Vexora IT Solutions</strong><br/>
            Contact: vexoritsolution@gmail.com<br/>
            Phone: +91 75995 44335
          </p>
        </div>
      `
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Backend email sending failed:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred while sending the email' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
