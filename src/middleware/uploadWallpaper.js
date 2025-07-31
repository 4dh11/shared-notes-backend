import multer from "multer";
import path from "path";

// Set storage location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/wallpapers");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const uploadWallpaper = multer({ storage, fileFilter });
