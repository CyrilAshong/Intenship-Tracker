import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchCompanyJobs, CompanyJob } from '../../services/companyService';
import { useAuth } from '../../context/AuthContext';

const CompanyJobsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadJobs = async () => {
    try {
      const data = await fetchCompanyJobs();
      setJobs(data);
    } catch (error) {
      // silent fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, []),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadJobs();
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

      <View className="flex-row justify-between items-center px-4 pt-14 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {user?.companyProfile?.companyName}
          </Text>
        </View>
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-navy items-center justify-center">
          <Text className="text-xs">🏢</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-5 pb-3 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-navy">My Job Postings</Text>
        <TouchableOpacity
          className="bg-navy rounded-full px-4 py-2"
          onPress={() => navigation.navigate('PostJob')}>
          <Text className="text-xs font-semibold text-white">+ Post Job</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#00c896']}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
            onPress={() =>
              navigation.navigate('ReviewApplicants', {
                jobId: item.id,
                jobTitle: item.title,
              })
            }>
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-base font-bold text-navy flex-1 pr-2">
                {item.title}
              </Text>
              <View
                className={`rounded-full px-2.5 py-1 ${
                  item.isActive ? 'bg-teal-light' : 'bg-gray-100'
                }`}>
                <Text
                  className={`text-[10px] font-semibold ${
                    item.isActive ? 'text-teal-dark' : 'text-gray-500'
                  }`}>
                  {item.isActive ? 'ACTIVE' : 'CLOSED'}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-500">
              {item._count.applications} applicant
              {item._count.applications !== 1 ? 's' : ''}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Posted {new Date(item.createdAt).toDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center pt-16 gap-2">
            <Text className="text-3xl">📋</Text>
            <Text className="text-sm text-gray-500 text-center">
              You haven't posted any internships yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default CompanyJobsScreen;