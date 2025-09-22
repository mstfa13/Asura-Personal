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
  if (req.method === 'GET') {
    try {
      await sql`CREATE TABLE IF NOT EXISTS states (
        user_id uuid PRIMARY KEY,
        data jsonb NOT NULL,
        updated_at timestamptz DEFAULT now()
      );`;
      const { rows } = await sql`SELECT data FROM states WHERE user_id=${userId} LIMIT 1;`;
      return res.status(200).json(rows[0]?.data || null);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'failed' });
    }
  }
  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      await sql`INSERT INTO states (user_id, data, updated_at) VALUES (${userId}, ${body}, now()) ON CONFLICT (user_id) DO UPDATE SET data=EXCLUDED.data, updated_at=now();`;
      return res.status(204).end();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'failed' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
