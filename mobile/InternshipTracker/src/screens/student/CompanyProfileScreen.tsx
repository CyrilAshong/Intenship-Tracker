import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import api from '../../services/api';

interface CompanyPublicProfile {
  id: string;
  companyProfile: {
    companyName: string;
    industry: string | null;
    description: string | null;
    website: string | null;
    location: string | null;
    logoUrl: string | null;
  } | null;
  jobs: {
    id: string;
    title: string;
    location: string | null;
    type: string;
    isPaid: boolean;
    stipend: number | null;
    duration: string | null;
    isActive: boolean;
    _count: { applications: number };
  }[];
}

const CompanyProfileScreen = ({ route, navigation }: any) => {
  const { companyId } = route.params;
  const [company, setCompany] = useState<CompanyPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await api.get(`/jobs/company/${companyId}`);
        setCompany(response.data.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load company profile.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    loadCompany();
  }, [companyId]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1a2b4a" />
      </View>
    );
  }

  if (!company) return null;

  const profile = company.companyProfile;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View className="bg-navy px-4 pt-14 pb-8">
          <TouchableOpacity
            className="mb-4"
            onPress={() => navigation.goBack()}>
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center border border-white/30 mb-3">
            <Text className="text-3xl font-bold text-white">
              {profile?.companyName?.charAt(0) ?? 'C'}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-white mb-1">
            {profile?.companyName ?? 'Company'}
          </Text>
          {profile?.industry && (
            <Text className="text-sm text-white/70">{profile.industry}</Text>
          )}
          {profile?.location && (
            <Text className="text-sm text-white/70">📍 {profile.location}</Text>
          )}
        </View>

        <View className="px-4 -mt-4 gap-4">

          {/* About */}
          {profile?.description && (
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <Text className="text-base font-bold text-navy mb-2">About</Text>
              <Text className="text-sm text-gray-500 leading-5">
                {profile.description}
              </Text>
            </View>
          )}

          {/* Info */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base font-bold text-navy mb-3">
              Company Info
            </Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center py-2 border-b border-gray-50">
                <Text className="text-sm text-gray-400">Industry</Text>
                <Text className="text-sm font-semibold text-navy">
                  {profile?.industry ?? '—'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-2 border-b border-gray-50">
                <Text className="text-sm text-gray-400">Location</Text>
                <Text className="text-sm font-semibold text-navy">
                  {profile?.location ?? '—'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-sm text-gray-400">Website</Text>
                <Text className="text-sm font-semibold text-teal">
                  {profile?.website ?? '—'}
                </Text>
              </View>
            </View>
          </View>

          {/* Active Jobs */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base font-bold text-navy mb-3">
              Active Internships ({company.jobs.length})
            </Text>
            {company.jobs.length === 0 ? (
              <View className="border border-dashed border-gray-200 rounded-xl py-4 items-center">
                <Text className="text-sm text-gray-400">
                  No active internships at the moment
                </Text>
              </View>
            ) : (
              company.jobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  className="flex-row justify-between items-center bg-gray-50 rounded-xl p-3 mb-2"
                  onPress={() =>
                    navigation.navigate('JobDetail', { jobId: job.id })
                  }>
                  <View className="flex-1 pr-2">
                    <Text className="text-sm font-bold text-navy mb-1">
                      {job.title}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      📍 {job.location ?? 'Remote'} • {job.type.replace('_', ' ')}
                    </Text>
                    <Text className="text-xs text-teal font-semibold mt-1">
                      {job.isPaid ? `GH₵${job.stipend}/mo` : 'Unpaid'}
                    </Text>
                  </View>
                  <Text className="text-gray-300 text-lg">›</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default CompanyProfileScreen;