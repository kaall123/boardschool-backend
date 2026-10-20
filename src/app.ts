import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url'; // 👈 Tambahkan ini untuk ESM __dirname

dotenv.config();

// Konfigurasi __dirname untuk ES Modules (TypeScript Node.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// 📂 TAMBAHKAN INI: Agar folder uploads bisa diakses publik via URL /uploads/...
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'BoardSchool berjalan dengan lancar! yuhuuuuu' });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Yuhuuu Server berjalan di http://localhost:${PORT}`);
});