// Simple, personal tracking data model - focused on motivation, not optimization

export interface SimpleActivity {
  id: string;
  name: string;
  emoji: string;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
  mood: 'great' | 'good' | 'okay' | 'tired';
  note?: string; // Optional personal reflection
  completed: boolean;
}

export interface PersonalStreak {
  activity: string;
  emoji: string;
  current: number;
  best: number;
}

export interface WeeklyGoal {
  id: string;
  activity: string;
  target: number;
  current: number;
  emoji: string;
}

export interface PersonalWin {
  id: string;
  date: string;
  text: string;
  emoji: string;
  activity?: string;
}

export const moodEmojis = {
  great: '😄',
  good: '😊', 
  okay: '😐',
  tired: '😴'
};

export const moodLabels = {
  great: 'Great!',
  good: 'Good',
  okay: 'Okay',
  tired: 'Tired'
};

// Sample data for the personal dashboard
export const sampleActivities: SimpleActivity[] = [
  {
    id: '1',
    name: 'Boxing',
    emoji: '🥊',
    duration: 45,
    date: '2025-09-15',
    mood: 'great',
    note: 'Nailed that jab-cross combo! Feeling strong 💪',
    completed: true
  },
  {
    id: '2', 
    name: 'Oud Practice',
    emoji: '🎵',
    duration: 30,
    date: '2025-09-15',
    mood: 'good',
    note: 'New song is coming together nicely',
    completed: true
  },
  {
    id: '3',
    name: 'Gym',
    emoji: '💪',
    duration: 60,
    date: '2025-09-14',
    mood: 'great',
    note: 'PR on bench press! 🎉',
    completed: true
  },
  {
    id: '4',
    name: 'Boxing', 
    emoji: '🥊',
    duration: 40,
    date: '2025-09-14',
    mood: 'good',
    completed: true
  },
  {
    id: '5',
    name: 'Oud Practice',
    emoji: '🎵', 
    duration: 25,
    date: '2025-09-13',
    mood: 'okay',
    note: 'Struggled with timing but kept going',
    completed: true
  }
];

export const sampleStreaks: PersonalStreak[] = [
  { activity: 'Boxing', emoji: '🥊', current: 5, best: 8 },
  { activity: 'Oud Practice', emoji: '🎵', current: 3, best: 12 },
  { activity: 'Gym', emoji: '💪', current: 2, best: 6 }
];

export const sampleWeeklyGoals: WeeklyGoal[] = [
  { id: '1', activity: 'Boxing', emoji: '🥊', target: 3, current: 2 },
  { id: '2', activity: 'Oud Practice', emoji: '🎵', target: 4, current: 3 },
  { id: '3', activity: 'Gym', emoji: '💪', target: 2, current: 1 }
];

export const samplePersonalWins: PersonalWin[] = [
  {
    id: '1',
    date: '2025-09-15',
    text: 'Completed morning boxing session even though I was tired!',
    emoji: '🏆',
    activity: 'Boxing'
  },
  {
    id: '2', 
    date: '2025-09-14',
    text: 'Hit a new personal record on bench press! 💪',
    emoji: '🎉',
    activity: 'Gym'
  },
  {
    id: '3',
    date: '2025-09-13', 
    text: 'Played through a whole song without stopping 🎵',
    emoji: '✨',
    activity: 'Oud Practice'
  },
  {
    id: '4',
    date: '2025-09-12',
    text: 'Showed up even on a busy day - consistency wins!',
    emoji: '🌟'
  }
];

export const upcomingActivities = [
  { activity: 'Gym', emoji: '💪', time: 'Tomorrow 7 AM' },
  { activity: 'Oud Practice', emoji: '🎵', time: 'Tomorrow 8 PM' },
  { activity: 'Boxing', emoji: '🥊', time: 'Tuesday 6 PM' }
];

// Helper functions
export const getCurrentMood = (): keyof typeof moodEmojis => {
  const recentActivity = sampleActivities
    .filter(a => a.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  return recentActivity?.mood || 'okay';
};

export const getThisWeekActivities = (): SimpleActivity[] => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return sampleActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= oneWeekAgo && activity.completed;
  });
};

export const getActivityTimeThisWeek = (): Record<string, number> => {
  const thisWeekActivities = getThisWeekActivities();
  
  return thisWeekActivities.reduce((acc, activity) => {
    acc[activity.name] = (acc[activity.name] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);
};
