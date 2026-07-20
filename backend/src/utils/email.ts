import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
): Promise<void> {
  await transporter.sendMail({
    from:    `"BrainForceIT" <${env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password — BrainForceIT',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#0B1224;color:#fff;border-radius:12px">
        <h2 style="color:#4F7DFF;margin-bottom:16px">Reset Your Password</h2>
        <p style="color:#AAB3C5;line-height:1.6">
          We received a request to reset your BrainForceIT account password.
          Click the button below to set a new password. This link expires in 5 minutes.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;margin-top:24px;padding:12px 28px;background:linear-gradient(135deg,#4F7DFF,#7C5CFF);color:#fff;text-decoration:none;border-radius:9999px;font-weight:600">
          Reset Password
        </a>
        <p style="color:#7A8499;margin-top:24px;font-size:13px">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
