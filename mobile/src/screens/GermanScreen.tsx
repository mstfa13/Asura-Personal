import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useActivityStore } from '../store/activityStore';

export default function GermanScreen() {
  const german = useActivityStore(s => s.german);
  const addHours = useActivityStore(s => s.addHours);
  const setBooksRead = useActivityStore(s => s.setBooksRead);

  const [hoursToAdd, setHoursToAdd] = useState('');
  const [manualBooks, setManualBooks] = useState(german.booksRead?.toString() || '0');

  const germanLevel = german.totalHours >= 1000 ? 7 : german.totalHours >= 600 ? 5 : german.totalHours >= 300 ? 4 : german.totalHours >= 150 ? 3 : german.totalHours >= 50 ? 2 : 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>German</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Hours</Text>
        <Text style={styles.value}>{german.totalHours}h</Text>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Add hours" keyboardType="decimal-pad" value={hoursToAdd} onChangeText={setHoursToAdd} />
          <Button title="Add" onPress={() => { const h = parseFloat(hoursToAdd); if (h > 0) { addHours('german', h); setHoursToAdd(''); } }} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Books Read</Text>
        <Text style={styles.value}>{german.booksRead ?? 0}</Text>
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="Books" keyboardType="number-pad" value={manualBooks} onChangeText={setManualBooks} />
          <Button title="Save" onPress={() => setBooksRead('german', parseInt(manualBooks, 10) || 0)} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Current Level</Text>
        <Text style={styles.value}>Level {germanLevel}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#1f2937' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '600', marginBottom: 8, color: '#1f2937' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 8, height: 40 }
});