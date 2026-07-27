import { prisma } from '../../config/database';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';
import { FileCategory } from '@prisma/client';

export async function uploadProjectFile(projectId: string, userId: string, file: Express.Multer.File, category: FileCategory = 'OTHER') {
  const uploadResult = await uploadToCloudinary(file.buffer, `projects/${projectId}/files`, 'auto');

  const newFile = await prisma.projectFile.create({
    data: {
      projectId,
      name: file.originalname,
      url: uploadResult.url,
      publicId: uploadResult.public_id,
      category,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      uploadedBy: userId,
    }
  });

  return newFile;
}

export async function deleteProjectFile(fileId: string) {
  const file = await prisma.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw new Error('File not found');

  await deleteFromCloudinary(file.publicId, file.mimeType?.startsWith('image') ? 'image' : 'raw');
  await prisma.projectFile.delete({ where: { id: fileId } });
}

export async function getProjectFiles(projectId: string) {
  return await prisma.projectFile.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' }
  });
}
