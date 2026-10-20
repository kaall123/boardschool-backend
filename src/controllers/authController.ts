import type { Request, Response } from 'express';
import { db } from '../config/database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_boardschool';

// 1. Register (daftar akun baru)
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, email, password, role } = req.body;

        if (!nama || !email || !password) {
            res.status(400).json({ message: 'Semua kolom wajib diisi cung!' });
            return;
        }

        const [existingUser]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            res.status(400).json({ message: 'Email sudah terdaftar!' });
            return;
        }

        const userRole = (role === 'guru' || role === 'siswa') ? role : 'siswa';

        await db.query(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
            [nama, email, password, userRole]
        );

        res.status(201).json({ message: 'Registrasi berhasil! sung aja login!' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server!!!!!!!!', error });
    }
};

// 2. Login (Masuk Akun)
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email dan password wajib diisi!' });
            return;
        }

        const [users]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            res.status(404).json({ message: 'Email tidak ditemukan!' });
            return;
        }

        const user = users[0];

        if (password !== user.password) {
            res.status(401).json({ message: 'Password salah!' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login berhasil!',
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
    }
};

// 3. Get Me (Ambil Profil User yang sedang login)
export const getMe = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; // Didapat dari middleware verifyToken

        const [rows]: any = await db.query(
            'SELECT id, nama, email, role FROM users WHERE id = ?',
            [userId]
        );

        if (!rows || rows.length === 0) {
            res.status(404).json({ message: 'User tidak ditemukan' });
            return;
        }

        res.json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

// 4. 🟢 UPDATE PROFILE (Baru ditambahkan)
export const updateProfile = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; // Dari middleware verifikasi token JWT
        const { nama, email, password } = req.body;

        if (!nama || !email) {
            res.status(400).json({ message: 'Nama dan email wajib diisi!' });
            return;
        }

        // Cek apakah user ada
        const [users]: any = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!users || users.length === 0) {
            res.status(404).json({ message: 'User tidak ditemukan' });
            return;
        }

        // Susun query update (mendukung update password jika diisi)
        let query = 'UPDATE users SET nama = ?, email = ?';
        let queryParams = [nama, email];

        if (password && password.trim() !== '') {
            query += ', password = ?';
            queryParams.push(password);
        }

        query += ' WHERE id = ?';
        queryParams.push(userId);

        // Eksekusi query ke database Aiven MySQL
        await db.query(query, queryParams);

        res.json({
            success: true,
            message: 'Profil berhasil diperbarui!',
            updatedData: { nama, email }
        });

    } catch (error: any) {
        // Deteksi jika email kembar / sudah digunakan akun lain
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Email sudah digunakan oleh akun lain!' });
            return;
        }
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};