// Program data model for Gym dashboard. Fill this from your PDF plan.
// Replace placeholder values only; structure stays the same.

export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // e.g., "4x6-8" or "3x10"
  tempo?: string; // e.g., "3-1-1"
  rest?: string; // e.g., "90s"
  notes?: string;
}

export interface SessionTemplate {
  title: string; // e.g., "Push", "Pull", "Legs", "Upper", "Lower"
  focus?: string; // e.g., "Hypertrophy chest/shoulders"
  exercises: Exercise[];
}

export interface WeeklySplitDay {
  day: DayName;
  session?: SessionTemplate; // rest day has no session
  cardio?: { type: string; durationMin: number; zone?: string };
  notes?: string;
}

export interface KeyLift {
  name: string; // e.g., "Bench Press"
  current?: number; // in lbs or kg (free text units in unit field)
  target?: number;
  unit?: 'kg' | 'lbs';
  note?: string;
}

export interface BodyComposition {
  currentWeight?: { value: number; unit: 'kg' | 'lbs' };
  targetWeight?: { value: number; unit: 'kg' | 'lbs' };
  bodyFat?: { value: number; unit: '%' };
  muscleMass?: { value: number; unit: 'kg' | 'lbs' };
  checkIn?: string; // e.g., "Weekly on Sunday"
}

export interface RecentWorkoutEntry {
  title: string;
  subtitle?: string;
  duration?: string; // e.g., "1h 15m"
  when?: string; // e.g., "Today", "Yesterday"
}

export interface GymPlan {
  phase: string; // e.g., "Phase A2"
  week?: number;
  nextSessionTitle?: string; // computed by you or manual
  weeklySplit: WeeklySplitDay[];
  keyLifts: KeyLift[];
  bodyComposition: BodyComposition;
  recentWorkouts: RecentWorkoutEntry[];
}

// TODO: Paste your plan details here based on the PDF
export const gymPlan: GymPlan = {
  phase: 'Phase A2',
  week: 1,
  nextSessionTitle: 'Push',
  weeklySplit: [
    { day: 'Monday', session: { title: 'Push', focus: 'Chest/Shoulders', exercises: [
      { name: 'Bench Press', sets: 4, reps: '6–8', rest: '120s' },
      { name: 'Incline DB Press', sets: 3, reps: '8–10' },
      { name: 'Overhead Press', sets: 3, reps: '6–8' },
      { name: 'Lateral Raise', sets: 3, reps: '12–15' }
    ] } },
    { day: 'Tuesday', session: { title: 'Pull', focus: 'Back/Biceps', exercises: [
      { name: 'Deadlift', sets: 3, reps: '3–5', rest: '180s' },
      { name: 'Pull-ups', sets: 4, reps: '6–8' },
      { name: 'Barbell Row', sets: 3, reps: '6–8' }
    ] } },
    { day: 'Wednesday' },
    { day: 'Thursday', session: { title: 'Legs', focus: 'Quads/Glutes', exercises: [
      { name: 'Back Squat', sets: 4, reps: '5–7', rest: '150s' },
      { name: 'RDL', sets: 3, reps: '6–8' },
      { name: 'Leg Press', sets: 3, reps: '10–12' }
    ] } },
    { day: 'Friday', cardio: { type: 'Zone 2', durationMin: 30, zone: 'Z2' } },
    { day: 'Saturday', session: { title: 'Upper', focus: 'Hypertrophy upper', exercises: [
      { name: 'Incline Press', sets: 3, reps: '8–10' },
      { name: 'Seated Row', sets: 3, reps: '8–10' },
      { name: 'Face Pull', sets: 3, reps: '12–15' }
    ] } },
    { day: 'Sunday' }
  ],
  keyLifts: [
    { name: 'Bench Press', current: 185, target: 200, unit: 'lbs' },
    { name: 'Squat', current: 225, target: 245, unit: 'lbs' },
    { name: 'Deadlift', current: 275, target: 295, unit: 'lbs' }
  ],
  bodyComposition: {
    currentWeight: { value: 175, unit: 'lbs' },
    targetWeight: { value: 180, unit: 'lbs' },
    bodyFat: { value: 12.5, unit: '%' },
    muscleMass: { value: 153, unit: 'lbs' },
    checkIn: 'Weekly on Sunday'
  },
  recentWorkouts: [
    { title: 'Push Day', subtitle: 'Chest, Shoulders, Triceps', duration: '1h 15m', when: 'Today' },
    { title: 'Pull Day', subtitle: 'Back, Biceps', duration: '1h 30m', when: 'Yesterday' },
    { title: 'Leg Day', subtitle: 'Quads, Hamstrings, Calves', duration: '1h 45m', when: '2 days ago' }
  ]
};
