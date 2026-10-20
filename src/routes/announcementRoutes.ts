import { Router } from 'express';
import { 
    getAllAnnouncements, 
    getAnnouncementById, 
    createAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement 
} from '../controllers/announcementController.js';
import { verifyToken, isGuru } from '../middleware/authMiddleware.js'; // 👈 Import isGuru di sini
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// 1. Siswa & Guru BISA melihat pengumuman
router.get('/', verifyToken, getAllAnnouncements);
router.get('/:id', verifyToken, getAnnouncementById);

// 2. HANYA GURU yang bisa Tambah, Edit, dan Hapus (menggunakan middleware isGuru)
router.post('/', verifyToken, isGuru, upload.single('gambar'), createAnnouncement);
router.put('/:id', verifyToken, isGuru, upload.single('gambar'), updateAnnouncement);
router.delete('/:id', verifyToken, isGuru, deleteAnnouncement);

export default router;