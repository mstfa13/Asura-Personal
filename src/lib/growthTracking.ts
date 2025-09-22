// Growth Optimization Data Models
// Transform from logging mindset to growth optimization mindset

export type ActivityType = 'boxing' | 'gym' | 'oud' | 'spanish' | 'german' | 'daily_activities';

export interface QualityMetrics {
  effectiveness: number; // 1-10 subjective rating
  energy: number; // 1-10 energy level during activity
  satisfaction: number; // 1-10 satisfaction with session
  focus: number; // 1-10 focus level
  notes?: string;
}

export interface SkillProgression {
  activityType: ActivityType;
  skillArea: string; // e.g., "technique", "power", "repertoire", "vocabulary"
  currentLevel: number; // 1-10 scale
  targetLevel: number;
  lastAssessed: Date;
  progressRate: number; // change per week
  milestones: string[];
}

export interface ActivitySession {
  id: string;
  activityType: ActivityType;
  date: Date;
  duration: number; // minutes
  quality: QualityMetrics;
  skillWork: {
    area: string;
    timeSpent: number; // minutes
    qualityRating: number; // 1-10
  }[];
  outcomes: string[]; // what was accomplished
  challenges: string[]; // what was difficult
  nextFocus?: string; // what to work on next
}

export interface Goal {
  id: string;
  title: string;
  activityType: ActivityType;
  targetDate: Date;
  description: string;
  successMetrics: {
    metric: string;
    target: number;
    current: number;
    unit: string;
  }[];
  milestones: {
    title: string;
    targetDate: Date;
    completed: boolean;
    completedDate?: Date;
  }[];
  priority: 'low' | 'medium' | 'high';
}

export interface Streak {
  activityType: ActivityType;
  current: number; // current streak days
  longest: number; // longest streak ever
  lastActivity: Date;
  targetDays: number; // weekly target
}

export interface WeeklyMomentum {
  week: string; // ISO week string
  activities: {
    [key in ActivityType]?: {
      sessions: number;
      totalMinutes: number;
      avgQuality: number;
      progressScore: number; // calculated momentum
    };
  };
  overallMomentum: number; // 1-100 score
  trendDirection: 'improving' | 'maintaining' | 'declining';
}

export interface CrossActivityInsight {
  primaryActivity: ActivityType;
  influencedActivity: ActivityType;
  correlationType: 'positive' | 'negative' | 'neutral';
  strength: number; // 0-1, how strong the correlation
  description: string;
  lastUpdated: Date;
}

export interface WeeklyReflection {
  week: string;
  satisfactionScores: {
    [key in ActivityType]?: number; // 1-10
  };
  energyLevels: {
    [key in ActivityType]?: number; // 1-10
  };
  challengesFaced: string[];
  winsAchieved: string[];
  nextWeekFocus: string[];
  balanceRating: number; // 1-10 how balanced the week felt
}

export interface Recommendation {
  id: string;
  type: 'time_allocation' | 'skill_focus' | 'recovery' | 'cross_training' | 'goal_adjustment';
  title: string;
  description: string;
  activityType?: ActivityType;
  priority: number; // 1-10
  reasoning: string;
  actionItems: string[];
  expectedImpact: string;
  timeframe: 'this_week' | 'this_month' | 'this_quarter';
}

export interface GrowthState {
  // Current tracking data
  sessions: ActivitySession[];
  goals: Goal[];
  streaks: Streak[];
  weeklyMomentum: WeeklyMomentum[];
  skillProgressions: SkillProgression[];
  crossActivityInsights: CrossActivityInsight[];
  weeklyReflections: WeeklyReflection[];
  recommendations: Recommendation[];
  
  // Computed metrics
  getCurrentMomentumScore: () => number;
  getActivityStreaks: () => Streak[];
  getActiveGoals: () => Goal[];
  getThisWeekFocus: () => string[];
  getLifeBalance: () => { [key in ActivityType]?: number };
  getTrendAnalysis: (weeks: number) => {
    activity: ActivityType;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
  }[];
  getPredictedMilestones: () => {
    goalId: string;
    milestoneTitle: string;
    predictedDate: Date;
    confidence: number;
  }[];
  getSmartRecommendations: () => Recommendation[];
}

// Utility functions for calculations
export const calculateMomentumScore = (sessions: ActivitySession[], timeframe: number = 7): number => {
  const recentSessions = sessions.filter(s => {
    const daysSince = (Date.now() - s.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= timeframe;
  });
  
  if (recentSessions.length === 0) return 0;
  
  const consistency = Math.min(100, (recentSessions.length / timeframe) * 100);
  const avgQuality = recentSessions.reduce((sum, s) => 
    sum + (s.quality.effectiveness + s.quality.satisfaction + s.quality.focus) / 3, 0
  ) / recentSessions.length;
  const timeInvestment = recentSessions.reduce((sum, s) => sum + s.duration, 0);
  
  return Math.round((consistency * 0.4) + (avgQuality * 10 * 0.4) + Math.min(20, timeInvestment / 30) * 0.2);
};

export const calculateProgressRate = (skill: SkillProgression, sessions: ActivitySession[]): number => {
  const skillSessions = sessions.filter(s => 
    s.activityType === skill.activityType &&
    s.skillWork.some(sw => sw.area === skill.skillArea)
  ).slice(-10); // last 10 sessions
  
  if (skillSessions.length < 2) return 0;
  
  const recentQuality = skillSessions.slice(-3).reduce((sum, s) => {
    const skillWork = s.skillWork.find(sw => sw.area === skill.skillArea);
    return sum + (skillWork?.qualityRating || 0);
  }, 0) / 3;
  
  const earlierQuality = skillSessions.slice(0, 3).reduce((sum, s) => {
    const skillWork = s.skillWork.find(sw => sw.area === skill.skillArea);
    return sum + (skillWork?.qualityRating || 0);
  }, 0) / 3;
  
  return (recentQuality - earlierQuality) / skillSessions.length * 7; // weekly rate
};

export const generateRecommendations = (
  sessions: ActivitySession[], 
  goals: Goal[], 
  streaks: Streak[]
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Low consistency recommendation
  const lowStreaks = streaks.filter(s => s.current < s.targetDays * 0.7);
  lowStreaks.forEach(streak => {
    recommendations.push({
      id: `consistency_${streak.activityType}`,
      type: 'time_allocation',
      title: `Boost ${streak.activityType} consistency`,
      description: `Currently ${streak.current} days, target is ${streak.targetDays}`,
      activityType: streak.activityType,
      priority: 8,
      reasoning: 'Consistency is the foundation of long-term progress',
      actionItems: ['Schedule specific time slots', 'Start with shorter sessions', 'Set daily reminders'],
      expectedImpact: 'Improved skill retention and faster progress',
      timeframe: 'this_week'
    });
  });
  
  // Quality improvement recommendation
  const recentSessions = sessions.filter(s => {
    const daysSince = (Date.now() - s.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  });
  
  const lowQualityActivities = Object.values(
    recentSessions.reduce((acc, session) => {
      if (!acc[session.activityType]) {
        acc[session.activityType] = { total: 0, count: 0, activity: session.activityType };
      }
      acc[session.activityType].total += session.quality.effectiveness;
      acc[session.activityType].count += 1;
      return acc;
    }, {} as Record<ActivityType, { total: number; count: number; activity: ActivityType }>)
  ).filter(activity => activity.total / activity.count < 6);
  
  lowQualityActivities.forEach(activity => {
    recommendations.push({
      id: `quality_${activity.activity}`,
      type: 'skill_focus',
      title: `Improve ${activity.activity} session quality`,
      description: `Recent effectiveness rating: ${(activity.total / activity.count).toFixed(1)}/10`,
      activityType: activity.activity,
      priority: 7,
      reasoning: 'Higher quality sessions lead to better outcomes',
      actionItems: ['Review session structure', 'Eliminate distractions', 'Set clear objectives'],
      expectedImpact: 'Better skill development and satisfaction',
      timeframe: 'this_week'
    });
  });
  
  return recommendations.sort((a, b) => b.priority - a.priority);
};

// Default sample data
export const sampleGrowthData = {
  sessions: [
    {
      id: '1',
      activityType: 'boxing' as ActivityType,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      duration: 90,
      quality: { effectiveness: 8, energy: 7, satisfaction: 8, focus: 7 },
      skillWork: [
        { area: 'technique', timeSpent: 45, qualityRating: 8 },
        { area: 'power', timeSpent: 30, qualityRating: 7 }
      ],
      outcomes: ['Improved jab technique', 'Good power on hooks'],
      challenges: ['Footwork timing'],
      nextFocus: 'Focus on defensive positioning'
    }
  ],
  goals: [
    {
      id: 'goal1',
      title: 'Master 5 Oud Pieces',
      activityType: 'oud' as ActivityType,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      description: 'Learn and master 5 traditional oud pieces to performance level',
      successMetrics: [
        { metric: 'pieces_mastered', target: 5, current: 2, unit: 'pieces' },
        { metric: 'performance_quality', target: 8, current: 6, unit: 'rating' }
      ],
      milestones: [
        { title: 'Learn piece 3', targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), completed: false },
        { title: 'Learn piece 4', targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), completed: false }
      ],
      priority: 'high' as const
    }
  ],
  streaks: [
    { activityType: 'boxing' as ActivityType, current: 5, longest: 12, lastActivity: new Date(), targetDays: 4 },
    { activityType: 'oud' as ActivityType, current: 3, longest: 8, lastActivity: new Date(), targetDays: 5 },
    { activityType: 'spanish' as ActivityType, current: 7, longest: 15, lastActivity: new Date(), targetDays: 7 }
  ]
};

// Export individual sample data arrays
export const sampleActivities = sampleGrowthData.sessions;
export const sampleGoals = sampleGrowthData.goals;
export const sampleStreaks = sampleGrowthData.streaks;

// Sample heatmap data for visualizations
export const sampleHeatmapData = (() => {
  const data = [];
  const today = new Date();
  
  for (let i = 84; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random activity pattern
    const value = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
    const activities = value > 0 ? ['boxing', 'oud', 'spanish'].filter(() => Math.random() > 0.5) : [];
    
    data.push({
      date: dateStr,
      value,
      activities
    });
  }
  
  return data;
})();

// Sample cross-activity insights
export const sampleCrossActivityInsights = [
  {
    primaryActivity: 'gym',
    influencedActivity: 'boxing',
    correlationType: 'positive' as const,
    strength: 78,
    description: 'Gym strength training sessions significantly improve boxing power and endurance performance.',
    actionable: 'Schedule gym sessions 24-48h before boxing training for optimal power transfer.',
    confidence: 85,
    lastUpdated: '2 days ago'
  },
  {
    primaryActivity: 'oud',
    influencedActivity: 'focus',
    correlationType: 'positive' as const,
    strength: 65,
    description: 'Oud practice sessions enhance focus and concentration across all other activities.',
    actionable: 'Use 15-20 minute oud sessions as mental warm-up before challenging tasks.',
    confidence: 72,
    lastUpdated: '1 week ago'
  },
  {
    primaryActivity: 'boxing',
    influencedActivity: 'stress_management',
    correlationType: 'positive' as const,
    strength: 82,
    description: 'High-intensity boxing sessions provide excellent stress relief and emotional regulation.',
    actionable: 'Schedule boxing sessions after stressful days or when tension builds up.',
    confidence: 89,
    lastUpdated: '3 days ago'
  },
  {
    primaryActivity: 'late_night_activities',
    influencedActivity: 'morning_energy',
    correlationType: 'negative' as const,
    strength: 71,
    description: 'Activities past 10 PM consistently reduce next-day morning energy and session quality.',
    actionable: 'Establish 10 PM cutoff for intensive activities to optimize next-day performance.',
    confidence: 76,
    lastUpdated: '5 days ago'
  }
];
