import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to your job board dashboard</Text>
      
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard/messages')}>
          <Text style={styles.menuText}>Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard/recommendations')}>
          <Text style={styles.menuText}>Recommendations</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#ffffff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 32 },
  menu: { gap: 16 },
  menuItem: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 8 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#374151' },
})