import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { fetchJobs, Job } from '../../services/jobService';

const JobCard = ({ job, onPress }: { job: Job; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.companyBadge}>
          <Text style={styles.companyInitial}>
            {job.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
          </Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.companyName}>
            {job.company.companyProfile?.companyName ?? 'Company'}
          </Text>
          <Text style={styles.location}>
            📍 {job.location ?? 'Location not specified'}
          </Text>
        </View>
        {job.isPaid && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
          </View>
        )}
      </View>

      <Text style={styles.jobTitle}>{job.title}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.skillsContainer}>
        {job.skillsRequired.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {job.skillsRequired.length > 3 && (
          <Text style={styles.moreSkills}>
            +{job.skillsRequired.length - 3} more
          </Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          {job.type.replace('_', ' ')}
        </Text>
        {job.stipend && (
          <Text style={styles.footerText}>
            GH₵ {job.stipend}/mo
          </Text>
        )}
        <Text style={styles.footerText}>
          {job._count.applications} applicants
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const BrowseJobsScreen = ({ navigation }: any) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadJobs = async (searchTerm?: string) => {
    try {
      const data = await fetchJobs(searchTerm);
      setJobs(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Internships</Text>
        <Text style={styles.headerSubtitle}>
          {jobs.length} opportunities available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, skills, companies..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
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
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6366f1']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jobs found.</Text>
            <Text style={styles.emptySubText}>
              Try a different search term.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  companyInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
  },
  cardHeaderText: {
    flex: 1,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  location: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  paidBadge: {
    backgroundColor: '#d1fae5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paidText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6366f1',
  },
  moreSkills: {
    fontSize: 11,
    color: '#9ca3af',
    alignSelf: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
});

export default BrowseJobsScreen;