import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function RecommendationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      <Text style={styles.subtitle}>No recommendations yet</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#ffffff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280' },
})