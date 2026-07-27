import { Request, Response } from 'express';
import * as MessageService from './message.service';
import { prisma } from '../../config/database';

export const getConversations = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const conversations = await MessageService.getConversations(user.userId, user.role);
  res.status(200).json({ success: true, data: conversations });
};

export const getMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const messages = await MessageService.getMessages(id);
  res.status(200).json({ success: true, data: messages });
};

export const createConversation = async (req: Request, res: Response) => {
  let { clientId } = req.body;
  const user = (req as any).user;

  if (user.role === 'CLIENT') {
    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId: user.userId } });
    if (!clientProfile) return res.status(400).json({ success: false, message: 'Client profile not found' });
    clientId = clientProfile.id;
  }

  if (!clientId) {
    return res.status(400).json({ success: false, message: 'clientId is required' });
  }

  const conversation = await MessageService.createConversation(clientId);
  res.status(201).json({ success: true, data: conversation });
};

export const sendMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, attachments } = req.body;
  const user = (req as any).user;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Message content is required' });
  }

  const message = await MessageService.sendMessage(id, user.userId, content, attachments);
  res.status(201).json({ success: true, data: message });
};
