import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const CompanyProfileScreen = () => {
  const { user, logout } = useAuth();
  const profile = user?.companyProfile;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View className="bg-navy px-5 pt-16 pb-8 items-center">
          <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center mb-3 border border-white/30">
            <Text className="text-3xl">🏢</Text>
          </View>
          <Text className="text-xl font-bold text-white">
            {profile?.companyName ?? 'Company'}
          </Text>
          <Text className="text-sm text-white/70 mt-1">{user?.email}</Text>
        </View>

        <View className="px-5 -mt-5">
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-sm font-bold text-navy mb-3">
              Company Information
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Industry</Text>
                <Text className="text-sm font-medium text-navy">
                  {profile?.industry ?? 'Not set'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Location</Text>
                <Text className="text-sm font-medium text-navy">
                  {profile?.location ?? 'Not set'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Status</Text>
                <Text className="text-sm font-medium text-navy">
                  {profile?.verificationStatus ?? 'PENDING'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-white rounded-2xl py-4 items-center border border-red-100"
            onPress={logout}>
            <Text className="text-sm font-semibold text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompanyProfileScreen;