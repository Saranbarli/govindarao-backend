// src/utils/mailer.ts
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const useSendGrid = !!process.env.SENDGRID_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "Govindarao Store <noreply@example.com>";

if (useSendGrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (useSendGrid) {
    try {
      await sgMail.send({ to, from: emailFrom, subject, html });
      return;
    } catch (sgErr) {
      // fallback to nodemailer if SendGrid errors
      // eslint-disable-next-line no-console
      console.warn("SendGrid failed, falling back to SMTP:", (sgErr as Error).message);
    }
  }

  // Use SMTP / nodemailer
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP settings missing and SendGrid not configured");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for > 0
    auth: {
      user,
      pass
    }
  });

  await transporter.sendMail({
    from: emailFrom,
    to,
    subject,
    html
  });
}
