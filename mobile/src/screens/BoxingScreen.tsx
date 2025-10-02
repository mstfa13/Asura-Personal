import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useActivityStore } from '../store/activityStore';

export default function BoxingScreen() {
  const boxing = useActivityStore(s => s.boxing);
  const addHours = useActivityStore(s => s.addHours);

  const [hoursToAdd, setHoursToAdd] = useState('');

  const boxingLevel = boxing.totalHours >= 1500 ? 7 : boxing.totalHours >= 1000 ? 7 : boxing.totalHours >= 600 ? 6 : boxing.totalHours >= 300 ? 5 : boxing.totalHours >= 150 ? 4 : boxing.totalHours >= 80 ? 3 : boxing.totalHours >= 20 ? 2 : 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Boxing</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Hours</Text>
        <Text style={styles.value}>{boxing.totalHours}h</Text>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Add hours" keyboardType="decimal-pad" value={hoursToAdd} onChangeText={setHoursToAdd} />
          <Button title="Add" onPress={() => { const h = parseFloat(hoursToAdd); if (h > 0) { addHours('boxing', h); setHoursToAdd(''); } }} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Current Level</Text>
        <Text style={styles.value}>Level {boxingLevel}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>This Week Sessions</Text>
        <Text style={styles.value}>{boxing.thisWeekSessions}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Current Streak</Text>
        <Text style={styles.value}>{boxing.currentStreak} days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#dc2626' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '600', marginBottom: 8, color: '#1f2937' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 8, height: 40 }
});