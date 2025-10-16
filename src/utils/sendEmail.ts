import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const FROM = process.env.EMAIL_FROM || "Govindarao Store <noreply@govindaraostore.com>";

/**
 * sendEmail supports:
 *  - If SENDGRID_API_KEY present -> send via SendGrid
 *  - Else, use SMTP (SMTP_HOST/PORT/USER/PASS)
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = { to, from: FROM, subject, html };
    await sgMail.send(msg);
    return;
  }

  // SMTP fallback
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;

  if (!host || !user || !pass) {
    throw new Error("SMTP config missing and SENDGRID_API_KEY not provided");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html
  });
};
