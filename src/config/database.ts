import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// membuat koneksi pool ke db saya
export const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_board_school',
});

