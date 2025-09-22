import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Music2, Clock, Plus, Target, Flame } from 'lucide-react';
import Levels from '@/components/Levels';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Oud() {
	const [showAddHours, setShowAddHours] = useState(false);
	const [hoursToAdd, setHoursToAdd] = useState('');
	const { oud, addHours } = useActivityStore();

	// Derive Oud level dynamically from total hours based on provided thresholds
	const oudLevel =
		oud.totalHours >= 1500 ? 7 :
		oud.totalHours >= 1000 ? 6 :
		oud.totalHours >= 600 ? 5 :
		oud.totalHours >= 300 ? 4 :
		oud.totalHours >= 150 ? 3 :
		oud.totalHours >= 60 ? 2 :
		1;

	const handleAddHours = () => {
		const hours = parseFloat(hoursToAdd);
		if (hours > 0) {
			addHours('oud', hours);
			setHoursToAdd('');
			setShowAddHours(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
								<Music2 className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">Oud</h1>
								<p className="text-gray-600 mt-1">Track your music practice</p>
							</div>
						</div>
						<Dialog open={showAddHours} onOpenChange={setShowAddHours}>
							<DialogTrigger asChild>
								<Button className="flex items-center gap-2">
									<Plus className="w-4 h-4" />
									Add Hours
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Oud Practice Hours</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium text-gray-700">Hours practiced</label>
										<Input
											type="number"
											step="0.5"
											placeholder="e.g., 1.5"
											value={hoursToAdd}
											onChange={(e) => setHoursToAdd(e.target.value)}
											className="mt-1"
										/>
									</div>
								</div>
								<DialogFooter>
									<Button onClick={handleAddHours} className="bg-purple-600 hover:bg-purple-700">Add Hours</Button>
									<Button variant="outline" onClick={() => setShowAddHours(false)}>Cancel</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">


				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Hours</CardTitle>
							<Music2 className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{oud.totalHours}h</div>
							<p className="text-xs text-muted-foreground">lifetime practice</p>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">This Week</CardTitle>
							<Clock className="h-4 w-4 text-pink-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{oud.thisWeekSessions}</div>
							<p className="text-xs text-muted-foreground">sessions completed</p>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Current Streak</CardTitle>
							<Flame className="h-4 w-4 text-rose-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{oud.currentStreak}</div>
							<p className="text-xs text-muted-foreground">days consistent</p>
						</CardContent>
					</Card>

								<Card className="relative overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-5" />
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Total Concerts</CardTitle>
										<Target className="h-4 w-4 text-orange-600" />
									</CardHeader>
									<CardContent>
										  <div className="text-2xl font-bold">{oud.totalConcerts ?? 0}</div>
										  <p className="text-xs text-muted-foreground">performed so far</p>
									</CardContent>
								</Card>
				</div>
				{/* Levels - Generic template (spans two cards) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
					<div className="md:col-span-2 lg:col-span-2">
						<Levels variant="oud" currentLevel={oudLevel} />
					</div>
				</div>
			</div>
		</div>
	);
}

