import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage Engine Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  },
});

// File Type Validation Filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload product image file
// @route   POST /api/upload
// @access  Public / Private
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }
  const relativePath = `/${req.file.path.replace(/\\/g, '/')}`;
  const fullUrl = `http://localhost:5001${relativePath}`;

  res.json({
    message: 'Image uploaded successfully',
    image: fullUrl,
    relativePath: relativePath,
  });
});

export default router;
