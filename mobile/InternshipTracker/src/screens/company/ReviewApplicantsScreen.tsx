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
import {
  fetchJobApplicants,
  updateApplicationStatus,
  Applicant,
} from '../../services/companyService';

type FilterType = 'ALL' | 'TOP' | 'UNDER_REVIEW';

const ReviewApplicantsScreen = ({ route, navigation }: any) => {
  const { jobId, jobTitle } = route.params;
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplicants = async () => {
    try {
      const data = await fetchJobApplicants(jobId);
      setApplicants(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load applicants.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const handleShortlist = async (applicationId: string) => {
    try {
      setUpdatingId(applicationId);
      await updateApplicationStatus(applicationId, 'SHORTLISTED');
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: 'SHORTLISTED' } : a,
        ),
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to shortlist candidate.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getMatchScore = (skills: string[]) => {
    // Simple heuristic until real AI scoring is wired in
    const base = 60 + skills.length * 5;
    return Math.min(base, 95);
  };

  const filteredApplicants = applicants.filter((a) => {
    if (filter === 'TOP') return getMatchScore(a.student.studentProfile?.skills ?? []) >= 85;
    if (filter === 'UNDER_REVIEW') return a.status === 'PENDING';
    return true;
  });

  const avgMatch =
    applicants.length > 0
      ? Math.round(
          applicants.reduce(
            (sum, a) => sum + getMatchScore(a.student.studentProfile?.skills ?? []),
            0,
          ) / applicants.length,
        )
      : 0;

  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED').length;

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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-14 pb-3 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl text-navy">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
          <View className="w-9 h-9 rounded-full bg-navy items-center justify-center">
            <Text className="text-xs">🏢</Text>
          </View>
        </View>

        <View className="px-4 pt-5">
          <Text className="text-2xl font-bold text-navy">
            Candidate Review Board
          </Text>
          <Text className="text-sm text-gray-500 mt-1 mb-4">
            Managing {jobTitle}
          </Text>

          {/* Filters + Export */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity className="flex-row items-center gap-1.5 bg-navy rounded-full px-4 py-2">
              <Text className="text-xs">☰</Text>
              <Text className="text-xs font-semibold text-white">Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2">
              <Text className="text-xs">⬇</Text>
              <Text className="text-xs font-semibold text-navy">Export</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="text-xs text-gray-400 mb-1">Total Applicants</Text>
            <Text className="text-3xl font-bold text-navy">
              {applicants.length}
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="text-xs text-gray-400 mb-1">Shortlisted</Text>
            <Text className="text-3xl font-bold text-teal">
              {shortlistedCount}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">✨ Ready for review</Text>
          </View>

          <View className="bg-navy rounded-2xl p-4 mb-4">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-xs text-white/60 mb-1">
                  Avg. Match Score
                </Text>
                <Text className="text-3xl font-bold text-white">{avgMatch}%</Text>
              </View>
              <Text className="text-xl">📊</Text>
            </View>
            <View className="h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
              <View
                className="h-full bg-teal rounded-full"
                style={{ width: `${avgMatch}%` }}
              />
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-white rounded-xl p-1 mb-4 border border-gray-100">
            {(['ALL', 'TOP', 'UNDER_REVIEW'] as FilterType[]).map((f) => (
              <TouchableOpacity
                key={f}
                className={`flex-1 py-2 rounded-lg items-center ${
                  filter === f ? 'bg-gray-100' : ''
                }`}
                onPress={() => setFilter(f)}>
                <Text className="text-xs font-semibold text-navy">
                  {f === 'ALL' ? 'All Candidates' : f === 'TOP' ? 'Top Matches' : 'Under Review'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Candidates */}
          {filteredApplicants.map((applicant) => {
            const match = getMatchScore(applicant.student.studentProfile?.skills ?? []);
            const isShortlisted = applicant.status === 'SHORTLISTED';
            return (
              <View
                key={applicant.id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                    <Text className="text-base font-bold text-navy">
                      {applicant.student.studentProfile?.firstName?.charAt(0) ?? 'S'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-navy">
                      {applicant.student.studentProfile?.firstName}{' '}
                      {applicant.student.studentProfile?.lastName}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {applicant.student.studentProfile?.university ?? 'University not set'}
                    </Text>
                    <View className="flex-row gap-1 mt-1">
                      <View className="bg-gray-100 rounded px-2 py-0.5">
                        <Text className="text-[10px] font-semibold text-gray-500">
                          {applicant.student.studentProfile?.yearOfStudy
                            ? `YEAR ${applicant.student.studentProfile.yearOfStudy}`
                            : 'STUDENT'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="h-px bg-gray-100 mb-3" />

                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <View className="w-10 h-10 rounded-full border-2 border-teal items-center justify-center">
                      <Text className="text-xs font-bold text-teal">{match}%</Text>
                    </View>
                    <View>
                      <Text className="text-xs font-bold text-teal">
                        AI Match Score
                      </Text>
                      <Text className="text-[10px] text-gray-400">
                        Based on skills overlap
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-3">
                    <Text className="text-base">☆</Text>
                    <Text className="text-base">⋮</Text>
                  </View>
                </View>

                <View className="bg-teal-light rounded-xl p-3 mb-3">
                  <Text className="text-[10px] font-bold text-teal-dark mb-1">
                    ✦ AI CANDIDATE SUMMARY
                  </Text>
                  <Text className="text-xs text-gray-600 italic leading-5">
                    "{applicant.student.studentProfile?.firstName} shows a skill
                    profile aligned with{' '}
                    {applicant.student.studentProfile?.skills.slice(0, 2).join(' and ') ?? 'this role'}.
                    {applicant.coverNote ? ` Cover note: "${applicant.coverNote}"` : ''}"
                  </Text>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`flex-1 rounded-xl py-3 items-center ${
                      isShortlisted ? 'bg-teal' : 'bg-navy'
                    }`}
                    disabled={isShortlisted || updatingId === applicant.id}
                    onPress={() => handleShortlist(applicant.id)}>
                    {updatingId === applicant.id ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text className="text-sm font-semibold text-white">
                        {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 border border-gray-200 rounded-xl py-3 items-center">
                    <Text className="text-sm font-semibold text-navy">
                      View Profile
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {filteredApplicants.length === 0 && (
            <View className="items-center pt-12 gap-2">
              <Text className="text-3xl">📭</Text>
              <Text className="text-sm text-gray-500">
                No applicants in this category yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewApplicantsScreen;