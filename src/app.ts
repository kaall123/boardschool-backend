import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 1. Wajib taruh CORS di paling atas middleware!
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middleware parsing JSON
app.use(express.json());

// 3. Static folder uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'BoardSchool berjalan dengan lancar! yuhuuuuu' });
});

// Jalankan Server (hanya untuk lokal)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Yuhuuu Server berjalan di http://localhost:${PORT}`);
  });
}

export default app;