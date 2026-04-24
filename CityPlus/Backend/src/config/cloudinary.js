import cloudinary from "cloudinary";


console.log("[Cloudinary Debug] CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("[Cloudinary Debug] CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("[Cloudinary Debug] CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "[HIDDEN]" : undefined);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;
