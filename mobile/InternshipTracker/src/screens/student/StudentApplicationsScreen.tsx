import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMyApplications } from '../../services/jobService';

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  jobPosting: {
    title: string;
    company: {
      companyProfile: {
        companyName: string;
      } | null;
    };
  };
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  SHORTLISTED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Shortlisted' },
  INTERVIEWING: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Interviewing' },
  ACCEPTED: { bg: 'bg-teal-light', text: 'text-teal-dark', label: 'Accepted' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
};

const StudentApplicationsScreen = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadApplications = async () => {
    try {
      const data = await fetchMyApplications();
      setApplications(data);
    } catch (error) {
      // silent fail, list will just be empty
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
      <View className="bg-white px-4 pt-14 pb-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-navy">My Applications</Text>
        <Text className="text-xs text-gray-500 mt-1">
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </Text>
      </View>

      <FlatList
        data={applications}
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
          const style = statusStyles[item.status] ?? statusStyles.PENDING;
          return (
            <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-2">
                  <Text className="text-base font-bold text-navy">
                    {item.jobPosting.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {item.jobPosting.company.companyProfile?.companyName ?? 'Company'}
                  </Text>
                </View>
                <View className={`rounded-full px-3 py-1 ${style.bg}`}>
                  <Text className={`text-xs font-semibold ${style.text}`}>
                    {style.label}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-gray-400">
                Applied {new Date(item.appliedAt).toDateString()}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="items-center pt-16 gap-2">
            <Text className="text-3xl">📋</Text>
            <Text className="text-sm text-gray-500">
              You haven't applied to any jobs yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default StudentApplicationsScreen;