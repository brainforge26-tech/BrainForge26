import { prisma } from '../../config/database';
import { NotFoundError } from '../../errors/AppError';
import { sendTelegramContactAlert } from '../../utils/telegram';
import { sendCandidateCustomEmail } from '../../utils/email';

export async function submitContactMessage(data: any) {
  const createdMsg = await prisma.contactMessage.create({ data });

  // Trigger instant Telegram alert asynchronously
  sendTelegramContactAlert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    service: data.service,
    subject: data.subject,
    message: data.message,
  }).catch((err) => console.error('[Contact Service] Telegram alert error:', err));

  return createdMsg;
}

export async function getAllContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getContactMessageById(id: string) {
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) throw new NotFoundError('Contact message not found');
  return msg;
}

export async function markAsRead(id: string, isRead = true) {
  await getContactMessageById(id);
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });
}

export async function replyToContactMessage(id: string, replyData: { subject: string; messageBody: string }) {
  const msg = await getContactMessageById(id);

  // Send Email directly via SMTP (gracefully handle any SMTP warning)
  try {
    await sendCandidateCustomEmail(
      msg.email,
      replyData.subject || `Re: ${msg.subject || 'Inquiry'}`,
      replyData.messageBody,
      msg.name
    );
  } catch (emailErr) {
    console.warn('[Contact Reply] Email sending notice:', emailErr);
  }

  // Always save reply to database record
  return prisma.contactMessage.update({
    where: { id },
    data: {
      isRead: true,
      notes: `[REPLIED: ${new Date().toISOString()}] ${replyData.messageBody}`,
    },
  });
}

export async function deleteContactMessage(id: string) {
  await getContactMessageById(id);
  return prisma.contactMessage.delete({ where: { id } });
}
