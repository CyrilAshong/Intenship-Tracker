import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Student Screens
import StudentDashboard from '../screens/student/StudentDashboard';
import BrowseJobsScreen from '../screens/student/BrowseJobsScreen';
import JobDetailScreen from '../screens/student/JobDetailScreen';
import UploadDocumentsScreen from '../screens/student/UploadDocumentsScreen';

// Company Screens
import CompanyDashboard from '../screens/company/CompanyDashboard';
import PostJobScreen from '../screens/company/PostJobScreen';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : user.role === 'STUDENT' ? (
          <>
            <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
            <Stack.Screen
              name="BrowseJobs"
              component={BrowseJobsScreen}
              options={{ headerShown: true, title: 'Browse Jobs', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="JobDetail"
              component={JobDetailScreen}
              options={{ headerShown: true, title: 'Job Detail', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="UploadDocuments"
              component={UploadDocumentsScreen}
              options={{ headerShown: true, title: 'My Documents', headerBackTitle: 'Back' }}
            />
          </>
        ) : user.role === 'COMPANY' ? (
          <>
            <Stack.Screen name="CompanyDashboard" component={CompanyDashboard} />
            <Stack.Screen
              name="PostJob"
              component={PostJobScreen}
              options={{ headerShown: true, title: 'Post Internship', headerBackTitle: 'Back' }}
            />
          </>
        ) : (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;