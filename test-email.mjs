import nodemailer from 'nodemailer';

// Load environment variables
function loadDotEnv() {
  const { readFileSync, existsSync } = await import('node:fs');
  if (!existsSync('.env')) return;
  const raw = readFileSync('.env', 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

await loadDotEnv();

console.log('Testing nodemailer with environment variables...');

const gmailUser = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser || !gmailPassword) {
  console.error('Error: GMAIL_USER and GMAIL_APP_PASSWORD must be set in .env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPassword
  }
});

const mailTo = process.env.MAIL_TO || process.env.GMAIL_USER;

transporter.sendMail({
  from: `"Vexora IT Solutions" <${gmailUser}>`,
  to: mailTo,
  subject: 'Test Email',
  text: 'This is a test'
}).then(() => console.log('Successfully sent test email!')).catch(e => console.error('Error sending:', e));
