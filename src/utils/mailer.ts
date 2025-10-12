// backend/src/utils/mailer.ts
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import Mail from "nodemailer/lib/mailer";

const fromAddress = process.env.EMAIL_FROM || "noreply@govindaraostore.local";

function createTransport(): Mail {
  // If SENDGRID_API_KEY is present, use SendGrid transport
  if (process.env.SENDGRID_API_KEY) {
    const sgOptions = { auth: { api_key: process.env.SENDGRID_API_KEY } };
    return nodemailer.createTransport(sgTransport(sgOptions));
  }

  // Otherwise use SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback - ethereal for dev if requested
  if (process.env.NODE_ENV !== "production") {
    // create a test account automatically
    // not awaited — returns Promise but nodemailer.createTestAccount is available
    // We'll keep a simple console fallback
    const transport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || "",
        pass: process.env.ETHEREAL_PASS || "",
      },
    });
    return transport;
  }

  throw new Error("No mail transport configured (set SENDGRID_API_KEY or SMTP_ env vars)");
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  const transport = createTransport();
  const mailOptions = {
    from: fromAddress,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text || undefined,
  };

  const info = await transport.sendMail(mailOptions);
  // log or return info
  console.log("Mail sent:", info && (info as any).messageId);
  return info;
}
