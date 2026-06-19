import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

const ChooseRoleScreen = ({ navigation }: any) => {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>

        {/* Header */}
        <View className="px-5 pt-14 pb-4 border-b border-gray-100 bg-white">
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
        </View>

        {/* Title */}
        <View className="px-5 pt-8 pb-6">
          <Text className="text-3xl font-bold text-navy leading-10">
            How will you use UniIntern?
          </Text>
          <Text className="text-sm text-gray-500 mt-2 leading-5">
            Choose your profile type to get started on your professional journey.
          </Text>
        </View>

        {/* Student Card */}
        <View className="mx-5 mb-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Text className="text-2xl">🎓</Text>
          </View>
          <Text className="text-xl font-bold text-navy mb-2">Student</Text>
          <Text className="text-sm text-gray-500 leading-5 mb-4">
            Discover and apply for dream vacation internships at leading global
            corporations. Track your applications, manage interviews, and
            kickstart your career.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('StudentLogin')}>
            <Text className="text-teal font-bold text-sm tracking-wide">
              START AS STUDENT →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Company Card */}
        <View className="mx-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <View className="w-12 h-12 rounded-full bg-teal-light items-center justify-center mb-4">
            <Text className="text-2xl">🏢</Text>
          </View>
          <Text className="text-xl font-bold text-teal mb-2">Company</Text>
          <Text className="text-sm text-gray-500 leading-5 mb-4">
            Find and recruit top-tier university talent for your vacation
            programs. Manage applicant pipelines, schedule interviews, and
            build your future workforce.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CompanyLogin')}>
            <Text className="text-teal font-bold text-sm tracking-wide">
              START AS RECRUITER →
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default ChooseRoleScreen;