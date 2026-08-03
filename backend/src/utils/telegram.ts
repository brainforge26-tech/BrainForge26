import { env } from '../config/env';

interface ContactNotificationData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  subject?: string;
  message: string;
}

/**
 * Send instant Telegram notification when a contact message is submitted
 */
export async function sendTelegramContactAlert(data: ContactNotificationData): Promise<boolean> {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[Telegram Alert] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env');
    return false;
  }

  const cleanPhone = data.phone ? data.phone.replace(/[^0-9+]/g, '') : '';
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : '';

  const text = `
📬 <b>NEW WEBSITE CONTACT INQUIRY</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📞 <b>Phone:</b> ${data.phone || 'Not provided'}
🛠 <b>Service:</b> ${data.service || 'General Inquiry'}
📌 <b>Subject:</b> ${data.subject || 'No Subject'}

💬 <b>Message:</b>
<i>"${data.message}"</i>

━━━━━━━━━━━━━━━━━━━━━━
🌐 <b>Admin Panel:</b> https://brainforge26.tech/admin/contact-messages
${waLink ? `📱 <b>Open WhatsApp Chat:</b> ${waLink}` : ''}
`.trim();

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Telegram Alert] Failed to send message:', errText);
      return false;
    }

    console.log('[Telegram Alert] Sent instant Telegram notification successfully!');
    return true;
  } catch (err) {
    console.error('[Telegram Alert] Error sending Telegram alert:', err);
    return false;
  }
}
