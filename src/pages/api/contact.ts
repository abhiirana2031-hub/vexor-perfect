import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { serverEnv } from "@/lib/env-server";

export const prerender = false;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function normalizeMailPassword(secret: string | undefined): string | undefined {
  if (!secret?.trim()) return undefined;
  return secret.replace(/\s+/g, "");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]!);
}

function createMailer() {
  const smtpHost = serverEnv("SMTP_HOST");
  const smtpUser = serverEnv("SMTP_USER");
  const smtpPass = normalizeMailPassword(
    serverEnv("SMTP_PASS") ?? serverEnv("GMAIL_APP_PASSWORD"),
  );
  const smtpPort = Number(serverEnv("SMTP_PORT") ?? "587");
  const smtpSecure = serverEnv("SMTP_SECURE") === "true" || smtpPort === 465;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  const gmailPass =
    normalizeMailPassword(serverEnv("GMAIL_APP_PASSWORD")) ?? smtpPass;
  const gmailUser = serverEnv("GMAIL_USER") ?? smtpUser;

  if (
    gmailPass &&
    gmailUser &&
    gmailPass !== "your-app-password-here"
  ) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  return null;
}

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: ContactFormData = await request.json();

    if (!body.name || !body.email || !body.message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contactsDir = path.join(process.cwd(), "contacts");
    if (!fs.existsSync(contactsDir)) {
      fs.mkdirSync(contactsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const contactData = {
      timestamp,
      name: body.name,
      email: body.email,
      phone: body.phone || "N/A",
      subject: body.subject || "No subject",
      message: body.message,
    };

    const contactsFile = path.join(contactsDir, `contacts.json`);
    let contacts: unknown[] = [];

    if (fs.existsSync(contactsFile)) {
      try {
        contacts = JSON.parse(
          fs.readFileSync(contactsFile, "utf-8"),
        ) as unknown[];
      } catch {
        contacts = [];
      }
    }

    contacts.push(contactData);
    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

    const mailFrom =
      serverEnv("MAIL_FROM") ??
      serverEnv("GMAIL_USER") ??
      serverEnv("SMTP_USER");
    const mailTo =
      serverEnv("MAIL_TO") ?? mailFrom;

    let emailSent = false;
    let emailError: string | null = null;
    let emailSkipped: string | null = null;

    const transporter = createMailer();

    if (!transporter || !mailFrom || !mailTo) {
      emailSkipped =
        "Mail not configured: set SMTP_HOST, SMTP_USER, SMTP_PASS (and MAIL_FROM, MAIL_TO), or GMAIL_USER + GMAIL_APP_PASSWORD in .env";
      console.warn(`⚠️ ${emailSkipped}`);
    } else {
      try {
        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #00BFFF; margin-bottom: 20px;">New Contact Form Submission</h2>
              <div style="margin-bottom: 20px;">
                <p style="color: #666; margin: 10px 0;"><strong>Name:</strong> ${escapeHtml(body.name)}</p>
                <p style="color: #666; margin: 10px 0;"><strong>Email:</strong> ${escapeHtml(body.email)}</p>
                <p style="color: #666; margin: 10px 0;"><strong>Phone:</strong> ${body.phone ? escapeHtml(body.phone) : "Not provided"}</p>
                <p style="color: #666; margin: 10px 0;"><strong>Subject:</strong> ${body.subject ? escapeHtml(body.subject) : "Not provided"}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(body.message)}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px; margin: 10px 0;">Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `;

        const userEmailContent = `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #00BFFF; margin: 0;">Thank You for Contacting Us!</h1>
              <p style="color: #666; line-height: 1.6; margin: 20px 0;">Hi ${escapeHtml(body.name)},</p>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                We have received your message and will get back to you as soon as possible.
              </p>
              <div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #00BFFF; margin: 20px 0; border-radius: 4px;">
                <p style="color: #333; margin: 5px 0;"><strong>Your subject:</strong> ${escapeHtml(body.subject || "No subject")}</p>
              </div>
              <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">This is an automated message.</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: mailFrom,
          to: mailTo,
          replyTo: body.email,
          subject: `New contact: ${(body.subject || "No subject").replace(/\r?\n/g, " ").slice(0, 200)}`,
          html: adminEmailContent,
        });

        await transporter.sendMail({
          from: mailFrom,
          to: body.email,
          subject: "We received your message - Vexor IT Solutions",
          html: userEmailContent,
        });

        emailSent = true;
        console.log(`✅ Contact emails sent for ${body.name} <${body.email}>`);
      } catch (emailErr) {
        emailError =
          emailErr instanceof Error ? emailErr.message : "Email send failed";
        console.warn(`⚠️ Nodemailer error: ${emailError}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact form submitted successfully",
        emailSent,
        emailError,
        emailSkipped,
        contact: contactData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process contact form",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
