import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMyApplications } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  jobPosting: {
    id: string;
    title: string;
    company: {
      companyProfile: {
        companyName: string;
      } | null;
    };
  };
}

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  PENDING: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Under Review', icon: '👁' },
  SHORTLISTED: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Shortlisted', icon: '⭐' },
  INTERVIEWING: { bg: 'bg-teal-light', text: 'text-teal-dark', label: 'Interview Scheduled', icon: '📅' },
  ACCEPTED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Offer Received', icon: '⊕' },
  REJECTED: { bg: 'bg-gray-200', text: 'text-gray-500', label: 'Declined', icon: '⊗' },
};

type TabType = 'ACTIVE' | 'HISTORY';

const StudentApplicationsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const profile = user?.studentProfile as any;
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tab, setTab] = useState<TabType>('ACTIVE');

  const loadApplications = async () => {
    try {
      const data = await fetchMyApplications();
      setApplications(data);
    } catch (error) {
      // silent fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, []),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadApplications();
  };

  const filteredApplications = applications.filter((a) =>
    tab === 'ACTIVE'
      ? ['PENDING', 'SHORTLISTED', 'INTERVIEWING'].includes(a.status)
      : ['ACCEPTED', 'REJECTED'].includes(a.status),
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1a2b4a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <Text className="text-lg font-bold text-navy">🎓 My Applications</Text>
        <View className="w-9 h-9 rounded-full bg-navy items-center justify-center overflow-hidden">
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          ) : (
            <Text className="text-sm font-bold text-white">
              {profile?.firstName?.charAt(0) ?? 'S'}
            </Text>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-gray-100 mx-4 mt-4 rounded-xl p-1">
        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-lg items-center ${
            tab === 'ACTIVE' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setTab('ACTIVE')}>
          <Text
            className={`text-sm ${
              tab === 'ACTIVE' ? 'text-navy font-bold' : 'text-gray-500 font-medium'
            }`}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-lg items-center ${
            tab === 'HISTORY' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setTab('HISTORY')}>
          <Text
            className={`text-sm ${
              tab === 'HISTORY' ? 'text-navy font-bold' : 'text-gray-500 font-medium'
            }`}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#00c896']}
          />
        }
        renderItem={({ item }) => {
          const status = statusConfig[item.status] ?? statusConfig.PENDING;
          return (
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center"
              onPress={() =>
                navigation.navigate('JobDetail', { jobId: item.jobPosting.id })
              }>
              <View className="w-12 h-12 rounded-xl bg-gray-50 items-center justify-center border border-gray-100 mr-3">
                <Text className="text-lg font-bold text-navy">
                  {item.jobPosting.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
                </Text>
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-base font-bold text-navy flex-1 pr-2">
                    {item.jobPosting.title}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500 mb-2">
                  {item.jobPosting.company.companyProfile?.companyName ?? 'Company'}
                </Text>
                <View className={`self-start rounded-full px-2.5 py-1 flex-row items-center gap-1 mb-2 ${status.bg}`}>
                  <Text className="text-xs">{status.icon}</Text>
                  <Text className={`text-xs font-semibold ${status.text}`}>
                    {status.label}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400">
                  📅 Applied {new Date(item.appliedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </View>

              <Text className="text-gray-300 text-lg ml-2">›</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="items-center pt-16 gap-2">
            <Text className="text-3xl">📋</Text>
            <Text className="text-sm text-gray-500">
              {tab === 'ACTIVE'
                ? 'No active applications yet.'
                : 'No application history yet.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default StudentApplicationsScreen;