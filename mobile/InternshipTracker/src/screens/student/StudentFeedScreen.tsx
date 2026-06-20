import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { fetchJobs } from '../../services/jobService';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';

const getMatchColor = (score: number) => {
  if (score >= 85) return 'bg-teal';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-red-500';
};

const JobCard = ({ job, onPress }: { job: Job; onPress: () => void }) => {
  const matchScore = Math.floor(Math.random() * 30) + 70;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-gray-100 shadow-sm"
      onPress={onPress}>
      <View className="w-12 h-12 rounded-xl bg-gray-50 items-center justify-center border border-gray-100 mr-3">
        <Text className="text-xl font-bold text-navy">
          {job.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-base font-bold text-navy mb-0.5">
          {job.title}
        </Text>
        <Text className="text-sm text-gray-500 mb-1">
          {job.company.companyProfile?.companyName ?? 'Company'}
        </Text>
        <View className="flex-row items-center flex-wrap gap-1">
          <Text className="text-xs text-gray-400">
            📍 {job.location ?? 'Remote'}
          </Text>
          <Text className="text-xs text-gray-400">•</Text>
          <Text className="text-xs text-gray-400">
            {job.type.replace('_', ' ')} • {job.duration ?? 'N/A'}
          </Text>
        </View>
      </View>

      <View className={`rounded-full px-2.5 py-1.5 items-center min-w-[56px] ${getMatchColor(matchScore)}`}>
        <Text className="text-sm font-bold text-white">{matchScore}%</Text>
        <Text className="text-[9px] text-white">Match</Text>
      </View>
    </TouchableOpacity>
  );
};

const StudentFeedScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadJobs = async (searchTerm?: string) => {
    try {
      const data = await fetchJobs(searchTerm);
      setJobs(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    loadJobs(search);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadJobs(search);
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

      {/* Header */}
      <View className="bg-white px-4 pt-14 pb-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center">
              <Text className="text-lg">🔔</Text>
            </TouchableOpacity>
            <View className="w-9 h-9 rounded-full bg-navy items-center justify-center">
              <Text className="text-sm font-bold text-white">
                {user?.studentProfile?.firstName?.charAt(0) ?? 'S'}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-bold text-navy mb-1">
          Recommended for You
        </Text>
        <Text className="text-xs text-gray-500 mb-4">
          Based on your Computer Science background and interests.
        </Text>

        {/* Search */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-4 py-2.5 gap-2 border border-gray-200">
            <Text className="text-sm">🔍</Text>
            <TextInput
              className="flex-1 text-sm text-navy"
              placeholder="Search internships..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            className="w-11 h-11 rounded-xl bg-gray-50 items-center justify-center border border-gray-200"
            onPress={handleSearch}>
            <Text className="text-lg">⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Job List */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#00c896']}
          />
        }
        ListEmptyComponent={
          <View className="items-center pt-16 gap-2">
            <Text className="text-3xl">✨</Text>
            <Text className="text-sm text-gray-500 text-center">
              No jobs found. Try a different search.
            </Text>
          </View>
        }
        ListFooterComponent={
          jobs.length > 0 ? (
            <View className="items-center py-6 gap-1">
              <Text className="text-2xl">✨</Text>
              <Text className="text-sm text-gray-500">
                Check back tomorrow for more matches
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default StudentFeedScreen;