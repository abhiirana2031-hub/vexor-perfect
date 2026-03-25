import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const EMAILJS_SERVICE_ID = (import.meta.env.EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID)?.trim() || 'service_vexor';
    const EMAILJS_TEMPLATE_ADMIN = (import.meta.env.EMAILJS_TEMPLATE_ADMIN || process.env.EMAILJS_TEMPLATE_ADMIN)?.trim() || 'template_admin';
    const EMAILJS_TEMPLATE_USER = (import.meta.env.EMAILJS_TEMPLATE_USER || process.env.EMAILJS_TEMPLATE_USER)?.trim() || 'template_user';
    const EMAILJS_PUBLIC_KEY = (import.meta.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY)?.trim() || '4xnG8nB3VIWC5Rxw6';

    const emailjsPayloadAdmin = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ADMIN,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: 'vexoritsolutions@gmail.com',
        from_name: name,
        from_email: email,
        phone: phone || 'N/A',
        subject: subject || 'No Subject',
        message: message
      }
    };

    const emailjsPayloadUser = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_USER,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        from_name: name,
        subject: subject || 'No Subject'
      }
    };

    // 1. Send Admin Email
    const adminRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailjsPayloadAdmin)
    });

    if (!adminRes.ok) {
        const errText = await adminRes.text();
        throw new Error(`EmailJS Admin Error: ${errText}`);
    }

    // 2. Send User Confirmation Email
    const userRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailjsPayloadUser)
    });

    if (!userRes.ok) {
        const errText = await userRes.text();
        console.error("User confirmation email failed, but admin email was sent:", errText);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email", details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
