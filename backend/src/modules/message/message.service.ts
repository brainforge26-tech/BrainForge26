import { prisma } from '../../config/database';
import { Role } from '@prisma/client';

export const getConversations = async (userId: string, role: Role) => {
  if (role === 'MANAGER' || role === 'ADMIN') {
    // Managers see all conversations
    return await prisma.conversation.findMany({
      include: {
        client: {
          include: {
            user: { select: { email: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  } else if (role === 'CLIENT') {
    // Client sees only their own conversations
    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!clientProfile) return [];
    
    return await prisma.conversation.findMany({
      where: { clientId: clientProfile.id },
      include: {
        client: {
          include: {
            user: { select: { email: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }
  return [];
};

export const getMessages = async (conversationId: string) => {
  return await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: {
          id: true,
          role: true,
          email: true,
          adminProfile: true,
          managerProfile: true,
          developerProfile: true,
          clientProfile: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
};

export const createConversation = async (clientId: string) => {
  // Check if conversation already exists for this client
  const existing = await prisma.conversation.findFirst({
    where: { clientId }
  });
  if (existing) return existing;

  return await prisma.conversation.create({
    data: { clientId }
  });
};

export const sendMessage = async (conversationId: string, senderId: string, content: string, attachments: string[] = []) => {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
      attachments
    },
    include: {
      sender: {
        select: {
          id: true,
          role: true,
          email: true,
          managerProfile: true,
          clientProfile: true
        }
      }
    }
  });

  // Update conversation updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() }
  });

  return message;
};
