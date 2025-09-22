
import ProgressCard from '@/components/ProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, DollarSign, TrendingUp, Target, Code, Award } from 'lucide-react';

export default function Career() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career & Money</h1>
              <p className="text-gray-600 mt-1">Track your professional growth and financial progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Monthly Income"
            value="$8,500"
            subtitle="+15% from last month"
            gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <ProgressCard
            title="Coding Streak"
            value="45"
            subtitle="days in a row"
            gradient="bg-gradient-to-r from-blue-500 to-purple-500"
            icon={<Code className="w-5 h-5" />}
          />
          <ProgressCard
            title="Projects Completed"
            value="12"
            subtitle="this quarter"
            gradient="bg-gradient-to-r from-purple-500 to-pink-500"
            icon={<Award className="w-5 h-5" />}
          />
          <ProgressCard
            title="Savings Rate"
            value="35%"
            subtitle="of monthly income"
            gradient="bg-gradient-to-r from-orange-500 to-red-500"
            icon={<Target className="w-5 h-5" />}
          />
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Financial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Savings</span>
                  <span className="font-semibold text-green-600">$45,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Fund</span>
                  <span className="font-semibold">$18,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Investments</span>
                  <span className="font-semibold text-blue-600">$27,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Expenses</span>
                  <span className="font-semibold text-red-600">$5,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Net Worth</span>
                  <span className="font-semibold text-purple-600">$67,500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Career Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Position</span>
                  <span className="font-semibold">Senior Developer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years Experience</span>
                  <span className="font-semibold">4.5 years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Skills Mastered</span>
                  <span className="font-semibold text-blue-600">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Certifications</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Goal</span>
                  <span className="font-semibold text-purple-600">Tech Lead</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-purple-600" />
              <span>Recent Coding Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <h4 className="font-medium">React Dashboard Project</h4>
                  <p className="text-sm text-gray-600">Full-stack development</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">4 hours</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">API Integration</h4>
                  <p className="text-sm text-gray-600">Third-party services</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">2.5 hours</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Code Review</h4>
                  <p className="text-sm text-gray-600">Team collaboration</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">1 hour</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
