import { prisma } from '../../config/database';
import { ApplicationStatus } from '@prisma/client';

export const getApplications = async () => {
  return await prisma.hiringApplication.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const getApplicationById = async (id: string) => {
  return await prisma.hiringApplication.findUnique({
    where: { id }
  });
};

export const createApplication = async (data: any) => {
  return await prisma.hiringApplication.create({
    data
  });
};

export const updateApplicationStatus = async (id: string, status: ApplicationStatus, notes?: string) => {
  return await prisma.hiringApplication.update({
    where: { id },
    data: { status, notes }
  });
};

export const getApplicationsByEmail = async (email: string) => {
  return await prisma.hiringApplication.findMany({
    where: { email },
    orderBy: { createdAt: 'desc' }
  });
};
