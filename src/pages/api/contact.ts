import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const appPassword = import.meta.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
    if (!appPassword) {
      console.error("Missing GMAIL_APP_PASSWORD environment variable");
      return new Response(JSON.stringify({ error: "Server Configuration Error: Missing Email Password" }), { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vexoritsolutions@gmail.com',
        pass: appPassword.trim(),
      },
    });

    // 1. Send Admin Notification Email
    await transporter.sendMail({
      from: '"Vexora Contact" <vexoritsolutions@gmail.com>',
      to: 'vexoritsolutions@gmail.com',
      replyTo: email,
      subject: `New Contact Inquiry: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00BFFF;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `
    });

    // 2. Send User Confirmation Email
    await transporter.sendMail({
      from: '"Vexor IT Solutions" <vexoritsolutions@gmail.com>',
      to: email,
      subject: `Thank you for contacting Vexor IT Solutions`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00BFFF;">Thank you, ${name}!</h2>
          <p>We have successfully received your message. Our team will review your inquiry and get back to you shortly.</p>
          <br>
          <p>Your message summary:</p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #00BFFF; margin-left: 0;">
            ${message}
          </blockquote>
          <br>
          <p>Best Regards,</p>
          <p><strong>Vexor IT Solutions Team</strong></p>
          <p><a href="https://vexor-it-solutions.onrender.com" style="color: #00BFFF;">Visit our website</a></p>
        </div>
      `
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email", details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
