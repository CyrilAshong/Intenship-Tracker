import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <Text className="text-2xl font-bold text-navy mb-2">
        Welcome, {user?.studentProfile?.firstName} 👋
      </Text>
      <Text className="text-gray-500 mb-8">Student Dashboard</Text>
      <TouchableOpacity
        className="bg-red-500 rounded-xl px-8 py-4"
        onPress={logout}>
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentDashboard;