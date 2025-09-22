import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, TrendingUp, Zap, Lightbulb, RotateCcw } from 'lucide-react';

interface CrossActivityInsight {
  primaryActivity: string;
  influencedActivity: string;
  correlationType: 'positive' | 'negative' | 'neutral';
  strength: number; // 0-100 percentage
  description: string;
  actionable: string;
  confidence: number; // 0-100 percentage
  lastUpdated: string;
}

interface CrossActivityInsightsProps {
  insights: CrossActivityInsight[];
}

export const CrossActivityInsights: React.FC<CrossActivityInsightsProps> = ({ insights }) => {
  const getCorrelationIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <RotateCcw className="w-4 h-4 text-red-600" />;
      default: return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCorrelationColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'negative': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Moderate';
    if (strength >= 20) return 'Weak';
    return 'Very Weak';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <span>Cross-Activity Insights</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover how your activities influence each other
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getCorrelationColor(insight.correlationType)}`}
            >
              {/* Activity Connection Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize font-medium">
                    {insight.primaryActivity}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline" className="capitalize font-medium">
                    {insight.influencedActivity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {getCorrelationIcon(insight.correlationType)}
                  <Badge
                    variant={
                      insight.correlationType === 'positive' ? 'default' :
                      insight.correlationType === 'negative' ? 'destructive' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {insight.correlationType}
                  </Badge>
                </div>
              </div>

              {/* Insight Description */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                <p className="text-sm font-medium text-gray-800">{insight.actionable}</p>
              </div>

              {/* Strength and Confidence Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Correlation Strength</span>
                    <span className="text-xs font-medium">{getStrengthLabel(insight.strength)}</span>
                  </div>
                  <Progress value={insight.strength} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">{insight.strength}%</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Confidence Level</span>
                    <span className="text-xs font-medium">
                      {insight.confidence >= 80 ? 'High' : insight.confidence >= 60 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">{insight.confidence}%</div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex justify-end mt-3">
                <span className="text-xs text-gray-500">Updated: {insight.lastUpdated}</span>
              </div>
            </div>
          ))}

          {insights.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No cross-activity insights yet.</p>
              <p className="text-xs">Insights will appear as you track more activities.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossActivityInsights;
