import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const StudentProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const profile = user?.studentProfile;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Header */}
        <View className="bg-navy px-5 pt-16 pb-8 items-center">
          <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-3 border border-white/30">
            <Text className="text-3xl font-bold text-white">
              {profile?.firstName?.charAt(0) ?? 'S'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-white">
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text className="text-sm text-white/70 mt-1">{user?.email}</Text>
        </View>

        {/* Info Cards */}
        <View className="px-5 -mt-5">
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-sm font-bold text-navy mb-3">
              Academic Information
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">University</Text>
                <Text className="text-sm font-medium text-navy">
                  {profile?.university ?? 'Not set'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Course</Text>
                <Text className="text-sm font-medium text-navy">
                  {profile?.course ?? 'Not set'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Year of Study</Text>
                <Text className="text-sm font-medium text-navy">
                  {profile?.yearOfStudy ?? 'Not set'}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-sm font-bold text-navy mb-3">Skills</Text>
            {profile?.skills && profile.skills.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <View key={index} className="bg-teal-light rounded-full px-3 py-1.5">
                    <Text className="text-xs font-medium text-teal-dark">{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-gray-400">No skills added yet</Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm mb-3 flex-row justify-between items-center"
            onPress={() => navigation.navigate('UploadDocuments')}>
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">📄</Text>
              <Text className="text-sm font-semibold text-navy">My Documents</Text>
            </View>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-2xl py-4 items-center border border-red-100 mt-4"
            onPress={logout}>
            <Text className="text-sm font-semibold text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentProfileScreen;