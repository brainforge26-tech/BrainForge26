import { Request, Response, NextFunction } from 'express';
import * as contactService from './contact.service';

export async function submitContact(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contactService.submitContactMessage(req.body);
    res.status(201).json({ success: true, data, message: 'Message sent successfully. We will get back to you shortly!' });
  } catch (err) {
    next(err);
  }
}

export async function getAllMessages(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contactService.getAllContactMessages();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const data = await contactService.getContactMessageById(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const isRead = req.body.isRead !== undefined ? req.body.isRead : true;
    const data = await contactService.markAsRead(id, isRead);
    res.json({ success: true, data, message: 'Status updated' });
  } catch (err) {
    next(err);
  }
}

export async function replyMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { subject, messageBody } = req.body;
    const data = await contactService.replyToContactMessage(id, { subject, messageBody });
    res.json({ success: true, data, message: 'Reply sent successfully via email!' });
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await contactService.deleteContactMessage(id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
}
