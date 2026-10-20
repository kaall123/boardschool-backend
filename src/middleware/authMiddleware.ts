import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_boardschool';

// Interface untuk menampung data user di dalam request
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

// 1. Middleware untuk Verifikasi Token Login
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) {
        res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan!' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token tidak valid' });
    }
};

// 2. Middleware khusus Guru (Hanya guru yang boleh Create, Update, Delete)
export const isGuru = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'guru') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak! Fitur ini hanya khusus guru!' });
    }
};