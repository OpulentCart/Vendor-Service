const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinaryConfig");

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
              if (error) return reject(error);
              resolve(result); // Returns { url, public_id }
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}

module.exports = uploadToCloudinary;
