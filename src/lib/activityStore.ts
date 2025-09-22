// Simple activity tracking store - focused and clean
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActivityData {
  totalHours: number;
  thisWeekSessions: number;
  currentStreak: number;
  lastSession: string | null;
  // Optional activity-specific fields
  fitnessTestHighest?: number;
  fitnessTestThisMonth?: number;
  // Fitness test monthly trend
  fitnessTestTrend?: Array<{ date: string; score: number; ts?: number }>;
  // Boxing tape tracking
  boxingTapeHours?: number;
  kickboxingTapeHours?: number;
  mmaTapeHours?: number;
  // Optional time-series for tape watched (weekly progression)
  boxingTapeTrend?: Array<{ date: string; ts?: number; boxing?: number; kickboxing?: number; mma?: number }>;
  // Gym-specific optional fields
  powerLiftNames?: string[]; // e.g., ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts']
  powerLiftWeights?: number[]; // e.g., [100, 50, 50, 50]
  // User body weight tracking (for trend chart)
  weightTrend?: Array<{ date: string; weight: number; ts?: number }>; // chronological order; ts=epoch ms
  // Boxing-specific optional fields
  totalFights?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  // Oud-specific optional fields
  totalConcerts?: number;
}

interface ActivityStore {
  boxing: ActivityData;
  gym: ActivityData;
  oud: ActivityData;
  violin: ActivityData;
  spanish: ActivityData;
  german: ActivityData;
  customActivities: Record<string, { name: string; template?: 'none'|'boxing'|'gym'|'music'|'language'; data: ActivityData }>;
  // When true, show only Progress and Daily Activities until user adds their own content
  minimalMode?: boolean;
  addHours: (activity: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german', hours: number) => void;
  getActivityData: (activity: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german') => ActivityData;
  recordBoxingFight: (result: 'win' | 'loss' | 'draw') => void;
  addConcert: () => void;
  addTapeHours: (kind: 'boxing' | 'kickboxing' | 'mma', hours: number) => void;
  addBoxingTapeEntry: (boxingH: number, kickH: number, mmaH: number, dateLabel?: string) => void;
  updateBoxingTapeAt: (index: number, boxingH?: number, kickH?: number, mmaH?: number, dateLabel?: string) => void;
  deleteBoxingTapeAt: (index: number) => void;
  resetBoxingTape: () => void;
  // Fitness trend CRUD
  addFitnessScore: (score: number, dateLabel?: string) => void;
  updateFitnessScoreAt: (index: number, score?: number, dateLabel?: string) => void;
  deleteFitnessScoreAt: (index: number) => void;
  // Custom activities API
  addCustomActivity: (slug: string, name: string, template?: 'none'|'boxing'|'gym'|'music'|'language') => void;
  addCustomHours: (slug: string, hours: number) => void;
  getCustomActivity: (slug: string) => { name: string; data: ActivityData } | undefined;
  listCustomActivities: () => Array<{ slug: string; name: string; data: ActivityData }>;
  deleteCustomActivity: (slug: string) => void;
  // Custom template helpers (mirror core where needed)
  addCustomTapeHours: (slug: string, kind: 'boxing' | 'kickboxing' | 'mma', hours: number) => void;
  updateCustomPowerLiftName: (slug: string, index: number, name: string) => void;
  updateCustomPowerLiftWeight: (slug: string, index: number, weight: number) => void;
  addCustomWeight: (slug: string, weight: number, dateLabel?: string) => void;
  updateCustomExerciseName: (slug: string, id: string, name: string) => void;
  addCustomExerciseWeight: (slug: string, id: string, weight: number, reps?: number | null, dateLabel?: string) => void;
  // Gym
  updateGymPowerLiftName: (index: number, name: string) => void;
  updateGymPowerLiftWeight: (index: number, weight: number) => void;
  addGymWeight: (weight: number, dateLabel?: string) => void;
  updateGymWeightAt: (index: number, weight?: number, dateLabel?: string) => void;
  deleteGymWeightAt: (index: number) => void;
  // Daily activities
  dailyActivityNames: string[];
  updateDailyActivityName: (index: number, name: string) => void;
  // Daily Activities list (add/delete/rename)
  dailyActivityList: Array<{ id: string; name: string; category: string }>;
  addDailyActivity: (name: string, category: string) => void;
  removeDailyActivity: (id: string) => void;
  renameDailyActivity: (id: string, name: string) => void;
  // Gym Exercise names (for progress selector)
  gymExerciseNames: Record<string, string>;
  updateGymExerciseName: (id: string, name: string) => void;
  // Gym Exercise categories and CRUD
  gymExerciseCategories: Record<string, 'push' | 'pull' | 'legs' | 'other'>;
  addGymExercise: (name: string, category: 'push' | 'pull' | 'legs' | 'other') => string;
  // Optional: update category later
  updateGymExerciseCategory?: (id: string, category: 'push' | 'pull' | 'legs' | 'other') => void;
  // Gym Exercise progress (weights timeline)
  gymExerciseProgress: Record<string, Array<{ date: string; weight: number; reps?: number | null; ts?: number }>>;
  addGymExerciseWeight: (id: string, weight: number, reps?: number | null, dateLabel?: string) => void;
  // Core activity visibility
  hiddenActivities: Record<string, boolean>;
  hideActivity: (key: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german') => void;
  restoreActivity: (key: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german') => void;
  // Manual edits
  setActivityTotalHours: (activity: 'boxing' | 'gym' | 'oud' | 'violin' | 'spanish' | 'german', hours: number) => void;
  // Server sync helpers
  hydrateFromServer: (payload: Partial<Pick<ActivityStore,
    'boxing'|'gym'|'oud'|'violin'|'spanish'|'german'|'customActivities'|'hiddenActivities'|'dailyActivityNames'|'dailyActivityList'|'gymExerciseNames'|'gymExerciseCategories'|'gymExerciseProgress'>>) => void;
  getSerializableState: () => Pick<ActivityStore,
  'boxing'|'gym'|'oud'|'violin'|'spanish'|'german'|'customActivities'|'hiddenActivities'|'dailyActivityNames'|'dailyActivityList'|'gymExerciseNames'|'gymExerciseCategories'|'gymExerciseProgress'|'minimalMode'>;
}

const initialActivityData: ActivityData = {
  totalHours: 0,
  thisWeekSessions: 0,
  currentStreak: 0,
  lastSession: null,
};

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
  customActivities: {},
  hiddenActivities: {},
  minimalMode: false,
      dailyActivityNames: [
        'Spanish writing',
        'German writing',
        'Oud 15 min',
        'Minoxidil',
        'Creatine',
      ],
      dailyActivityList: [
        { id: '1', name: 'Spanish writing', category: 'Learning' },
        { id: '2', name: 'German writing', category: 'Learning' },
        { id: '3', name: 'Oud 15 min', category: 'Music' },
        { id: '4', name: 'Minoxidil', category: 'Health' },
        { id: '5', name: 'Creatine', category: 'Health' },
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
      boxing: { 
        ...initialActivityData, 
        totalHours: 96, 
        thisWeekSessions: 4, 
        currentStreak: 7,
        fitnessTestHighest: 342,
        fitnessTestThisMonth: 0,
        fitnessTestTrend: (() => {
          // Seed last 7 months trend with example scores
          const scores = [139, 264, 286, 213, 256, 317, 342];
          const now = new Date();
          const arr: Array<{ date: string; score: number; ts: number }> = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
            arr.push({
              date: d.toLocaleString(undefined, { month: 'short' }),
              score: scores[i],
              ts: d.getTime(),
            });
          }
          return arr;
        })(),
  boxingTapeHours: 0,
  kickboxingTapeHours: 0,
  mmaTapeHours: 0,
  boxingTapeTrend: [],
  totalFights: 1,
  wins: 0,
  losses: 1,
  draws: 0,
      },
  gym: { 
        ...initialActivityData, 
    totalHours: 24, 
        thisWeekSessions: 3, 
        currentStreak: 5,
        powerLiftNames: ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'],
  powerLiftWeights: [100, 50, 50, 50],
  weightTrend: [],
      },
      oud: { ...initialActivityData, totalHours: 16, thisWeekSessions: 2, currentStreak: 3, totalConcerts: 1 },
  violin: { ...initialActivityData, totalHours: 780, thisWeekSessions: 1, currentStreak: 2, totalConcerts: 5 },
  spanish: { ...initialActivityData, totalHours: 393, thisWeekSessions: 2, currentStreak: 2 },
  german: { ...initialActivityData, totalHours: 556, thisWeekSessions: 1, currentStreak: 1 },
      
  addHours: (activity, hours) => {
        set((state) => {
          const currentData = state[activity];
          const today = new Date().toDateString();
          
          return {
            ...state,
            [activity]: {
              ...currentData,
              totalHours: Math.round((currentData.totalHours + hours) * 100) / 100,
              thisWeekSessions: currentData.thisWeekSessions + 1,
              currentStreak: currentData.lastSession !== today ? currentData.currentStreak + 1 : currentData.currentStreak,
              lastSession: today,
            },
          };
        });
      },

      recordBoxingFight: (result) => {
        set((state) => {
          const today = new Date().toDateString();
          const b = state.boxing;
          return {
            ...state,
            boxing: {
              ...b,
              totalFights: (b.totalFights ?? 0) + 1,
              wins: (b.wins ?? 0) + (result === 'win' ? 1 : 0),
              losses: (b.losses ?? 0) + (result === 'loss' ? 1 : 0),
              draws: (b.draws ?? 0) + (result === 'draw' ? 1 : 0),
              lastSession: today,
            },
          };
        });
      },

      addConcert: () => {
        set((state) => {
          const today = new Date().toDateString();
          const o = state.oud;
          return {
            ...state,
            oud: {
              ...o,
              totalConcerts: (o.totalConcerts ?? 0) + 1,
              lastSession: today,
            },
          };
        });
      },

  addTapeHours: (kind, hours) => {
        if (hours <= 0) return;
        set((state) => ({
          ...state,
          boxing: {
            ...state.boxing,
    boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) + (kind === 'boxing' ? hours : 0),
    kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) + (kind === 'kickboxing' ? hours : 0),
    mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) + (kind === 'mma' ? hours : 0),
          },
        }));
      },

      addBoxingTapeEntry: (boxingH, kickH, mmaH, dateLabel) => {
        const bH = Number.isFinite(boxingH) && boxingH > 0 ? boxingH : 0;
        const kH = Number.isFinite(kickH) && kickH > 0 ? kickH : 0;
        const mH = Number.isFinite(mmaH) && mmaH > 0 ? mmaH : 0;
        if (bH + kH + mH <= 0) return;
        set((state) => {
          const trend = state.boxing.boxingTapeTrend ?? [];
          const last = trend[trend.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + weekMs;
          else {
            const parsed = Date.parse((last.date || '').replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const next = [...trend, { date: label, ts: baseTs, boxing: bH || undefined, kickboxing: kH || undefined, mma: mH || undefined }];
          return {
            ...state,
            boxing: {
              ...state.boxing,
              boxingTapeTrend: next,
              boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) + bH,
              kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) + kH,
              mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) + mH,
            },
          };
        });
      },

      // Fitness test monthly trend
      addFitnessScore: (score, dateLabel) => {
        if (!Number.isFinite(score) || score < 0) return;
        set((state) => {
          const trend = state.boxing.fitnessTestTrend ?? [];
          const last = trend[trend.length - 1];
          const monthMs = 30 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + monthMs;
          else baseTs = Date.now();
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleString(undefined, { month: 'short' });
          const next = [...trend, { date: label, score: Math.round(score), ts: baseTs }];
          const highest = Math.max(state.boxing.fitnessTestHighest ?? 0, Math.round(score));
          return {
            ...state,
            boxing: { ...state.boxing, fitnessTestTrend: next, fitnessTestThisMonth: Math.round(score), fitnessTestHighest: highest },
          };
        });
      },
      updateFitnessScoreAt: (index, score, dateLabel) => {
        set((state) => {
          const trend = state.boxing.fitnessTestTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = [...trend];
          const cur = next[index];
          next[index] = { ...cur, score: Number.isFinite(score as number) && (score as number) >= 0 ? Math.round(score as number) : cur.score, date: (dateLabel && dateLabel.trim()) || cur.date };
          const newHighest = next.reduce((m, r) => Math.max(m, r.score), 0);
          const lastScore = next.length ? next[next.length - 1].score : 0;
          return { ...state, boxing: { ...state.boxing, fitnessTestTrend: next, fitnessTestHighest: newHighest, fitnessTestThisMonth: lastScore } };
        });
      },
      deleteFitnessScoreAt: (index) => {
        set((state) => {
          const trend = state.boxing.fitnessTestTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = trend.filter((_, i) => i !== index);
          const newHighest = next.reduce((m, r) => Math.max(m, r.score), 0);
          const lastScore = next.length ? next[next.length - 1].score : 0;
          return { ...state, boxing: { ...state.boxing, fitnessTestTrend: next, fitnessTestHighest: newHighest, fitnessTestThisMonth: lastScore } };
        });
      },

      updateBoxingTapeAt: (index, boxingH, kickH, mmaH, dateLabel) => {
        set((state) => {
          const trend = state.boxing.boxingTapeTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const current = trend[index];
          const oldB = current.boxing ?? 0;
          const oldK = current.kickboxing ?? 0;
          const oldM = current.mma ?? 0;
          const nextB = Number.isFinite(boxingH as number) && (boxingH as number) >= 0 ? (boxingH as number) : oldB;
          const nextK = Number.isFinite(kickH as number) && (kickH as number) >= 0 ? (kickH as number) : oldK;
          const nextM = Number.isFinite(mmaH as number) && (mmaH as number) >= 0 ? (mmaH as number) : oldM;
          const next = [...trend];
          next[index] = {
            ...current,
            date: (dateLabel && dateLabel.trim()) || current.date,
            boxing: nextB || undefined,
            kickboxing: nextK || undefined,
            mma: nextM || undefined,
          };
          return {
            ...state,
            boxing: {
              ...state.boxing,
              boxingTapeTrend: next,
              boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) + (nextB - oldB),
              kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) + (nextK - oldK),
              mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) + (nextM - oldM),
            },
          };
        });
      },

      deleteBoxingTapeAt: (index) => {
        set((state) => {
          const trend = state.boxing.boxingTapeTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const current = trend[index];
          const oldB = current.boxing ?? 0;
          const oldK = current.kickboxing ?? 0;
          const oldM = current.mma ?? 0;
          const next = trend.filter((_, i) => i !== index);
          return {
            ...state,
            boxing: {
              ...state.boxing,
              boxingTapeTrend: next,
              boxingTapeHours: (state.boxing.boxingTapeHours ?? 0) - oldB,
              kickboxingTapeHours: (state.boxing.kickboxingTapeHours ?? 0) - oldK,
              mmaTapeHours: (state.boxing.mmaTapeHours ?? 0) - oldM,
            },
          };
        });
      },

      resetBoxingTape: () => {
        set((state) => ({
          ...state,
          boxing: {
            ...state.boxing,
            boxingTapeHours: 0,
            kickboxingTapeHours: 0,
            mmaTapeHours: 0,
            boxingTapeTrend: [],
          },
        }));
      },
      
      getActivityData: (activity) => get()[activity],

      // Custom activities
  addCustomActivity: (slug, name, template = 'none') => {
        set((state) => {
          if (state.customActivities[slug]) return state;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
      [slug]: { name, template, data: { ...initialActivityData } },
            },
          };
        });
      },

      addCustomHours: (slug, hours) => {
        if (hours <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const today = new Date().toDateString();
          const d = entry.data;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: {
                ...entry,
                data: {
                  ...d,
                  totalHours: Math.round((d.totalHours + hours) * 100) / 100,
                  thisWeekSessions: d.thisWeekSessions + 1,
                  currentStreak: d.lastSession !== today ? d.currentStreak + 1 : d.currentStreak,
                  lastSession: today,
                },
              },
            },
          };
        });
      },

      getCustomActivity: (slug) => get().customActivities[slug],
      listCustomActivities: () => Object.entries(get().customActivities).map(([slug, v]) => ({ slug, ...v })),
      deleteCustomActivity: (slug) => {
        set((state) => {
          if (!state.customActivities[slug]) return state;
          const { [slug]: _removed, ...rest } = state.customActivities;
          return { ...state, customActivities: rest };
        });
      },

      // Custom template helpers
      addCustomTapeHours: (slug, kind, hours) => {
        if (hours <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const d = entry.data;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: {
                ...entry,
                data: {
                  ...d,
                  boxingTapeHours: (d.boxingTapeHours ?? 0) + (kind === 'boxing' ? hours : 0),
                  kickboxingTapeHours: (d.kickboxingTapeHours ?? 0) + (kind === 'kickboxing' ? hours : 0),
                  mmaTapeHours: (d.mmaTapeHours ?? 0) + (kind === 'mma' ? hours : 0),
                },
              },
            },
          };
        });
      },

      updateCustomPowerLiftName: (slug, index, name) => {
        if (index < 0 || index > 3) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const names = entry.data.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          const next = [...names];
          next[index] = name.trim() || names[index];
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, powerLiftNames: next } },
            },
          };
        });
      },

      updateCustomPowerLiftWeight: (slug, index, weight) => {
        if (index < 0 || index > 3) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const current = entry.data.powerLiftWeights ?? [100, 50, 50, 50];
          const next = [...current];
          const safe = Number.isFinite(weight) && weight > 0 ? Math.round(weight * 100) / 100 : current[index];
          next[index] = safe;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, powerLiftWeights: next } },
            },
          };
        });
      },

      addCustomWeight: (slug, weight, dateLabel) => {
        if (!Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const trend = entry.data.weightTrend ?? [];
          const last = trend[trend.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + weekMs;
          else {
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const next = [
            ...trend,
            { date: label, weight: Math.round(weight * 100) / 100, ts: baseTs },
          ];
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, weightTrend: next } },
            },
          };
        });
      },

      updateCustomExerciseName: (slug, id, name) => {
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const map = entry.data as any;
          const gymExerciseNames = map.gymExerciseNames ?? {};
          const trimmed = name.trim();
          if (!trimmed) return state;
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, gymExerciseNames: { ...gymExerciseNames, [id]: trimmed } } as any },
            },
          };
        });
      },

      addCustomExerciseWeight: (slug, id, weight, reps, dateLabel) => {
        if (!id || !Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const entry = state.customActivities[slug];
          if (!entry) return state;
          const all = (entry.data as any).gymExerciseProgress ?? {};
          const series = all[id] ?? [];
          const last = series[series.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) baseTs = Date.now();
          else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) baseTs = last.ts + weekMs;
          else {
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const rounded = Math.round(weight * 100) / 100;
          const nextAll = { ...all, [id]: [...series, { date: label, weight: rounded, reps: reps ?? null, ts: baseTs }] };
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: { ...entry.data, gymExerciseProgress: nextAll } as any },
            },
          };
        });
      },

      updateGymPowerLiftName: (index, name) => {
        if (index < 0 || index > 3) return;
        set((state) => {
          const names = state.gym.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          const next = [...names];
          next[index] = name.trim() || names[index];
          return {
            ...state,
            gym: {
              ...state.gym,
              powerLiftNames: next,
            },
          };
        });
      },

      updateGymPowerLiftWeight: (index, weight) => {
        if (index < 0 || index > 3) return;
        set((state) => {
          const current = state.gym.powerLiftWeights ?? [100, 50, 50, 50];
          const next = [...current];
          const safe = Number.isFinite(weight) && weight > 0 ? Math.round(weight * 100) / 100 : current[index];
          next[index] = safe;
          return {
            ...state,
            gym: {
              ...state.gym,
              powerLiftWeights: next,
            },
          };
        });
      },

      addGymWeight: (weight, dateLabel) => {
        if (!Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const trend = state.gym.weightTrend ?? [];
          const last = trend[trend.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          // Determine base timestamp
          let baseTs: number;
          if (!last) {
            baseTs = Date.now();
          } else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) {
            baseTs = last.ts + weekMs;
          } else {
            // Try to parse last.date if ts missing
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          // If a dateLabel is provided, allow overriding the label only; ts remains weekly progression
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const next = [
            ...trend,
            { date: label, weight: Math.round(weight * 100) / 100, ts: baseTs },
          ];
          return {
            ...state,
            gym: {
              ...state.gym,
              weightTrend: next,
            },
          };
        });
      },

      updateGymWeightAt: (index, weight, dateLabel) => {
        set((state) => {
          const trend = state.gym.weightTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = [...trend];
          const current = next[index];
          const updated = {
            ...current,
            weight: Number.isFinite(weight as number) && (weight as number) > 0 ? Math.round((weight as number) * 100) / 100 : current.weight,
            date: (dateLabel && dateLabel.trim()) || current.date,
          };
          next[index] = updated;
          return { ...state, gym: { ...state.gym, weightTrend: next } };
        });
      },

      deleteGymWeightAt: (index) => {
        set((state) => {
          const trend = state.gym.weightTrend ?? [];
          if (index < 0 || index >= trend.length) return state;
          const next = trend.filter((_, i) => i !== index);
          return { ...state, gym: { ...state.gym, weightTrend: next } };
        });
      },

      updateDailyActivityName: (index, name) => {
        set((state) => {
          if (index < 0 || index >= state.dailyActivityNames.length) return state;
          const next = [...state.dailyActivityNames];
          next[index] = name.trim() || state.dailyActivityNames[index];
          return { ...state, dailyActivityNames: next };
        });
      },

      addDailyActivity: (name, category) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => {
          const id = (Date.now() + Math.random()).toString(36);
          return {
            ...state,
            dailyActivityList: [...state.dailyActivityList, { id, name: trimmed, category }],
          };
        });
      },
      removeDailyActivity: (id) => {
        set((state) => ({
          ...state,
          dailyActivityList: state.dailyActivityList.filter((a) => a.id !== id),
        }));
      },
      renameDailyActivity: (id, name) => {
        set((state) => ({
          ...state,
          dailyActivityList: state.dailyActivityList.map((a) => a.id === id ? { ...a, name: name.trim() || a.name } : a),
        }));
      },

      updateGymExerciseName: (id, name) => {
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return state;
          return {
            ...state,
            gymExerciseNames: {
              ...state.gymExerciseNames,
              [id]: trimmed,
            },
          };
        });
      },

      addGymExercise: (name, category) => {
        const trimmed = (name || '').trim();
        if (!trimmed) return '';
        const base = trimmed
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 40);
        const id = `${base || 'exercise'}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          ...state,
          gymExerciseNames: { ...state.gymExerciseNames, [id]: trimmed },
          gymExerciseCategories: { ...state.gymExerciseCategories, [id]: category },
          // progress series starts empty; add key when first weight is added
        }));
        return id;
      },

      addGymExerciseWeight: (id, weight, reps, dateLabel) => {
        if (!id || !Number.isFinite(weight) || weight <= 0) return;
        set((state) => {
          const all = state.gymExerciseProgress ?? {};
          const series = all[id] ?? [];
          const last = series[series.length - 1];
          const weekMs = 7 * 24 * 60 * 60 * 1000;
          let baseTs: number;
          if (!last) {
            baseTs = Date.now();
          } else if (typeof last.ts === 'number' && Number.isFinite(last.ts)) {
            baseTs = last.ts + weekMs;
          } else {
            const parsed = Date.parse(last.date.replace(/-/g, '/'));
            baseTs = (Number.isFinite(parsed) ? parsed : Date.now()) + weekMs;
          }
          const label = (dateLabel && dateLabel.trim()) || new Date(baseTs).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          const rounded = Math.round(weight * 100) / 100;
          return {
            ...state,
            gymExerciseProgress: {
              ...all,
              [id]: [...series, { date: label, weight: rounded, reps: reps ?? null, ts: baseTs }],
            },
          };
        });
      },

      hideActivity: (key) => set((state) => ({ ...state, hiddenActivities: { ...state.hiddenActivities, [key]: true } })),
      restoreActivity: (key) => set((state) => {
        const { [key]: _removed, ...rest } = state.hiddenActivities;
        return { ...state, hiddenActivities: rest };
      }),

      setActivityTotalHours: (activity, hours) => {
        set((state) => {
          const current = state[activity];
          if (!current) return state as any;
          const safe = Number.isFinite(hours) && hours >= 0 ? Math.round(hours * 100) / 100 : current.totalHours;
          return {
            ...state,
            [activity]: {
              ...current,
              totalHours: safe,
            },
          } as any;
        });
      },

      hydrateFromServer: (payload) => {
        set((state) => ({
          ...state,
          ...(payload.boxing ? { boxing: { ...state.boxing, ...payload.boxing } } : {}),
          ...(payload.gym ? { gym: { ...state.gym, ...payload.gym } } : {}),
          ...(payload.oud ? { oud: { ...state.oud, ...payload.oud } } : {}),
          ...(payload.violin ? { violin: { ...state.violin, ...payload.violin } } : {}),
          ...(payload.spanish ? { spanish: { ...state.spanish, ...payload.spanish } } : {}),
          ...(payload.german ? { german: { ...state.german, ...payload.german } } : {}),
          ...(payload.customActivities ? { customActivities: payload.customActivities } : {}),
          ...(payload.hiddenActivities ? { hiddenActivities: payload.hiddenActivities } : {}),
          ...(payload.dailyActivityNames ? { dailyActivityNames: payload.dailyActivityNames } : {}),
          ...(payload.dailyActivityList ? { dailyActivityList: payload.dailyActivityList } : {}),
          ...(payload.gymExerciseNames ? { gymExerciseNames: payload.gymExerciseNames } : {}),
          ...(payload.gymExerciseCategories ? { gymExerciseCategories: payload.gymExerciseCategories } : {}),
          ...(payload.gymExerciseProgress ? { gymExerciseProgress: payload.gymExerciseProgress } : {}),
        }));
      },

      getSerializableState: () => {
        const s = get();
        return {
          boxing: s.boxing,
          gym: s.gym,
          oud: s.oud,
          violin: s.violin,
          spanish: s.spanish,
          german: s.german,
          customActivities: s.customActivities,
          hiddenActivities: s.hiddenActivities,
          dailyActivityNames: s.dailyActivityNames,
          dailyActivityList: s.dailyActivityList,
          gymExerciseNames: s.gymExerciseNames,
          gymExerciseCategories: s.gymExerciseCategories,
          gymExerciseProgress: s.gymExerciseProgress,
          minimalMode: s.minimalMode,
        };
      },
    }),
    {
    name: 'activity-storage',
  version: 12,
      // Basic migration to ensure optional fields exist and update defaults
      migrate: (persistedState: any, _version: number) => {
        if (!persistedState) return persistedState;
        const state = { ...persistedState };
        state.customActivities = state.customActivities ?? {};
        if (state.boxing) {
          state.boxing.fitnessTestHighest = state.boxing.fitnessTestHighest ?? 342;
          state.boxing.fitnessTestThisMonth = state.boxing.fitnessTestThisMonth ?? 0;
          // Seed fitness trend if missing
          if (!state.boxing.fitnessTestTrend || !Array.isArray(state.boxing.fitnessTestTrend) || state.boxing.fitnessTestTrend.length === 0) {
            const scores = [139, 264, 286, 213, 256, 317, 342];
            const now = new Date();
            const arr: Array<{ date: string; score: number; ts: number }> = [];
            for (let i = 6; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
              arr.push({ date: d.toLocaleString(undefined, { month: 'short' }), score: scores[i], ts: d.getTime() });
            }
            state.boxing.fitnessTestTrend = arr;
          }
          // Tape defaults and rename migration: fightTapeHours -> mmaTapeHours
          state.boxing.boxingTapeHours = state.boxing.boxingTapeHours ?? 0;
          if (state.boxing.mmaTapeHours === undefined && state.boxing.fightTapeHours !== undefined) {
            state.boxing.mmaTapeHours = state.boxing.fightTapeHours;
            delete (state.boxing as any).fightTapeHours;
          }
          state.boxing.mmaTapeHours = state.boxing.mmaTapeHours ?? 0;
          state.boxing.kickboxingTapeHours = state.boxing.kickboxingTapeHours ?? 0;
          state.boxing.boxingTapeTrend = state.boxing.boxingTapeTrend ?? [];
          if (typeof state.boxing.totalHours === 'number' && state.boxing.totalHours < 96) {
            state.boxing.totalHours = 96;
          }
          state.boxing.totalFights = state.boxing.totalFights ?? 1;
          state.boxing.wins = state.boxing.wins ?? 0;
          state.boxing.losses = state.boxing.losses ?? 1;
          state.boxing.draws = state.boxing.draws ?? 0;
          // Ensure highest/thisMonth derived from trend if present
          if (state.boxing.fitnessTestTrend && state.boxing.fitnessTestTrend.length > 0) {
            const highest = state.boxing.fitnessTestTrend.reduce((m: number, r: any) => Math.max(m, r.score), 0);
            const lastScore = state.boxing.fitnessTestTrend[state.boxing.fitnessTestTrend.length - 1].score;
            state.boxing.fitnessTestHighest = Math.max(state.boxing.fitnessTestHighest ?? 0, highest);
            state.boxing.fitnessTestThisMonth = lastScore;
          }
        }
        if (state.gym) {
          state.gym.powerLiftNames = state.gym.powerLiftNames ?? ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
          state.gym.powerLiftWeights = state.gym.powerLiftWeights ?? [100, 50, 50, 50];
          state.gym.weightTrend = state.gym.weightTrend ?? [];
          // Force default total hours to 24 if lower or uninitialized
          if (typeof state.gym.totalHours !== 'number' || state.gym.totalHours !== 24) {
            state.gym.totalHours = 24;
          }
        }
        state.dailyActivityNames = state.dailyActivityNames ?? [
          'Spanish writing',
          'German writing',
          'Oud 15 min',
          'Minoxidil',
          'Creatine',
        ];
        // Seed dailyActivityList from names if missing
        if (!state.dailyActivityList) {
          const cats = ['Learning','Learning','Music','Health','Health'];
          state.dailyActivityList = (state.dailyActivityNames as string[]).map((n, i) => ({ id: String(i+1), name: n, category: cats[i] || 'General' }));
        }
        state.gymExerciseNames = state.gymExerciseNames ?? {
          'flat-db-press': 'Flat DB Press',
          'flat-bpress-machine': 'Flat B-Press Machine',
          'high-low-cable-fly': 'High to Low Cable Fly',
          'tri-rope-pushdown': 'Tri Rope Pushdown',
          'db-lateral-raises': 'DB Lateral Raises',
          'shoulder-press-machine': 'Shoulder Press Machine',
        };
        state.gymExerciseCategories = state.gymExerciseCategories ?? {
          'flat-db-press': 'push',
          'flat-bpress-machine': 'push',
          'high-low-cable-fly': 'push',
          'tri-rope-pushdown': 'push',
          'db-lateral-raises': 'push',
          'shoulder-press-machine': 'push',
        };
        state.gymExerciseProgress = state.gymExerciseProgress ?? {};
  state.hiddenActivities = state.hiddenActivities ?? {};
  state.minimalMode = state.minimalMode ?? false;
        if (state.oud) {
          if (typeof state.oud.totalHours === 'number' && state.oud.totalHours < 16) {
            state.oud.totalHours = 16;
          }
          // Ensure at least 1 concert if tracked
          if (typeof state.oud.totalConcerts !== 'number' || state.oud.totalConcerts < 1) {
            state.oud.totalConcerts = 1;
          }
        }
        if (!state.violin) {
          state.violin = { ...initialActivityData, totalHours: 780, thisWeekSessions: 1, currentStreak: 2, totalConcerts: 5 };
        } else {
          state.violin.totalConcerts = state.violin.totalConcerts ?? 5;
          if (typeof state.violin.totalHours === 'number' && state.violin.totalHours < 780) {
            state.violin.totalHours = 780;
          }
        }
        if (state.spanish && typeof state.spanish.totalHours === 'number' && state.spanish.totalHours < 393) {
          state.spanish.totalHours = 393;
        }
        if (state.german && typeof state.german.totalHours === 'number' && state.german.totalHours < 556) {
          state.german.totalHours = 556;
        }
        return state;
      },
    }
  )
);
