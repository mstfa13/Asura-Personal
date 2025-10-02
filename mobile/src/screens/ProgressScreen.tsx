import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useActivityStore } from '../store/activityStore';

export default function ProgressScreen() {
  const { boxing, gym, oud, spanish, german } = useActivityStore();

  const activities = [
    { name: 'Boxing', hours: boxing.totalHours, color: '#dc2626' },
    { name: 'Gym', hours: gym.totalHours, color: '#059669' },
    { name: 'Oud', hours: oud.totalHours, color: '#8b5cf6' },
    { name: 'Spanish', hours: spanish.totalHours, color: '#f59e0b' },
    { name: 'German', hours: german.totalHours, color: '#1f2937' }
  ];

  const totalHours = activities.reduce((sum, a) => sum + a.hours, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progress Overview</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Total Hours Across All Activities</Text>
        <Text style={styles.totalValue}>{Math.round(totalHours * 100) / 100}h</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Activity Breakdown</Text>
        {activities.map((activity, i) => (
          <View key={i} style={styles.activityRow}>
            <View style={[styles.colorDot, { backgroundColor: activity.color }]} />
            <Text style={styles.activityName}>{activity.name}</Text>
            <Text style={styles.activityHours}>{activity.hours}h</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Books Read</Text>
        <Text style={styles.booksText}>Spanish: {spanish.booksRead || 0} books</Text>
        <Text style={styles.booksText}>German: {german.booksRead || 0} books</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#3b82f6' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  totalValue: { fontSize: 32, fontWeight: '700', color: '#3b82f6' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1f2937' },
  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  activityName: { flex: 1, fontSize: 16, color: '#374151' },
  activityHours: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  booksText: { fontSize: 14, color: '#6b7280', marginBottom: 4 }
});