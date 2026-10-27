import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'BoardSchool berjalan dengan lancar! yuhuuuuu' });
});

// Listener lokal
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server aktif di http://localhost:${PORT}`));
}

export default app;