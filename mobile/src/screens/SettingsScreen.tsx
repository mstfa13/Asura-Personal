import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useActivityStore } from '../store/activityStore';

export default function SettingsScreen() {
  const store = useActivityStore();

  const handleExportData = () => {
    const data = JSON.stringify({
      boxing: store.boxing,
      gym: store.gym,
      oud: store.oud,
      spanish: store.spanish,
      german: store.german,
      customActivities: store.customActivities
    }, null, 2);
    
    Alert.alert('Export Data', `Data exported. In a full app, this would save to file or share.\n\nSize: ${(data.length / 1024).toFixed(1)} KB`);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data', 
      'Are you sure you want to reset all activity data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          // In full implementation, would call store reset method
          Alert.alert('Reset', 'Data reset functionality would be implemented here.');
        }}
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.buttonContainer}>
          <Button title="Export Data" onPress={handleExportData} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Reset All Data" color="#dc2626" onPress={handleResetData} />
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.infoText}>Asura Mobile</Text>
        <Text style={styles.infoText}>Version 0.1.0</Text>
        <Text style={styles.infoText}>Personal development tracking app</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#6b7280' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1f2937' },
  buttonContainer: { marginBottom: 12 },
  infoText: { fontSize: 14, color: '#6b7280', marginBottom: 4 }
});