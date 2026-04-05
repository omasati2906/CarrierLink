import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

// Cloudinary images are stored as full URLs in the DB.
// Returns the URL if it's a valid Cloudinary URL, null otherwise.
export const getImageUrl = (picture) => {
   if (!picture) return null;
   if (picture.startsWith("http")) return picture;   // Cloudinary full URL
   return null;   // old filename — no longer accessible
};

// SVG fallback avatar (shown when no profile picture exists)
export const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%236366f1'/%3E%3Ccircle cx='20' cy='15' r='8' fill='white'/%3E%3Cellipse cx='20' cy='35' rx='13' ry='9' fill='white'/%3E%3C/svg%3E`;

export default axios.create({
   baseURL: BASE_URL,
});