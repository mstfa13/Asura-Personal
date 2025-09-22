import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActivityStore } from '@/lib/activityStore';
import { Dumbbell, Clock, Plus, Target, Flame } from 'lucide-react';
import Levels from '@/components/Levels';
import { LineChart } from '@mui/x-charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Gym() {
	const [showAddHours, setShowAddHours] = useState(false);
	const [hoursToAdd, setHoursToAdd] = useState('');
	const { gym, addHours } = useActivityStore();
	const setActivityTotalHours = useActivityStore((s) => s.setActivityTotalHours);
	const [editTotalOpen, setEditTotalOpen] = useState(false);
	const [manualTotal, setManualTotal] = useState('');
	const updateLiftName = useActivityStore((s) => s.updateGymPowerLiftName);
	const updateLiftWeight = useActivityStore((s) => s.updateGymPowerLiftWeight);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [tempName, setTempName] = useState('');
	const [editingWeightIndex, setEditingWeightIndex] = useState<number | null>(null);
	const [tempWeight, setTempWeight] = useState('');

	// Weight trend data from store
	const trend = gym.weightTrend ?? [];
	const weightDates = trend.map((p) => p.date);
	const weightValues = trend.map((p) => p.weight);
	// Dynamic y-axis with padding and safe defaults
	const yMin = weightValues.length ? Math.floor(Math.min(...weightValues) - 2) : 0;
	const yMax = weightValues.length ? Math.ceil(Math.max(...weightValues) + 2) : 100;
		const [addWeightOpen, setAddWeightOpen] = useState(false);
	const [newWeight, setNewWeight] = useState('');
	const addGymWeight = useActivityStore((s) => s.addGymWeight);
		const updateGymWeightAt = useActivityStore((s) => s.updateGymWeightAt);
		const deleteGymWeightAt = useActivityStore((s) => s.deleteGymWeightAt);
		const [trendView, setTrendView] = useState<'chart'|'table'>('chart');
		const [editIdx, setEditIdx] = useState<number | null>(null);
		const [editWeight, setEditWeight] = useState('');
		const [editDate, setEditDate] = useState('');
	const submitWeight = () => {
		const w = parseFloat(newWeight);
		if (Number.isFinite(w) && w > 0) {
			addGymWeight(w);
			setNewWeight('');
			setAddWeightOpen(false);
		}
	};
		const startEdit = (i: number) => {
			const point = trend[i];
			setEditIdx(i);
			setEditWeight(String(point?.weight ?? ''));
			setEditDate(point?.date ?? '');
		};
		const commitEdit = () => {
			if (editIdx === null) return;
			const w = parseFloat(editWeight);
			updateGymWeightAt(editIdx, Number.isFinite(w) ? w : undefined, editDate.trim() || undefined);
			setEditIdx(null);
			setEditWeight('');
			setEditDate('');
		};

		// Exercise progress data (weights and reps per date)
		const exerciseNameMap = useActivityStore((s) => s.gymExerciseNames);
		const exerciseCats = useActivityStore((s) => s.gymExerciseCategories);
		const addGymExercise = useActivityStore((s) => s.addGymExercise);
		const renameExercise = useActivityStore((s) => s.updateGymExerciseName);
		const [catFilter, setCatFilter] = useState<'all'|'push'|'pull'|'legs'|'other'>('all');
		const allExercises = useMemo(() =>
			Object.entries(exerciseNameMap).map(([id, label]) => ({ id, label, cat: (exerciseCats as any)[id] || 'other' })),
			[exerciseNameMap, exerciseCats]
		);
		const exercises = useMemo(() =>
			allExercises
			  .filter(e => catFilter === 'all' ? true : e.cat === catFilter)
			  .sort((a, b) => a.label.localeCompare(b.label)),
			[allExercises, catFilter]
		);

	const exerciseData: Record<string, Array<{ date: string; weight: number | null; reps: number | null }>> = {
		'flat-db-press': [
			{ date: '7-25', weight: 25, reps: 8 },
			{ date: '8-1', weight: 27.5, reps: 8 },
			{ date: '8-8', weight: 30, reps: 6 },
			{ date: '8-15', weight: 30, reps: 7 },
			{ date: '8-22', weight: 32.5, reps: 5 },
		],
		'flat-bpress-machine': [
			{ date: '7-25', weight: 45, reps: 9 },
			{ date: '8-1', weight: 50, reps: 9 },
			{ date: '8-8', weight: 52.5, reps: 8 },
			{ date: '8-15', weight: 55, reps: 7 },
			{ date: '8-22', weight: 55, reps: 8 },
		],
		'high-low-cable-fly': [
			{ date: '7-25', weight: 22.5, reps: 10 },
			{ date: '8-1', weight: 25, reps: 9 },
			{ date: '8-8', weight: 25, reps: 10 },
			{ date: '8-15', weight: 27.5, reps: 8 },
			{ date: '8-22', weight: 27.5, reps: 9 },
		],
		'tri-rope-pushdown': [
			{ date: '7-25', weight: 40, reps: 10 },
			{ date: '8-1', weight: 45, reps: 9 },
			{ date: '8-8', weight: 45, reps: 10 },
			{ date: '8-15', weight: 50, reps: 8 },
			{ date: '8-22', weight: 50, reps: 9 },
		],
		'db-lateral-raises': [
			{ date: '7-25', weight: 8, reps: 12 },
			{ date: '8-1', weight: 10, reps: 10 },
			{ date: '8-8', weight: 10, reps: 12 },
			{ date: '8-15', weight: 12, reps: 10 },
			{ date: '8-22', weight: 12, reps: 12 },
		],
		'shoulder-press-machine': [
			{ date: '7-25', weight: 22.5, reps: 10 },
			{ date: '8-1', weight: 25, reps: 8 },
			{ date: '8-8', weight: 27.5, reps: 8 },
			{ date: '8-15', weight: 30, reps: 6 },
			{ date: '8-22', weight: 30, reps: 8 },
		],
	};

	const [selectedExercise, setSelectedExercise] = useState<string>('');
	// Keep selection valid when filter or list changes
	const firstId = exercises[0]?.id;
	if (!selectedExercise && firstId) {
		setSelectedExercise(firstId);
	} else if (selectedExercise && exercises.length && !exercises.some(e => e.id === selectedExercise)) {
		setSelectedExercise(firstId || '');
	}
	const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
	const exerciseProgress = useActivityStore((s) => s.gymExerciseProgress);
	const addGymExerciseWeight = useActivityStore((s) => s.addGymExerciseWeight);
	const currentSeries = exerciseProgress[selectedExercise] ?? [];
	const exDates = currentSeries.map((p) => p.date);
	const exWeights = currentSeries.map((p) => p.weight ?? null);
	const exReps = currentSeries.map((p) => p.reps ?? null);
	const exYMin = (() => {
		const vals = exWeights.filter((v): v is number => typeof v === 'number');
		return vals.length ? Math.floor(Math.min(...vals) - 2) : 0;
	})();
	const exYMax = (() => {
		const vals = exWeights.filter((v): v is number => typeof v === 'number');
		return vals.length ? Math.ceil(Math.max(...vals) + 2) : 10;
	})();

	const handleAddHours = () => {
		const hours = parseFloat(hoursToAdd);
		if (hours > 0) {
			addHours('gym', hours);
			setHoursToAdd('');
			setShowAddHours(false);
		}
	};

	// Compute Gym current level from Power Lifts
	const powerWeights = gym.powerLiftWeights ?? [0, 0, 0, 0];
	const squat = powerWeights[0] ?? 0;
	const bench = powerWeights[1] ?? 0;
	const hip = powerWeights[3] ?? 0;
	const bodyweight = trend.length ? (trend[trend.length - 1].weight ?? 87) : 87;
	const ratio = (x: number) => (bodyweight > 0 ? x / bodyweight : 0);
	const gymLevel = (() => {
		// Descend from highest to lowest; require all three metrics
		if (bench >= 1.75 * bodyweight && ratio(squat) >= 2.25 && ratio(hip) >= 3.5) return 7;
		if (bench >= 1.5 * bodyweight && ratio(squat) >= 2.0 && ratio(hip) >= 3.0) return 6;
		if (bench >= 120 && ratio(squat) >= 1.75 && ratio(hip) >= 2.5) return 5;
		if (bench >= 100 && ratio(squat) >= 1.5 && ratio(hip) >= 2.0) return 4;
		if (bench >= 80 && ratio(squat) >= 1.25 && ratio(hip) >= 1.5) return 3;
		if (bench >= 60 && ratio(squat) >= 1.0 && ratio(hip) >= 1.0) return 2;
		return 1;
	})();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
								<Dumbbell className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">Gym</h1>
								<p className="text-gray-600 mt-1">Track your strength training</p>
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
									<DialogTitle>Add Gym Hours</DialogTitle>
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
									<Button onClick={handleAddHours} className="bg-green-600 hover:bg-green-700">Add Hours</Button>
									<Button variant="outline" onClick={() => setShowAddHours(false)}>Cancel</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

				{/* 4 Simple Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Card 1: Total Hours */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Hours</CardTitle>
							<div className="flex items-center gap-2">
								<Dumbbell className="h-4 w-4 text-green-600" />
								<button
									className="text-xs text-gray-500 hover:text-gray-700 underline"
									onClick={() => { setManualTotal(String(gym.totalHours)); setEditTotalOpen(true); }}
									title="Edit total hours"
								>
									Edit
								</button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{gym.totalHours}h</div>
							<p className="text-xs text-muted-foreground">lifetime training</p>
						</CardContent>
					</Card>

					{/* Card 2: This Week Sessions */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">This Week</CardTitle>
							<Clock className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{gym.thisWeekSessions}</div>
							<p className="text-xs text-muted-foreground">sessions completed</p>
						</CardContent>
					</Card>

					{/* Card 3: Current Weight */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Current Weight</CardTitle>
							<Flame className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">87 kg</div>
							<p className="text-xs text-muted-foreground">as of today</p>
						</CardContent>
					</Card>

					{/* Card 4: Goal Weight */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-5" />
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Goal Weight</CardTitle>
							<Target className="h-4 w-4 text-pink-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">79 kg</div>
							<p className="text-xs text-muted-foreground">target</p>
						</CardContent>
					</Card>
				</div>

				{/* Power Lifts (left) + Weight Trend (right) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Power Lifts (Current) - colorful emphasis */}
					<Card className="md:col-span-2 lg:col-span-2 overflow-hidden">
						<CardHeader>
							<CardTitle>Power Lifts (Current)</CardTitle>
						</CardHeader>
						<CardContent>
							{(() => {
								const defaultNames = ['Squats','Bench Press','Rows / Lat Pulldowns','Hip Thrusts'];
								const names = gym.powerLiftNames ?? defaultNames;
								const lifts = names.map((n, i) => ({ name: n || defaultNames[i], i }));
								const weights = gym.powerLiftWeights ?? [100, 50, 50, 50];
								const gradients = [
									'from-red-500/25 to-orange-500/25',
									'from-blue-500/25 to-cyan-500/25',
									'from-emerald-500/25 to-teal-500/25',
									'from-fuchsia-500/25 to-pink-500/25',
								];
								const textColors = ['text-red-700','text-blue-700','text-emerald-700','text-fuchsia-700'];
								const badgeColors = ['bg-red-100 text-red-700','bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-fuchsia-100 text-fuchsia-700'];

								const commitEdit = () => {
									if (editingIndex === null) return;
									updateLiftName(editingIndex, tempName);
									setEditingIndex(null);
									setTempName('');
								};
								const commitWeightEdit = () => {
									if (editingWeightIndex === null) return;
									const num = parseFloat(tempWeight);
									if (!Number.isNaN(num)) updateLiftWeight(editingWeightIndex, num);
									setEditingWeightIndex(null);
									setTempWeight('');
								};
								const cancelEdit = () => {
									setEditingIndex(null);
									setTempName('');
								};
								const cancelWeightEdit = () => {
									setEditingWeightIndex(null);
									setTempWeight('');
								};
								return (
									<div className="space-y-3">
										{lifts.map((l, idx) => (
											<div key={idx} className={`rounded-md border bg-gradient-to-r ${gradients[idx]}`}>
												<div className="flex items-center justify-between p-3 gap-2">
													<div className="flex-1 min-w-0">
														{editingIndex === idx ? (
															<Input
																autoFocus
																value={tempName}
																onChange={(e) => setTempName(e.target.value)}
																onBlur={commitEdit}
																onKeyDown={(e) => {
																	if (e.key === 'Enter') commitEdit();
																	if (e.key === 'Escape') cancelEdit();
																}}
																className="h-8 text-sm"
															/>
														) : (
															<div
																		className={`font-medium ${textColors[idx]} truncate cursor-text select-none`}
																title="Double-click to rename"
																onDoubleClick={() => { setEditingIndex(idx); setTempName(l.name); }}
															>
																{l.name}
															</div>
														)}
													</div>
													<div className={`text-xs px-2 py-1 rounded ${badgeColors[idx]} flex items-center gap-2 min-w-[88px] justify-end`}>
														{editingWeightIndex === idx ? (
															<Input
																autoFocus
																type="number"
																step="0.5"
																value={tempWeight}
																onChange={(e) => setTempWeight(e.target.value)}
																onBlur={commitWeightEdit}
																onKeyDown={(e) => {
																	if (e.key === 'Enter') commitWeightEdit();
																	if (e.key === 'Escape') cancelWeightEdit();
																}}
																className="h-7 text-xs w-20"
															/>
														) : (
															<div
																className="cursor-text select-none"
																title="Double-click to edit weight"
																onDoubleClick={() => { setEditingWeightIndex(idx); setTempWeight(String(weights[idx] ?? '')); }}
															>
																{weights[idx]} kg
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								);
							})()}
						</CardContent>
					</Card>

					{/* Weight Trend */}
								<Card className="overflow-hidden md:col-span-2 lg:col-span-2">
									<CardHeader className="flex items-center justify-between">
										<CardTitle>Weight Trend</CardTitle>
							<Dialog open={addWeightOpen} onOpenChange={setAddWeightOpen}>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">Add Weight</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Add Current Weight</DialogTitle>
									</DialogHeader>
										<div className="space-y-4">
											<div>
												<label className="text-sm font-medium text-gray-700">Weight (kg)</label>
												<Input
													type="number"
													step="0.1"
													placeholder="e.g., 92"
													value={newWeight}
													onChange={(e) => setNewWeight(e.target.value)}
													className="mt-1"
												/>
											</div>
										</div>
									<DialogFooter>
										<Button onClick={submitWeight} className="bg-blue-600 hover:bg-blue-700">Add</Button>
										<Button variant="outline" onClick={() => setAddWeightOpen(false)}>Cancel</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
										<div className="flex items-center gap-2">
											<Button variant={trendView==='chart'?'default':'outline'} size="sm" onClick={()=>setTrendView('chart')}>Chart</Button>
											<Button variant={trendView==='table'?'default':'outline'} size="sm" onClick={()=>setTrendView('table')}>Table</Button>
										</div>
						</CardHeader>
						<CardContent>
										{trendView === 'chart' ? (
											<div className="w-full" style={{ height: 260 }}>
												{weightValues.length > 0 ? (
													<LineChart
														xAxis={[{ data: weightDates, scaleType: 'point' }]}
														series={[{
															data: weightValues,
															label: 'Weight',
															color: '#3b82f6',
															showMark: true,
															curve: 'monotoneX',
														}]}
														yAxis={[{ min: yMin, max: yMax }]}
														grid={{ horizontal: false, vertical: false }}
														sx={{
															'.MuiChartsGrid-line': { display: 'none' },
															'.MuiChartsLegend-root': { display: 'none' },
															'.MuiLineElement-root': { strokeWidth: 2 },
															'.MuiMarkElement-root': {
																stroke: '#3b82f6',
																fill: '#ffffff',
																strokeWidth: 2,
															},
														}}
														height={260}
													/>
												) : (
													<div className="h-full flex items-center justify-center text-sm text-muted-foreground">
														No data yet. Click "Add Weight" to start tracking.
													</div>
												)}
											</div>
										) : (
											<div className="overflow-x-auto">
												{trend.length > 0 ? (
													<table className="min-w-full text-sm">
														<thead>
															<tr className="text-left text-gray-600">
																<th className="py-2 pr-4">Date</th>
																<th className="py-2 pr-4">Weight (kg)</th>
																<th className="py-2">Actions</th>
															</tr>
														</thead>
														<tbody>
															{trend.map((p, i) => (
																<tr key={i} className="border-t">
																	<td className="py-2 pr-4">{p.date}</td>
																	<td className="py-2 pr-4">{p.weight}</td>
																	<td className="py-2 flex gap-2">
																		<Button variant="outline" size="sm" onClick={() => startEdit(i)}>Edit</Button>
																		<Button variant="destructive" size="sm" onClick={() => deleteGymWeightAt(i)}>Delete</Button>
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												) : (
													<div className="h-full flex items-center justify-center text-sm text-muted-foreground">
														No records yet.
													</div>
												)}
											</div>
										)}
						</CardContent>
					</Card>
				</div>


				{/* Exercise Progress with selector (above Levels) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="overflow-hidden md:col-span-2 lg:col-span-2">
						<CardHeader className="flex items-center justify-between gap-4">
							<CardTitle>Exercise Progress</CardTitle>
														<div className="flex items-center gap-3 flex-wrap">
								{/* View toggle */}
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setViewMode('chart')}
										className={viewMode === 'chart' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}
									>
										Chart
									</Button>
									<Button
										variant="outline"
										onClick={() => setViewMode('table')}
										className={viewMode === 'table' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}
									>
										Table
									</Button>
								</div>

								{/* Exercise selector */}
																<div className="w-56">
								<label className="sr-only" htmlFor="exercise-select">Exercise</label>
								<Select value={selectedExercise} onValueChange={setSelectedExercise}>
									<SelectTrigger id="exercise-select">
										<SelectValue placeholder="Select exercise" />
									</SelectTrigger>
									<SelectContent>
																				{exercises.map((e) => (
																						<SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
										))}
									</SelectContent>
																</Select>
																</div>
																{/* Category filter */}
																<div className="w-40">
																	<Select value={catFilter} onValueChange={(v)=>setCatFilter(v as any)}>
																		<SelectTrigger aria-label="Filter">
																			<SelectValue placeholder="Filter" />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="all">All</SelectItem>
																			<SelectItem value="push">Push</SelectItem>
																			<SelectItem value="pull">Pull</SelectItem>
																			<SelectItem value="legs">Legs</SelectItem>
																			<SelectItem value="other">Other</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
																{/* Add Weight */}
																<Dialog>
																	<DialogTrigger asChild>
																		<Button variant="outline" size="sm">Add Weight</Button>
																	</DialogTrigger>
																	<DialogContent>
																		<DialogHeader>
																			<DialogTitle>Add Exercise Weight</DialogTitle>
																		</DialogHeader>
																		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
																			<div>
																				<label className="text-sm font-medium text-gray-700">Weight (kg)</label>
																				<Input id="ex-weight" type="number" step="0.5" placeholder="e.g., 32.5"
																					value={tempWeight}
																					onChange={(e) => setTempWeight(e.target.value)} />
																			</div>
																			<div>
																				<label className="text-sm font-medium text-gray-700">Reps (optional)</label>
																				<Input id="ex-reps" type="number" step="1" placeholder="e.g., 8"
																					value={tempName}
																					onChange={(e) => setTempName(e.target.value)} />
																			</div>
																		</div>
																		<DialogFooter>
																			<Button onClick={() => {
																				if (!selectedExercise) return;
																				const w = parseFloat(tempWeight);
																				const reps = tempName.trim() ? parseInt(tempName, 10) : undefined;
																				if (Number.isFinite(w) && w > 0) {
																					addGymExerciseWeight(selectedExercise, w, Number.isFinite(reps as any) ? reps : undefined);
																					setTempWeight('');
																					setTempName('');
																				}
																			}} className="bg-blue-600 hover:bg-blue-700">Add</Button>
																			<Button variant="outline">Close</Button>
																		</DialogFooter>
																	</DialogContent>
																</Dialog>
																{/* Add Exercise */}
																<AddExerciseButton onAdded={(id, cat)=>{ setCatFilter(cat); setSelectedExercise(id); }} />
														</div>
												</CardHeader>
						<CardContent>
														{viewMode === 'chart' ? (
								<div className="w-full" style={{ height: 260 }}>
											{exWeights.length > 0 ? (
												<LineChart
													xAxis={[{ data: exDates, scaleType: 'point' }]}
													series={[{
														data: exWeights,
														label: exercises.find(e => e.id === selectedExercise)?.label || 'Weight',
														color: '#3b82f6',
														showMark: true,
														curve: 'monotoneX',
												}]}
													yAxis={[{ min: exYMin, max: exYMax }]}
													grid={{ horizontal: false, vertical: false }}
													sx={{
														'.MuiChartsGrid-line': { display: 'none' },
														'.MuiChartsLegend-root': { display: 'none' },
														'.MuiLineElement-root': { strokeWidth: 2 },
														'.MuiMarkElement-root': { stroke: '#3b82f6', fill: '#ffffff', strokeWidth: 2 },
													}}
													height={260}
												/>
											) : (
												<div className="h-full flex items-center justify-center text-sm text-muted-foreground">
													No data yet. Use "Add Weight" to add your first set.
												</div>
											)}
								</div>
							) : (
														<div className="overflow-x-auto">
															<table className="min-w-full text-sm">
										<thead>
																	<tr className="text-left text-gray-600">
																												<th className="py-2 pr-4">Exercise</th>
																		<th className="py-2 pr-4">Weight</th>
																		<th className="py-2">Reps</th>
											</tr>
										</thead>
										<tbody>
											{exDates.map((d, i) => (
																		<tr key={d} className="border-t">
																			<td className="py-2 pr-4">
																														<Renameable
																															id={selectedExercise}
																															label={exercises.find(e => e.id === selectedExercise)?.label || ''}
																															onCommit={(name) => renameExercise(selectedExercise, name)}
																														/>
																				<div className="text-[10px] text-muted-foreground">{d}</div>
																			</td>
																			<td className="py-2 pr-4">{exWeights[i] ?? '-'}</td>
																			<td className="py-2">{exReps[i] ?? '-'}</td>
												</tr>
											))}
										</tbody>
									</table>
														</div>
							)}
						</CardContent>
					</Card>
				</div>



				{/* Levels - Generic template (spans two cards) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="md:col-span-2 lg:col-span-2">
						<Levels variant="gym" currentLevel={gymLevel} />
					</div>
				</div>
			</div>
					{/* Edit point dialog */}
					<Dialog open={editIdx !== null} onOpenChange={(o)=>{ if(!o){ setEditIdx(null); } }}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Weight Entry</DialogTitle>
							</DialogHeader>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-gray-700">Weight (kg)</label>
									<Input type="number" step="0.1" value={editWeight} onChange={(e)=>setEditWeight(e.target.value)} />
								</div>
								<div>
									<label className="text-sm font-medium text-gray-700">Date label</label>
									<Input value={editDate} onChange={(e)=>setEditDate(e.target.value)} placeholder="e.g., 9/12" />
								</div>
							</div>
							<DialogFooter>
								<Button onClick={commitEdit}>Save</Button>
								<Button variant="outline" onClick={()=>setEditIdx(null)}>Cancel</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
		</div>
	);
}

function Renameable({ id, label, onCommit }: { id: string; label: string; onCommit: (name: string) => void }) {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(label);
	const commit = () => {
		onCommit(value);
		setIsEditing(false);
	};
	const cancel = () => {
		setValue(label);
		setIsEditing(false);
	};
	return (
		<div className="min-w-0">
			{isEditing ? (
				<Input
					autoFocus
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={commit}
					onKeyDown={(e) => {
						if (e.key === 'Enter') commit();
						if (e.key === 'Escape') cancel();
					}}
					className="h-8 text-sm"
				/>
			) : (
				<div
					className="font-medium truncate cursor-text select-none"
					title="Double-click to rename"
					onDoubleClick={() => setIsEditing(true)}
				>
					{label}
				</div>
			)}
		</div>
	);
}

function AddExerciseButton({ onAdded }: { onAdded: (id: string, cat: 'push'|'pull'|'legs'|'other') => void }) {
	const addGymExercise = useActivityStore((s) => s.addGymExercise);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [cat, setCat] = useState<'push'|'pull'|'legs'|'other'>('push');
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" size="sm">Add Exercise</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Exercise</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium text-gray-700">Name</label>
						<Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Barbell Row" />
					</div>
					<div>
						<label className="text-sm font-medium text-gray-700">Category</label>
						<Select value={cat} onValueChange={(v)=>setCat(v as any)}>
							<SelectTrigger>
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="push">Push</SelectItem>
								<SelectItem value="pull">Pull</SelectItem>
								<SelectItem value="legs">Legs</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={()=>{
						const id = addGymExercise(name, cat);
						if (id) {
							setName('');
							onAdded(id, cat);
							setOpen(false);
						}
					}}>Add</Button>
					<Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

