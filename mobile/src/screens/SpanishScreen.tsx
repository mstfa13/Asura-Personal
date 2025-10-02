import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useActivityStore } from '../store/activityStore';

export default function SpanishScreen() {
  const spanish = useActivityStore(s => s.spanish);
  const addHours = useActivityStore(s => s.addHours);
  const setDailyGoal = useActivityStore(s => s.setDailyGoal);
  const addTodayMinutes = useActivityStore(s => s.addTodayMinutes);
  const setBooksRead = useActivityStore(s => s.setBooksRead);

  const [hoursToAdd, setHoursToAdd] = useState('');
  const [manualBooks, setManualBooks] = useState(spanish.booksRead?.toString() || '0');

  const spanishLevel = spanish.totalHours >= 1000
    ? 7
    : spanish.totalHours >= 600
    ? 5
    : spanish.totalHours >= 300
    ? 4
    : spanish.totalHours >= 150
    ? 3
    : spanish.totalHours >= 50
    ? 2
    : 1;

  const todayMinutes = spanish.todayDate === new Date().toDateString() ? (spanish.todayMinutes || 0) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Spanish</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Hours</Text>
        <Text style={styles.value}>{spanish.totalHours}h</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Add hours"
            keyboardType="decimal-pad"
            value={hoursToAdd}
            onChangeText={setHoursToAdd}
          />
          <Button title="Add" onPress={() => {
            const h = parseFloat(hoursToAdd);
            if (h > 0) { addHours('spanish', h); setHoursToAdd(''); }
          }} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Books Read</Text>
        <Text style={styles.value}>{spanish.booksRead ?? 0}</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Books"
            keyboardType="number-pad"
            value={manualBooks}
            onChangeText={setManualBooks}
          />
          <Button title="Save" onPress={() => setBooksRead('spanish', parseInt(manualBooks, 10) || 0)} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Current Level</Text>
        <Text style={styles.value}>Level {spanishLevel}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily Goal (min)</Text>
        <Text style={styles.value}>{spanish.dailyGoalMinutes || 30}</Text>
        <View style={styles.row}>
          <Button title="+5m" onPress={() => setDailyGoal('spanish', (spanish.dailyGoalMinutes || 30) + 5)} />
          <Button title="+10m" onPress={() => setDailyGoal('spanish', (spanish.dailyGoalMinutes || 30) + 10)} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Today's Minutes</Text>
        <Text style={styles.value}>{todayMinutes}</Text>
        <View style={styles.row}>
          <Button title="+5" onPress={() => addTodayMinutes('spanish', 5)} />
          <Button title="+15" onPress={() => addTodayMinutes('spanish', 15)} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 8, height: 40 }
});
