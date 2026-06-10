import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import api from '../../services/api';

const PostJobScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [vacancies, setVacancies] = useState('1');
  const [stipend, setStipend] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [type, setType] = useState('FULL_TIME');
  const [isLoading, setIsLoading] = useState(false);

  const jobTypes = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'HYBRID'];

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handlePost = async () => {
    if (!title || !description || skills.length === 0) {
      Alert.alert('Error', 'Title, description and at least one skill are required.');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/jobs', {
        title,
        description,
        skillsRequired: skills,
        location,
        type,
        isPaid,
        stipend: isPaid ? parseFloat(stipend) : undefined,
        duration,
        vacancies: parseInt(vacancies, 10),
      });

      Alert.alert('Success', 'Job posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message ?? 'Failed to post job.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Internship</Text>
        <Text style={styles.headerSubtitle}>
          Fill in the details to attract the best candidates
        </Text>
      </View>

      <View style={styles.form}>
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Frontend Developer Intern"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the role, responsibilities and what the intern will learn..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Accra, Ghana"
            placeholderTextColor="#9ca3af"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Job Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Job Type</Text>
          <View style={styles.typeContainer}>
            {jobTypes.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  type === t && styles.typeButtonActive,
                ]}
                onPress={() => setType(t)}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === t && styles.typeButtonTextActive,
                  ]}>
                  {t.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skills */}
        <View style={styles.field}>
          <Text style={styles.label}>Skills Required *</Text>
          <View style={styles.skillInputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="e.g. React Native"
              placeholderTextColor="#9ca3af"
              value={skillInput}
              onChangeText={setSkillInput}
              onSubmitEditing={addSkill}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={addSkill}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={styles.skillBadge}
                onPress={() => removeSkill(skill)}>
                <Text style={styles.skillText}>{skill} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.field}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3 months"
            placeholderTextColor="#9ca3af"
            value={duration}
            onChangeText={setDuration}
          />
        </View>

        {/* Vacancies */}
        <View style={styles.field}>
          <Text style={styles.label}>Number of Vacancies</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={vacancies}
            onChangeText={setVacancies}
          />
        </View>

        {/* Paid Toggle */}
        <View style={styles.field}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Paid Internship</Text>
            <Switch
              value={isPaid}
              onValueChange={setIsPaid}
              trackColor={{ false: '#e5e7eb', true: '#a5b4fc' }}
              thumbColor={isPaid ? '#6366f1' : '#9ca3af'}
            />
          </View>
          {isPaid && (
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Monthly stipend (GH₵)"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={stipend}
              onChangeText={setStipend}
            />
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePost}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Post Internship</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 120,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  skillInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  skillBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366f1',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PostJobScreen;