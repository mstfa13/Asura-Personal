// Sample data generation script for testing gamification features
// This can be used to populate the app with sample data for demonstration

export const generateSampleData = () => {
  const sampleActivities = [
    { activity: 'Language Learning', duration: 30, category: 'education' },
    { activity: 'Boxing Training', duration: 45, category: 'fitness' },
    { activity: 'Gym Workout', duration: 60, category: 'fitness' },
    { activity: 'Career Development', duration: 90, category: 'career' },
    { activity: 'Reading', duration: 60, category: 'education' },
    { activity: 'Meditation', duration: 20, category: 'wellbeing' },
    { activity: 'Running', duration: 30, category: 'fitness' },
    { activity: 'Cooking', duration: 45, category: 'life-skills' }
  ];

  const sampleAchievements = [
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete an activity before 8 AM',
      category: 'progress',
      rarity: 'common',
      points: 25,
      icon: 'calendar'
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Complete an activity after 10 PM',
      category: 'progress',
      rarity: 'common',
      points: 25,
      icon: 'calendar'
    },
    {
      id: 'multitasker',
      title: 'Multitasker',
      description: 'Complete 3 different types of activities in one day',
      category: 'challenge',
      rarity: 'rare',
      points: 75,
      icon: 'target'
    },
    {
      id: 'marathon_learner',
      title: 'Marathon Learner',
      description: 'Complete a 3+ hour learning session',
      category: 'milestone',
      rarity: 'epic',
      points: 150,
      icon: 'trophy'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete all daily challenges for 7 days straight',
      category: 'streak',
      rarity: 'legendary',
      points: 500,
      icon: 'star'
    }
  ];

  const sampleChallenges = [
    {
      id: 'morning_routine',
      title: 'Morning Routine',
      description: 'Complete 3 activities before noon',
      category: 'daily',
      difficulty: 'medium',
      xpReward: 40,
      maxProgress: 3,
      requirements: ['Complete 3 activities before 12:00 PM']
    },
    {
      id: 'balanced_day',
      title: 'Balanced Day',
      description: 'Complete at least one fitness and one learning activity',
      category: 'daily',
      difficulty: 'easy',
      xpReward: 30,
      maxProgress: 2,
      requirements: ['Complete 1 fitness activity', 'Complete 1 learning activity']
    },
    {
      id: 'power_week',
      title: 'Power Week',
      description: 'Accumulate 10+ hours of activities this week',
      category: 'weekly',
      difficulty: 'hard',
      xpReward: 200,
      maxProgress: 600, // 10 hours in minutes
      requirements: ['Accumulate 600+ minutes of activities this week']
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Complete 5 relationship-building activities this month',
      category: 'monthly',
      difficulty: 'medium',
      xpReward: 100,
      maxProgress: 5,
      requirements: ['Complete 5 relationship-focused activities this month']
    }
  ];

  const sampleLeaderboard = [
    {
      id: 'user1',
      name: 'You',
      level: 5,
      totalXP: 1250,
      weeklyXP: 320,
      rank: 1,
      achievements: 8,
      isCurrentUser: true
    },
    {
      id: 'sarah_dev',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      level: 4,
      totalXP: 980,
      weeklyXP: 280,
      rank: 2,
      achievements: 6
    },
    {
      id: 'mike_fitness',
      name: 'Mike Wilson',
      avatar: '/avatars/mike.jpg',
      level: 6,
      totalXP: 1450,
      weeklyXP: 150,
      rank: 3,
      achievements: 12
    },
    {
      id: 'alex_learner',
      name: 'Alex Johnson',
      avatar: '/avatars/alex.jpg',
      level: 3,
      totalXP: 750,
      weeklyXP: 200,
      rank: 4,
      achievements: 4
    },
    {
      id: 'emma_balanced',
      name: 'Emma Davis',
      avatar: '/avatars/emma.jpg',
      level: 5,
      totalXP: 1100,
      weeklyXP: 190,
      rank: 5,
      achievements: 9
    }
  ];

  return {
    sampleActivities,
    sampleAchievements,
    sampleChallenges,
    sampleLeaderboard
  };
};

// Function to simulate activity completion
export const simulateActivityCompletion = (activity: string, duration: number) => {
  const xpGained = duration * 2; // 2 XP per minute
  const timestamp = new Date();
  
  return {
    activity,
    duration,
    xpGained,
    timestamp,
    category: getCategoryFromActivity(activity)
  };
};

// Helper function to categorize activities
const getCategoryFromActivity = (activity: string): string => {
  const categories = {
    'Language Learning': 'education',
    'Boxing Training': 'fitness',
    'Gym Workout': 'fitness',
    'Career Development': 'career',
    'Reading': 'education',
    'Meditation': 'wellbeing',
    'Running': 'fitness',
    'Cooking': 'life-skills'
  };
  
  return categories[activity as keyof typeof categories] || 'general';
};

// Function to generate random activity session
export const generateRandomActivity = () => {
  const { sampleActivities } = generateSampleData();
  const randomActivity = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
  const randomDuration = Math.floor(Math.random() * 90) + 15; // 15-105 minutes
  
  return simulateActivityCompletion(randomActivity.activity, randomDuration);
};

// Function to check if achievements should be unlocked
export const checkAchievementTriggers = (userStats: any) => {
  const triggers = [];
  
  // Check for milestone achievements
  if (userStats.totalHours >= 100) {
    triggers.push('century_club');
  }
  
  if (userStats.dailyStreak >= 7) {
    triggers.push('week_streak');
  }
  
  if (userStats.dailyStreak >= 30) {
    triggers.push('month_streak');
  }
  
  // Check for activity-specific achievements
  if (userStats.languageLevel >= 5) {
    triggers.push('language_level_5');
  }
  
  if (userStats.boxingLevel >= 4) {
    triggers.push('boxing_level_4');
  }
  
  return triggers;
};

export default generateSampleData;
