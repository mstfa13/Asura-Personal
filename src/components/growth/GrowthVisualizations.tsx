import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HeatmapDay {
  date: string;
  value: number; // 0-4 intensity
  activities: string[];
}

interface ConsistencyHeatmapProps {
  data: HeatmapDay[];
  weeks?: number;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({ data, weeks = 12 }) => {
  const getColorClass = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    if (value === 1) return 'bg-green-200';
    if (value === 2) return 'bg-green-300';
    if (value === 3) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getTooltip = (day: HeatmapDay) => {
    return `${day.date}: ${day.activities.join(', ') || 'Rest day'}`;
  };

  // Generate grid for the last N weeks
  const generateWeeks = () => {
    const today = new Date();
    const weeksArray = [];
    
    for (let w = weeks - 1; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (w * 7) - today.getDay());
      
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        const dateStr = day.toISOString().split('T')[0];
        const dayData = data.find(item => item.date === dateStr) || {
          date: dateStr,
          value: 0,
          activities: []
        };
        weekDays.push(dayData);
      }
      weeksArray.push(weekDays);
    }
    
    return weeksArray;
  };

  const weeksData = generateWeeks();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Consistency Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          
          {/* Heatmap grid */}
          {weeksData.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`w-3 h-3 rounded-sm ${getColorClass(day.value)} cursor-pointer hover:ring-1 hover:ring-gray-400`}
                  title={getTooltip(day)}
                />
              ))}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ProgressTrajectoryProps {
  data: {
    activity: string;
    dataPoints: { date: string; value: number; label?: string }[];
    target?: number;
    color?: string;
  }[];
}

export const ProgressTrajectory: React.FC<ProgressTrajectoryProps> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap(d => d.dataPoints.map(p => p.value)));
  const normalizedHeight = 120;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Progress Trajectories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((trajectory, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{trajectory.activity}</span>
                {trajectory.target && (
                  <span className="text-xs text-gray-500">Target: {trajectory.target}</span>
                )}
              </div>
              
              <div className="relative" style={{ height: `${normalizedHeight / data.length}px` }}>
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="20" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 10" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Target line */}
                  {trajectory.target && (
                    <line
                      x1="0"
                      y1={normalizedHeight / data.length - (trajectory.target / maxValue) * (normalizedHeight / data.length)}
                      x2="100%"
                      y2={normalizedHeight / data.length - (trajectory.target / maxValue) * (normalizedHeight / data.length)}
                      stroke="#ef4444"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  )}
                  
                  {/* Progress line */}
                  <polyline
                    fill="none"
                    stroke={trajectory.color || "#3b82f6"}
                    strokeWidth="2"
                    points={trajectory.dataPoints.map((point, i) => {
                      const x = (i / (trajectory.dataPoints.length - 1)) * 100;
                      const y = normalizedHeight / data.length - (point.value / maxValue) * (normalizedHeight / data.length);
                      return `${x}%,${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Data points */}
                  {trajectory.dataPoints.map((point, i) => (
                    <circle
                      key={i}
                      cx={`${(i / (trajectory.dataPoints.length - 1)) * 100}%`}
                      cy={normalizedHeight / data.length - (point.value / maxValue) * (normalizedHeight / data.length)}
                      r="3"
                      fill={trajectory.color || "#3b82f6"}
                      className="hover:r-4 cursor-pointer"
                      title={`${point.date}: ${point.value} ${point.label || ''}`}
                    />
                  ))}
                </svg>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface QualityVsQuantityProps {
  data: {
    activity: string;
    sessions: {
      duration: number; // x-axis
      quality: number; // y-axis (1-10)
      date: string;
    }[];
    color?: string;
  }[];
}

export const QualityVsQuantityMatrix: React.FC<QualityVsQuantityProps> = ({ data }) => {
  const maxDuration = Math.max(...data.flatMap(d => d.sessions.map(s => s.duration)));
  const size = 200;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quality vs Time Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width={size} height={size} className="border">
            {/* Grid */}
            <defs>
              <pattern id="scatter-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#scatter-grid)" />
            
            {/* Axes */}
            <line x1="0" y1={size} x2={size} y2={size} stroke="#ccc" strokeWidth="1"/>
            <line x1="0" y1="0" x2="0" y2={size} stroke="#ccc" strokeWidth="1"/>
            
            {/* Quadrant labels */}
            <text x={size * 0.75} y="15" className="text-xs fill-gray-400" textAnchor="middle">High Quality</text>
            <text x={size * 0.25} y={size - 5} className="text-xs fill-gray-400" textAnchor="middle">Low Investment</text>
            
            {/* Data points */}
            {data.map((activity, activityIdx) =>
              activity.sessions.map((session, sessionIdx) => {
                const x = (session.duration / maxDuration) * size;
                const y = size - (session.quality / 10) * size;
                return (
                  <circle
                    key={`${activityIdx}-${sessionIdx}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={activity.color || `hsl(${activityIdx * 60}, 70%, 50%)`}
                    fillOpacity="0.7"
                    className="hover:r-6 cursor-pointer"
                    title={`${activity.activity}: ${session.duration}min, Quality ${session.quality}/10`}
                  />
                );
              })
            )}
          </svg>
          
          {/* Axis labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0min</span>
            <span>{maxDuration}min</span>
          </div>
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -translate-x-6">
            <span>10</span>
            <span>5</span>
            <span>0</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-3">
          {data.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activity.color || `hsl(${idx * 60}, 70%, 50%)` }}
              />
              <span className="text-xs">{activity.activity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface MilestoneTimelineProps {
  milestones: {
    title: string;
    date: Date;
    completed: boolean;
    activity: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  const sortedMilestones = milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedMilestones.slice(0, 5).map((milestone, idx) => {
            const daysUntil = Math.ceil((milestone.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntil < 0;
            
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.completed 
                    ? 'bg-green-500' 
                    : isOverdue 
                      ? 'bg-red-500' 
                      : getPriorityColor(milestone.priority)
                }`} />
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-gray-500">{milestone.activity}</p>
                </div>
                
                <div className="text-right">
                  <p className={`text-xs ${
                    milestone.completed 
                      ? 'text-green-600' 
                      : isOverdue 
                        ? 'text-red-600' 
                        : daysUntil <= 7 
                          ? 'text-orange-600' 
                          : 'text-gray-600'
                  }`}>
                    {milestone.completed 
                      ? 'Done' 
                      : isOverdue 
                        ? `${Math.abs(daysUntil)}d overdue`
                        : `${daysUntil}d left`
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
