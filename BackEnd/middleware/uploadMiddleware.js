const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadRoot = process.env.UPLOAD_ROOT || path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dynamic folder: images for cover/profile/thumbnail, otherwise general uploads
    const imageOnlyFields = ['coverImage', 'defaultThumbnail', 'profileImage'];
    const dest = imageOnlyFields.includes(file.fieldname)
      ? path.join(uploadRoot, 'images')
      : uploadRoot;

    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const imageOnlyFields = ['coverImage', 'defaultThumbnail', 'profileImage'];
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = /jpeg|jpg|png|webp/.test(ext);

    if (imageOnlyFields.includes(file.fieldname)) {
      return isImage ? cb(null, true) : cb(new Error(`${file.fieldname} must be an image`));
    }

    // Allow all valid types for content/resources
    const allowedTypes = /jpeg|jpg|png|pdf|mp4|mp3|docx|txt|webm|ogg/;
    if (allowedTypes.test(ext)) return cb(null, true);

    cb(new Error('Unsupported file type'));
  }
});

module.exports = upload;
