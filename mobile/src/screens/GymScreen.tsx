import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useActivityStore } from '../store/activityStore';

export default function GymScreen() {
  const gym = useActivityStore(s => s.gym);
  const addHours = useActivityStore(s => s.addHours);

  const [hoursToAdd, setHoursToAdd] = useState('');

  const powerWeights = gym.powerLiftWeights || [0, 0, 0, 0];
  const powerNames = gym.powerLiftNames || ['Squats', 'Bench Press', 'Rows', 'Hip Thrusts'];
  
  // Calculate gym level based on power lifts
  const [squat, bench, hip] = [powerWeights[0], powerWeights[1], powerWeights[3]];
  const bodyweight = 87; // Default from web app
  const ratio = (x: number) => x / bodyweight;
  const gymLevel = (() => {
    if (bench >= 1.75 * bodyweight && ratio(squat) >= 2.25 && ratio(hip) >= 3.5) return 7;
    if (bench >= 1.5 * bodyweight && ratio(squat) >= 2.0 && ratio(hip) >= 3.0) return 6;
    if (bench >= 120 && ratio(squat) >= 1.75 && ratio(hip) >= 2.5) return 5;
    if (bench >= 100 && ratio(squat) >= 1.5 && ratio(hip) >= 2.0) return 4;
    if (bench >= 80 && ratio(squat) >= 1.25 && ratio(hip) >= 1.5) return 3;
    if (bench >= 60 && ratio(squat) >= 1.0 && ratio(hip) >= 1.0) return 2;
    return 1;
  })();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gym</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Hours</Text>
        <Text style={styles.value}>{gym.totalHours}h</Text>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Add hours" keyboardType="decimal-pad" value={hoursToAdd} onChangeText={setHoursToAdd} />
          <Button title="Add" onPress={() => { const h = parseFloat(hoursToAdd); if (h > 0) { addHours('gym', h); setHoursToAdd(''); } }} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Current Level</Text>
        <Text style={styles.value}>Level {gymLevel}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Power Lifts</Text>
        {powerNames.map((name, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.liftName}>{name}</Text>
            <Text style={styles.liftWeight}>{powerWeights[i]} kg</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#059669' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '600', marginBottom: 8, color: '#1f2937' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 8, height: 40 },
  liftName: { flex: 1, fontSize: 14, color: '#374151' },
  liftWeight: { fontSize: 14, fontWeight: '600', color: '#059669' }
});