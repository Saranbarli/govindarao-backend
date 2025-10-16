// backend/src/utils/notify.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPendingPaymentEmail = async (
  email: string,
  name: string,
  orders: any[]
) => {
  const totalDue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const html = `
    <h2>Dear ${name},</h2>
    <p>This is a gentle reminder that you have <strong>${orders.length}</strong> pending payment(s).</p>
    <p>Total Amount Due: <strong>₹${totalDue}</strong></p>
    <p>Please clear your dues at your earliest convenience.</p>
    <p>Thank you,</p>
    <p><strong>Govindarao Store</strong></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Pending Payment Reminder - Govindarao Store",
    html,
  });
};
