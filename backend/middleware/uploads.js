import multer from 'multer';
import path from 'path';

// Memory Storage (for temp or base64 conversion)
const memoryStorage = multer.memoryStorage();
export const memoryUpload = multer({ storage: memoryStorage });

// Disk Storage (stores files on disk)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Your upload directory
  },
  filename: function (req, file, cb) {
    // Unique file name: timestamp + original name
    cb(null, Date.now() + '-' + file.originalname);
  }
});
export const diskUpload = multer({ storage: diskStorage });


