import multer from 'multer';

// Use memory storage to process files directly in buffers before uploading to Cloudinary
const storage = multer.memoryStorage();

// File limits (e.g. 50 MB)
const limits = {
  fileSize: 50 * 1024 * 1024,
};

// Optional filter to restrict file types if needed
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow any file for now (since requirements can include PDFs, images, docs)
  cb(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
