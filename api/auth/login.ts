import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  try {
    const { rows } = await sql`SELECT id, password_hash FROM users WHERE email=${email} LIMIT 1;`;
    const row = rows[0];
    if (!row) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: row.id, email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'login failed' });
  }
}
