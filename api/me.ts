import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function getUserId(req: any): string | null {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  try {
    const decoded = jwt.verify(m[1], JWT_SECRET) as any;
    return decoded?.sub || null;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { rows } = await sql`SELECT email, name FROM users WHERE id=${userId} LIMIT 1;`;
    const user = rows[0];
    return res.status(200).json({ id: userId, email: user?.email, name: user?.name });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed' });
  }
}
