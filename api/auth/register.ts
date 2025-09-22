import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      name text,
      created_at timestamptz DEFAULT now()
    );`;
    await sql`CREATE TABLE IF NOT EXISTS states (
      user_id text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data jsonb NOT NULL,
      updated_at timestamptz DEFAULT now()
    );`;
  } catch (e) {
    console.error('DB init error', e);
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
  const newId = randomUUID();
  const { rows } = await sql`INSERT INTO users (id, email, password_hash, name) VALUES (${newId}, ${email}, ${hashed}, ${name || null}) ON CONFLICT (email) DO NOTHING RETURNING id;`;
  let userId: string | undefined = rows[0]?.id;
    if (!userId) {
      const existing = await sql`SELECT id FROM users WHERE email=${email} LIMIT 1;`;
      userId = existing.rows[0]?.id;
    }
    if (!userId) return res.status(500).json({ error: 'failed to create user' });
    // Seed initial state if none exists
    const { rows: stateRows } = await sql`SELECT 1 FROM states WHERE user_id=${userId} LIMIT 1;`;
    if (!stateRows[0]) {
      const isMostafa = String(email).toLowerCase() === 'www.mostfaakram@gmail.com';
      const fullState = {
        boxing: { totalHours: 96, thisWeekSessions: 4, currentStreak: 7, lastSession: null, fitnessTestHighest: 342, fitnessTestThisMonth: 0, fitnessTestTrend: (() => { const scores = [139,264,286,213,256,317,342]; const now = new Date(); const arr: any[] = []; for (let i=6;i>=0;i--){ const d=new Date(now.getFullYear(), now.getMonth()-(6-i), 1); arr.push({ date: d.toLocaleString(undefined,{month:'short'}), score: scores[i], ts: d.getTime() }); } return arr; })(), boxingTapeHours: 0, kickboxingTapeHours: 0, mmaTapeHours: 0, boxingTapeTrend: [], totalFights: 1, wins: 0, losses: 1, draws: 0 },
        gym: { totalHours: 24, thisWeekSessions: 3, currentStreak: 5, lastSession: null, powerLiftNames: ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'], powerLiftWeights: [100,50,50,50], weightTrend: [] },
        oud: { totalHours: 16, thisWeekSessions: 2, currentStreak: 3, lastSession: null, totalConcerts: 1 },
        violin: { totalHours: 780, thisWeekSessions: 1, currentStreak: 2, lastSession: null, totalConcerts: 5 },
        spanish: { totalHours: 393, thisWeekSessions: 2, currentStreak: 2, lastSession: null },
        german: { totalHours: 556, thisWeekSessions: 1, currentStreak: 1, lastSession: null },
        customActivities: {},
        hiddenActivities: {},
        dailyActivityNames: ['Spanish writing','German writing','Oud 15 min','Minoxidil','Creatine'],
        dailyActivityList: [
          { id: '1', name: 'Spanish writing', category: 'Learning' },
          { id: '2', name: 'German writing', category: 'Learning' },
          { id: '3', name: 'Oud 15 min', category: 'Music' },
          { id: '4', name: 'Minoxidil', category: 'Health' },
          { id: '5', name: 'Creatine', category: 'Health' }
        ],
        gymExerciseNames: {
          'flat-db-press': 'Flat DB Press',
          'flat-bpress-machine': 'Flat B-Press Machine',
          'high-low-cable-fly': 'High to Low Cable Fly',
          'tri-rope-pushdown': 'Tri Rope Pushdown',
          'db-lateral-raises': 'DB Lateral Raises',
          'shoulder-press-machine': 'Shoulder Press Machine',
        },
        gymExerciseCategories: {
          'flat-db-press': 'push',
          'flat-bpress-machine': 'push',
          'high-low-cable-fly': 'push',
          'tri-rope-pushdown': 'push',
          'db-lateral-raises': 'push',
          'shoulder-press-machine': 'push',
        },
        gymExerciseProgress: {},
      } as const;
      const minimalState = {
        boxing: { totalHours: 0, thisWeekSessions: 0, currentStreak: 0, lastSession: null, fitnessTestHighest: 0, fitnessTestThisMonth: 0, fitnessTestTrend: [], boxingTapeHours: 0, kickboxingTapeHours: 0, mmaTapeHours: 0, boxingTapeTrend: [], totalFights: 0, wins: 0, losses: 0, draws: 0 },
        gym: { totalHours: 0, thisWeekSessions: 0, currentStreak: 0, lastSession: null, powerLiftNames: ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'], powerLiftWeights: [0,0,0,0], weightTrend: [] },
        oud: { totalHours: 0, thisWeekSessions: 0, currentStreak: 0, lastSession: null, totalConcerts: 0 },
        violin: { totalHours: 0, thisWeekSessions: 0, currentStreak: 0, lastSession: null, totalConcerts: 0 },
        spanish: { totalHours: 0, thisWeekSessions: 0, currentStreak: 0, lastSession: null },
        german: { totalHours: 0, thisWeekSessions: 0, currentStreak: 0, lastSession: null },
        customActivities: {},
        hiddenActivities: { boxing: true, gym: true, oud: true, spanish: true, german: true },
        dailyActivityNames: ['Spanish writing','German writing','Oud 15 min','Minoxidil','Creatine'],
        dailyActivityList: [
          { id: '1', name: 'Spanish writing', category: 'Learning' },
          { id: '2', name: 'German writing', category: 'Learning' },
          { id: '3', name: 'Oud 15 min', category: 'Music' },
          { id: '4', name: 'Minoxidil', category: 'Health' },
          { id: '5', name: 'Creatine', category: 'Health' }
        ],
        gymExerciseNames: {},
        gymExerciseCategories: {},
        gymExerciseProgress: {},
      } as const;
      const seed = isMostafa ? fullState : minimalState;
      await sql`INSERT INTO states (user_id, data, updated_at) VALUES (${userId}, ${seed as any}, now()) ON CONFLICT (user_id) DO NOTHING;`;
    }
    const token = jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'register failed' });
  }
}
