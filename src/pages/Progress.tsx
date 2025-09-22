import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityStore } from '@/lib/activityStore';
import { TrendingUp } from 'lucide-react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function Progress() {
  const { boxing, gym, oud, spanish, german, customActivities } = useActivityStore();
  const customs = React.useMemo(() => Object.entries(customActivities).map(([slug, v]) => ({ slug, ...v })), [customActivities]);

  // Level helpers (keep consistent with individual pages)
  const getBoxingLevel = (h: number) =>
    h >= 1500 ? 7 : h >= 1000 ? 7 : h >= 600 ? 6 : h >= 300 ? 5 : h >= 150 ? 4 : h >= 80 ? 3 : h >= 20 ? 2 : 1;
  const getLanguageLevel = (h: number) =>
    h >= 1000 ? 7 : h >= 600 ? 5 : h >= 300 ? 4 : h >= 150 ? 3 : h >= 50 ? 2 : 1;
  const getOudLevel = (h: number) =>
    h >= 1500 ? 7 : h >= 1000 ? 6 : h >= 600 ? 5 : h >= 300 ? 4 : h >= 150 ? 3 : h >= 60 ? 2 : 1;
  // Gym: derive level from power lifts + bodyweight (mirrors Gym page logic)
  const gymPower = gym?.powerLiftWeights ?? [0, 0, 0, 0];
  const squat = gymPower[0] ?? 0;
  const bench = gymPower[1] ?? 0;
  const hip = gymPower[3] ?? 0;
  const bodyweight = (() => {
    const trend = gym?.weightTrend ?? [];
    return trend.length ? (trend[trend.length - 1].weight ?? 87) : 87;
  })();
  const ratio = (x: number) => (bodyweight > 0 ? x / bodyweight : 0);
  const gymLevelFromLifts = (() => {
    if (bench >= 1.75 * bodyweight && ratio(squat) >= 2.25 && ratio(hip) >= 3.5) return 7;
    if (bench >= 1.5 * bodyweight && ratio(squat) >= 2.0 && ratio(hip) >= 3.0) return 6;
    if (bench >= 120 && ratio(squat) >= 1.75 && ratio(hip) >= 2.5) return 5;
    if (bench >= 100 && ratio(squat) >= 1.5 && ratio(hip) >= 2.0) return 4;
    if (bench >= 80 && ratio(squat) >= 1.25 && ratio(hip) >= 1.5) return 3;
    if (bench >= 60 && ratio(squat) >= 1.0 && ratio(hip) >= 1.0) return 2;
    return 1;
  })();
  // Seeded synthetic hours for radar position based on current lifts/BW snapshot
  const levelToRange: Record<number, [number, number]> = {
    1: [0, 20],
    2: [20, 80],
    3: [80, 150],
    4: [150, 300],
    5: [300, 600],
    6: [600, 1000],
    7: [1000, 1500],
  };
  const seed = JSON.stringify({ squat, bench, hip, bodyweight });
  const seededRand = (() => {
    let h = 2166136261; // FNV-1a
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000; // 0..1
  })();
  const [minH, maxH] = levelToRange[gymLevelFromLifts];
  const gymRadarHours = Math.round(minH + seededRand * (maxH - minH));

  const boxingLevel = getBoxingLevel(boxing.totalHours);
  const gymLevel = gymLevelFromLifts;
  const oudLevel = getOudLevel(oud.totalHours);
  const spanishLevel = getLanguageLevel(spanish.totalHours);
  const germanLevel = getLanguageLevel(german.totalHours);

  // Prepare MUI RadarChart data (defensive against undefined/NaN)
  const toNum = (n: unknown) => {
    const x = Number(n);
    return Number.isFinite(x) ? x : 0;
  };
  const categories = ['Boxing', 'Gym', 'Oud', 'Spanish', 'German', ...customs.map((c) => c.name)];
  const hoursSeries = [
    toNum(boxing?.totalHours),
    toNum(gymRadarHours),
    toNum(oud?.totalHours),
    toNum(spanish?.totalHours),
    toNum(german?.totalHours),
    ...customs.map((c) => toNum(c.data.totalHours)),
  ];
  const hasAnyData = hoursSeries.some((v) => v > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Progress Overview</h1>
              <p className="text-gray-600 mt-1">Track your activity progress across all areas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Activity Progress Radar
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Visual comparison of total hours across activities
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {hasAnyData ? (
                  <RadarChart
                    height={320}
                    series={[{ data: hoursSeries, label: 'Hours', color: '#3b82f6', fillArea: true }]}
                    radar={{ metrics: categories, max: Math.max(10, ...hoursSeries) }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-600">
                    No data yet. Add hours on activity pages to see your radar.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-red-900">Boxing</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-red-700">{boxing.totalHours}h</span>
                    <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 px-2.5 py-0.5 text-xs font-medium">Level {boxingLevel}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-900">Gym</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-green-700">{gym.totalHours}h</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium">Level {gymLevel}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-purple-900">Oud</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-purple-700">{oud.totalHours}h</span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-medium">Level {oudLevel}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-yellow-900">Spanish</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-yellow-700">{spanish.totalHours}h</span>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-medium">Level {spanishLevel}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900">German</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-slate-700">{german.totalHours}h</span>
                    <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-800 px-2.5 py-0.5 text-xs font-medium">Level {germanLevel}</span>
                  </div>
                </div>
                {customs.map((c) => {
                  const t = (c as any).template as 'boxing' | 'gym' | 'music' | 'language' | 'none' | undefined;
                  const hours = c.data.totalHours as number;
                  const level =
                    t === 'boxing' ? getBoxingLevel(hours) :
                    t === 'language' ? getLanguageLevel(hours) :
                    t === 'music' ? getOudLevel(hours) :
                    t === 'gym' ? getOudLevel(hours) : 1;
                  return (
                    <div key={c.slug} className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                      <span className="font-medium text-indigo-900">{c.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-indigo-700">{hours}h</span>
                        <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-2.5 py-0.5 text-xs font-medium">Level {level}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {[
                      boxing.totalHours,
                      gym.totalHours,
                      oud.totalHours,
                      spanish.totalHours,
                      german.totalHours,
                      ...customs.map((c) => c.data.totalHours),
                    ].reduce((a, b) => a + b, 0)}h
                  </div>
                  <p className="text-gray-600 mt-2">Total hours across all activities</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Most Active</span>
                      <span className="font-medium">
                        {(() => {
                          const base: Array<[string, number]> = [
                            ['Boxing', boxing.totalHours],
                            ['Gym', gym.totalHours],
                            ['Oud', oud.totalHours],
                            ['Spanish', spanish.totalHours],
                            ['German', german.totalHours],
                          ];
                          const pairs: Array<[string, number]> = base.concat(
                            customs.map((c) => [c.name, c.data.totalHours] as [string, number])
                          );
                          return pairs.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average per Activity</span>
                      <span className="font-medium">
                        {Math.round(([
                          boxing.totalHours,
                          gym.totalHours,
                          oud.totalHours,
                          spanish.totalHours,
                          german.totalHours,
                          ...customs.map((c) => c.data.totalHours),
                        ].reduce((a, b) => a + b, 0)) / (5 + customs.length))}h
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
