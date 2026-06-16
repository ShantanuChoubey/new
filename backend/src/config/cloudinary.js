const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const missingCloudinaryVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
].filter((key) => !process.env[key]);

if (missingCloudinaryVars.length > 0) {
  console.warn(
    `⚠️ Cloudinary is not fully configured. Missing env: ${missingCloudinaryVars.join(", ")}`
  );
}

// Configure Cloudinary using credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer directly to Cloudinary (works with multer memoryStorage).
 * @param {Buffer} buffer   - The file buffer from multer
 * @param {object} options  - Cloudinary upload options (folder, resource_type, etc.)
 * @returns {Promise}       - Cloudinary upload result
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
