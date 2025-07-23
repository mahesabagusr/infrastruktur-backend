import cloudinary from "@/helpers/utils/cloudinary.js"
import streamifier from "streamifier"

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "reports" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream);
  })
}

export default uploadToCloudinary;