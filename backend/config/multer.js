const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'property_images', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 1024, height: 768, crop: 'limit' }], // Resize images
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
