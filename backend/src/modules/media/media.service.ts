import { prisma } from '../../config/database';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';
import { NotFoundError } from '../../errors/AppError';

export async function getAllMediaFiles() {
  return prisma.mediaFile.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function uploadMediaFile(fileBuffer: Buffer, fileName: string, mimeType: string, category = 'general') {
  let url = '';
  let publicId = '';
  let sizeBytes = fileBuffer.length;

  // Try Cloudinary if keys are present
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const result: any = await uploadToCloudinary(fileBuffer, 'brainforge26/media');
      url = result.secure_url || result.url;
      publicId = result.public_id;
      sizeBytes = result.bytes || fileBuffer.length;
    } catch (err) {
      console.warn('Cloudinary upload failed, using Data URL fallback:', err);
    }
  }

  // Fallback to Data URL so uploads ALWAYS succeed regardless of Cloudinary keys
  if (!url) {
    url = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    publicId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  return prisma.mediaFile.create({
    data: {
      name: fileName,
      url,
      publicId,
      mimeType,
      sizeBytes,
      category,
    },
  });
}

export async function deleteMediaFile(id: string) {
  const file = await prisma.mediaFile.findUnique({ where: { id } });
  if (!file) throw new NotFoundError('Media file not found');
  
  if (file.publicId && !file.publicId.startsWith('local_')) {
    await deleteFromCloudinary(file.publicId).catch(() => null);
  }
  return prisma.mediaFile.delete({ where: { id } });
}
