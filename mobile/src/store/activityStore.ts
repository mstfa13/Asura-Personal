import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ActivityData {
  totalHours: number;
  thisWeekSessions: number;
  currentStreak: number;
  lastSession: string | null;
  dailyGoalMinutes?: number;
  todayMinutes?: number;
  todayDate?: string;
  // Domain-specific optional fields
  powerLiftNames?: string[];
  powerLiftWeights?: number[];
  weightTrend?: Array<{ date: string; weight: number; ts?: number }>;
  totalConcerts?: number;
  booksRead?: number;
}

export type CoreActivity = 'boxing' | 'gym' | 'oud' | 'spanish' | 'german';

export interface ActivityStoreState {
  boxing: ActivityData;
  gym: ActivityData;
  oud: ActivityData;
  spanish: ActivityData;
  german: ActivityData;
  customActivities: Record<string, { name: string; template?: 'language' | 'gym' | 'music' | 'boxing'; data: ActivityData }>;
  addHours: (activity: CoreActivity, hours: number) => void;
  addCustomHours: (slug: string, hours: number) => void;
  getCustomActivity: (slug: string) => { name: string; data: ActivityData } | undefined;
  listCustomActivities: () => Array<{ slug: string; name: string; data: ActivityData }>;
  setDailyGoal: (activity: Exclude<CoreActivity, 'gym'>, minutes: number) => void; // gym currently not using daily goal
  addTodayMinutes: (activity: Exclude<CoreActivity, 'gym'>, minutes: number) => void;
  setBooksRead: (activity: 'spanish' | 'german', count: number) => void;
}

const initial: ActivityData = {
  totalHours: 0,
  thisWeekSessions: 0,
  currentStreak: 0,
  lastSession: null,
  dailyGoalMinutes: 30,
  todayMinutes: 0,
  todayDate: new Date().toDateString(),
};

export const useActivityStore = create<ActivityStoreState>()(
  persist<ActivityStoreState>(
    (set, get) => ({
      boxing: { ...initial },
      gym: { ...initial },
      oud: { ...initial },
      spanish: { ...initial, booksRead: 0 },
      german: { ...initial, booksRead: 0 },
      customActivities: {},
  addHours: (activity: CoreActivity, hours: number) => {
        set((state) => {
          const current = (state as ActivityStoreState)[activity];
          const today = new Date().toDateString();
          return {
            ...state,
            [activity]: {
              ...current,
              totalHours: Math.round((current.totalHours + hours) * 100) / 100,
              thisWeekSessions: current.thisWeekSessions + 1,
              currentStreak: current.lastSession !== today ? current.currentStreak + 1 : current.currentStreak,
              lastSession: today,
            },
          };
        });
      },
      addCustomHours: (slug: string, hours: number) => {
        set((state: ActivityStoreState) => {
          const entry = state.customActivities[slug];
          if (!entry) return state as any;
          const today = new Date().toDateString();
          const current = entry.data;
          const updated = {
            ...current,
            totalHours: Math.round((current.totalHours + hours) * 100) / 100,
            thisWeekSessions: current.thisWeekSessions + 1,
            currentStreak: current.lastSession !== today ? current.currentStreak + 1 : current.currentStreak,
            lastSession: today,
          };
          return {
            ...state,
            customActivities: {
              ...state.customActivities,
              [slug]: { ...entry, data: updated },
            },
          };
        });
      },
      getCustomActivity: (slug: string) => get().customActivities[slug],
      listCustomActivities: () => Object.entries(get().customActivities).map(([slug, v]) => ({ slug, name: (v as any).name, data: (v as any).data })),
      setDailyGoal: (activity: 'boxing' | 'oud' | 'spanish' | 'german', minutes: number) => {
        set((state: ActivityStoreState) => ({
          ...state,
          [activity]: {
            ...(state as ActivityStoreState)[activity],
            dailyGoalMinutes: minutes,
          },
        }));
      },
      addTodayMinutes: (activity: 'boxing' | 'oud' | 'spanish' | 'german', minutes: number) => {
        set((state: ActivityStoreState) => {
          const current = (state as ActivityStoreState)[activity];
          const today = new Date().toDateString();
          const isToday = current.todayDate === today;
          const base = isToday ? current.todayMinutes || 0 : 0;
          return {
            ...state,
            [activity]: {
              ...current,
              todayDate: today,
              todayMinutes: base + minutes,
            },
          };
        });
      },
      setBooksRead: (activity: 'spanish' | 'german', count: number) => {
        set((state: ActivityStoreState) => ({
          ...state,
          [activity]: {
            ...(state as ActivityStoreState)[activity],
            booksRead: Math.max(0, Math.floor(count)),
          },
        }));
      },
    }),
    {
      name: 'asura-mobile-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
