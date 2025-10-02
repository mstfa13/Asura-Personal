import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DailyActivitiesScreen() {
  const activities = [
    'Spanish writing',
    'German writing', 
    'Oud 15 min',
    'Minoxidil',
    'Creatine'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daily Activities</Text>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {activities.map((activity, i) => (
          <View key={i} style={styles.taskRow}>
            <View style={styles.checkbox} />
            <Text style={styles.taskName}>{activity}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.card}>
        <Text style={styles.note}>Track your daily habits and routines</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#7c3aed' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1f2937' },
  taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#d1d5db', borderRadius: 4, marginRight: 12 },
  taskName: { flex: 1, fontSize: 16, color: '#374151' },
  note: { fontSize: 14, color: '#6b7280', fontStyle: 'italic' }
});