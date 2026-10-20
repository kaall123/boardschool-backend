import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { db } from '../config/database.js';

// 1. Ambil Semua Pengumuman (Bisa diakses Guru & Siswa)
export const getAllAnnouncements = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [rows] = await db.query(`
            SELECT 
                a.id, 
                a.judul, 
                a.isi, 
                a.kategori, 
                a.gambar, 
                u.nama AS pembuat, 
                u.role AS peran,
                a.created_at
            FROM announcements a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pengumuman', error });
    }
};

// 1.5. Ambil Detail Pengumuman Berdasarkan ID (Untuk Halaman Edit)
export const getAnnouncementById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [rows]: any = await db.query('SELECT * FROM announcements WHERE id = ?', [id]);

        if (!rows || rows.length === 0) {
            res.status(404).json({ message: 'Pengumuman tidak ditemukan!' });
            return;
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil detail pengumuman', error });
    }
};

// 2. Tambah Pengumuman (Khusus Guru + Support Upload Gambar)
export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { judul, isi, kategori } = req.body;
        const user_id = req.user?.id;
        
        const gambar = req.file ? req.file.path : null;

        if (!judul || !isi || !kategori) {
            res.status(400).json({ message: 'Judul, isi, dan kategori wajib diisi cung!' });
            return;
        }

        await db.query(
            'INSERT INTO announcements (user_id, judul, isi, kategori, gambar) VALUES (?, ?, ?, ?, ?)',
            [user_id, judul, isi, kategori, gambar]
        );

        res.status(201).json({ message: 'Congrats! Pengumuman beserta gambar berhasil ditambahkan!' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambah pengumuman', error });
    }
};

// 3. Edit / Update Pengumuman (Khusus Guru)
export const updateAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { judul, isi, kategori } = req.body;
        
        const gambar = req.file ? req.file.path : null;

        if (!judul || !isi || !kategori) {
            res.status(400).json({ message: 'Judul, isi, dan kategori wajib diisi!' });
            return;
        }

        const [existing]: any = await db.query('SELECT * FROM announcements WHERE id = ?', [id]);
        if (existing.length === 0) {
            res.status(404).json({ message: 'Pengumuman tidak ditemukan!' });
            return;
        }

        if (gambar) {
            await db.query(
                'UPDATE announcements SET judul = ?, isi = ?, kategori = ?, gambar = ? WHERE id = ?',
                [judul, isi, kategori, gambar, id]
            );
        } else {
            await db.query(
                'UPDATE announcements SET judul = ?, isi = ?, kategori = ? WHERE id = ?',
                [judul, isi, kategori, id]
            );
        }

        res.status(200).json({ message: 'Pengumuman berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui pengumuman', error });
    }
};

// 4. Hapus Pengumuman (Khusus Guru)
export const deleteAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const [result]: any = await db.query('DELETE FROM announcements WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Pengumuman tidak ditemukan!' });
            return;
        }

        res.status(200).json({ message: 'Pengumuman berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus pengumuman', error });
    }
};