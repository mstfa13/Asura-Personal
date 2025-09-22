
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import SimpleCalendar from '@/components/SimpleCalendar';
import { 
  samplePersonalWins, 
  sampleStreaks, 
  sampleWeeklyGoals, 
  upcomingActivities, 
  getCurrentMood, 
  getActivityTimeThisWeek,
  moodEmojis,
  moodLabels,
  type SimpleActivity
} from '@/lib/personalTracking';
import { Calendar, Plus, Heart, Star, Zap, Clock } from 'lucide-react';

export default function Index() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [todaysReflection, setTodaysReflection] = useState('');
  const [quickActivity, setQuickActivity] = useState({
    name: '',
    duration: '',
    mood: 'good' as keyof typeof moodEmojis,
    note: ''
  });

  const currentMood = getCurrentMood();
  const weeklyActivityTime = getActivityTimeThisWeek();
  const totalWeeklyTime = Object.values(weeklyActivityTime).reduce((sum, time) => sum + time, 0);

  const handleQuickAdd = () => {
    // In a real app, this would save to state/database
    console.log('Adding activity:', quickActivity);
    setShowQuickAdd(false);
    setQuickActivity({ name: '', duration: '', mood: 'good', note: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Friendly Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hey there! 👋
              </h1>
              <p className="text-gray-600 mt-1">How's your journey going today?</p>
            </div>
            <Button 
              onClick={() => setShowQuickAdd(!showQuickAdd)} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Add Panel */}
        {showQuickAdd && (
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Activity</label>
                  <Input
                    placeholder="e.g., Boxing, Gym, Oud Practice"
                    value={quickActivity.name}
                    onChange={(e) => setQuickActivity({...quickActivity, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={quickActivity.duration}
                    onChange={(e) => setQuickActivity({...quickActivity, duration: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">How are you feeling?</label>
                <div className="flex gap-2">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      onClick={() => setQuickActivity({...quickActivity, mood: mood as keyof typeof moodEmojis})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        quickActivity.mood === mood 
                          ? 'border-blue-500 bg-blue-100 scale-105' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-2xl">{emoji}</div>
                      <div className="text-xs font-medium">{moodLabels[mood as keyof typeof moodLabels]}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Quick note (optional)</label>
                <Input
                  placeholder="How did it go? Any wins or insights?"
                  value={quickActivity.note}
                  onChange={(e) => setQuickActivity({...quickActivity, note: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleQuickAdd} className="bg-green-500 hover:bg-green-600">
                  <Heart className="w-4 h-4 mr-2" />
                  Log It!
                </Button>
                <Button variant="outline" onClick={() => setShowQuickAdd(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 4 Simple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* This Week's Wins */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                This Week's Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {samplePersonalWins.slice(0, 3).map(win => (
                  <div key={win.id} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{win.emoji}</span>
                    <span className="text-gray-700 line-clamp-1">{win.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 mt-3 font-medium">
                🎉 You're doing amazing! Keep it up!
              </p>
            </CardContent>
          </Card>

          {/* Current Streaks */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5" />
                Current Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleStreaks.map(streak => (
                  <div key={streak.activity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{streak.emoji}</span>
                      <span className="font-medium text-gray-800">{streak.activity}</span>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {streak.current} days
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-3 font-medium">
                🔥 Momentum is building!
              </p>
            </CardContent>
          </Card>

          {/* Energy Check */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5" />
                Energy Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl mb-2">{moodEmojis[currentMood]}</div>
                <div className="text-xl font-bold text-gray-800 mb-1">
                  {moodLabels[currentMood]}
                </div>
                <div className="text-sm text-blue-600">
                  Based on recent activities
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3 font-medium text-center">
                💙 Your energy matters!
              </p>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-800 flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                What's Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingActivities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{activity.emoji}</span>
                    <div>
                      <div className="font-medium text-gray-800">{activity.activity}</div>
                      <div className="text-xs text-purple-600">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-purple-600 mt-3 font-medium">
                ✨ Exciting things ahead!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Monthly Calendar */}
          <div className="lg:col-span-1">
            <SimpleCalendar />
          </div>

          {/* Center: This Week's Overview */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                This Week's Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-800">{totalWeeklyTime} min</div>
                  <div className="text-sm text-gray-600">Total time this week</div>
                </div>
                
                {Object.entries(weeklyActivityTime).map(([activity, time]) => (
                  <div key={activity} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{activity}</span>
                      <span className="text-gray-600">{time} min</span>
                    </div>
                    <Progress 
                      value={(time / Math.max(...Object.values(weeklyActivityTime))) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  🌟 Every minute counts!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right: Personal Notes & Goals */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Personal Notes & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Weekly Goals */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">This Week's Goals</h4>
                <div className="space-y-3">
                  {sampleWeeklyGoals.map(goal => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span>{goal.emoji}</span>
                          <span>{goal.activity}</span>
                        </span>
                        <span className="text-gray-600">{goal.current}/{goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Reflection */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Today's Reflection</h4>
                <Textarea
                  placeholder="How are you feeling today? Any wins or insights to capture?"
                  value={todaysReflection}
                  onChange={(e) => setTodaysReflection(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <p className="text-xs text-gray-500 text-center">
                💭 Your thoughts matter
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
