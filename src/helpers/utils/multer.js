import multer from "multer";

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

// Accept common field names to avoid MulterError: Unexpected field
// This lets clients send `photo`, `image`, or `file` for the uploaded image
export const acceptImageFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
])

// Normalize req.files from fields() into a single req.file for downstream handlers
export const normalizeSingleFile = (req, _res, next) => {
  const files = req.files || {};
  req.file = (files.photo?.[0] || files.image?.[0] || files.file?.[0] || undefined);
  next();
}

export default upload