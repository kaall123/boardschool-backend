import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Konfigurasi akun Cloudinary dengan penambahan '!' agar lolos validasi TypeScript
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Atur penyimpanan Cloudinary via multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'boardschool_announcements',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    } as any,
});

export const upload = multer({ storage: storage });