const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: false,
    unique_filename: true,
    overwrite: true,
    folder: "avatars",
    transformation: [
      { width: 250, height: 250, crop: "fill", gravity: "face" },
    ],
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    // await fs.unlink(imagePath);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = uploadImage;
