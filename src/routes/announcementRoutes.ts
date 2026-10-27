import { Router } from 'express';
import { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { verifyToken, isGuru } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// 1Siswa & Guru BISA melihat pengumuman
router.get('/', verifyToken, getAllAnnouncements);
router.get('/:id', verifyToken, getAnnouncementById);

//HANYA GURU yang bisa Tambah, Edit, dan Hapus
router.post('/', verifyToken, isGuru, upload.single('gambar'), createAnnouncement);
router.put('/:id', verifyToken, isGuru, upload.single('gambar'), updateAnnouncement);
router.delete('/:id', verifyToken, isGuru, deleteAnnouncement);

export default router;