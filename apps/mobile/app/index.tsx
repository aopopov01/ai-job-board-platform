import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-blue-600">Job Board Platform</Text>
      <Text className="text-base text-gray-600 mt-4">Mobile App Coming Soon</Text>
      <StatusBar style="auto" />
    </View>
  );
}
