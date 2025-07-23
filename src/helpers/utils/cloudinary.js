import { v2 as cloudinary } from "cloudinary";
import { config } from "../infra/global_config.js";

cloudinary.config({
  ...config.cloudinaryConfig
})

export default cloudinary