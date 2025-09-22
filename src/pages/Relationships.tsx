
import ProgressCard from '@/components/ProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MessageCircle, Calendar, TrendingUp, Star } from 'lucide-react';

export default function Relationships() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relationships & Dating</h1>
              <p className="text-gray-600 mt-1">Track your social connections and dating progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Social Events"
            value="8"
            subtitle="attended this month"
            gradient="bg-gradient-to-r from-pink-500 to-rose-500"
            icon={<Calendar className="w-5 h-5" />}
          />
          <ProgressCard
            title="New Connections"
            value="12"
            subtitle="people met recently"
            gradient="bg-gradient-to-r from-purple-500 to-pink-500"
            icon={<Users className="w-5 h-5" />}
          />
          <ProgressCard
            title="Dates This Month"
            value="3"
            subtitle="quality over quantity"
            gradient="bg-gradient-to-r from-red-500 to-pink-500"
            icon={<Heart className="w-5 h-5" />}
          />
          <ProgressCard
            title="Confidence Level"
            value="8.5"
            subtitle="out of 10"
            gradient="bg-gradient-to-r from-orange-500 to-red-500"
            icon={<Star className="w-5 h-5" />}
          />
        </div>

        {/* Social Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Social Circle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Close Friends</span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Acquaintances</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Professional Network</span>
                  <span className="font-semibold text-purple-600">120</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social Media Followers</span>
                  <span className="font-semibold">890</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Social Hours</span>
                  <span className="font-semibold text-green-600">12h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-pink-600" />
                <span>Dating Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dating Apps Active</span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Matches This Week</span>
                  <span className="font-semibold text-pink-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversations Started</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Second Dates</span>
                  <span className="font-semibold text-green-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Prospects</span>
                  <span className="font-semibold text-blue-600">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span>Recent Social Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div>
                  <h4 className="font-medium">Coffee Date</h4>
                  <p className="text-sm text-gray-600">Met Sarah for coffee downtown</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">2 hours</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Friend's Birthday Party</h4>
                  <p className="text-sm text-gray-600">Celebrated with the crew</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">4 hours</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Networking Event</h4>
                  <p className="text-sm text-gray-600">Tech meetup at WeWork</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">3 hours</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
