import nodemailer from "nodemailer";
import twilio from "twilio";

const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await smtpTransport.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
    console.log("📧 Email sent:", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendSMS = async (to: string, body: string) => {
  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    console.log("📱 SMS sent:", to);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
