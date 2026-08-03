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
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn('EMAIL_USER / EMAIL_PASS not configured, skipping password reset email.');
    return;
  }
  await transporter.sendMail({
    from: `"BrainForge26" <${env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password — BrainForge26',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#050608;color:#fff;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
        <h2 style="color:#f97316;margin-bottom:16px">Reset Your Password</h2>
        <p style="color:#cbd5e1;line-height:1.6">
          We received a request to reset your BrainForge26 account password.
          Click the button below to set a new password. This link expires in 5 minutes.
        </p>
        <a href="${resetLink}"
           style="display:inline-block;margin-top:24px;padding:12px 28px;background:linear-gradient(135deg,#f97316,#f59e0b);color:#fff;text-decoration:none;border-radius:9999px;font-weight:700">
          Reset Password
        </a>
        <p style="color:#64748b;margin-top:24px;font-size:13px">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendCandidateCustomEmail(
  to: string,
  subject: string,
  messageBody: string,
  candidateName: string,
): Promise<boolean> {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.warn('EMAIL_USER / EMAIL_PASS not configured, skipping direct SMTP email send.');
    return false;
  }

  try {
    const formattedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #08090E; color: #f8fafc; border-radius: 20px; border: 1px solid rgba(255,255,255,0.12);">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #f97316; font-size: 24px; font-weight: 800; margin: 0;">BrainForge26 Careers</h1>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Talent Acquisition & Engineering Recruitment</p>
        </div>
        <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hi <strong>${candidateName}</strong>,</p>
        <div style="color: #cbd5e1; font-size: 14px; line-height: 1.7; white-space: pre-wrap; margin: 20px 0; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border-left: 3px solid #f97316;">
${messageBody}
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 32px; font-size: 12px; color: #64748b;">
          <p style="margin: 0; font-weight: bold; color: #94a3b8;">BrainForge26 Talent Acquisition Team</p>
          <p style="margin: 4px 0 0 0;">Website: <a href="https://brainforge26.tech" style="color: #f97316; text-decoration: none;">https://brainforge26.tech</a></p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"BrainForge26 Hiring" <${env.EMAIL_USER}>`,
      to,
      subject,
      html: formattedHtml,
    });
    return true;
  } catch (err) {
    console.error('Failed to send candidate email:', err);
    return false;
  }
}
