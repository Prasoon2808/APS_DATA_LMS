// backend/middleware/uploadToGCS.js
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../gcs-key.json'),
});

const bucket = storage.bucket('edu-lab-community'); // your bucket name

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 10MB max
  },
});

const uploadToGCS = (req, res, next) => {
  if (!req.file) return next();

  const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
  const blobStream = blob.createWriteStream({ resumable: false });

  blobStream.on('finish', () => {
    req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    next();
  });

  blobStream.on('error', (err) => {
    console.error(err);
    res.status(500).send('Upload error');
  });

  blobStream.end(req.file.buffer);
};

module.exports = { multerMid, uploadToGCS };
