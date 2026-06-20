import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentFeedScreen from '../screens/student/StudentFeedScreen';
import StudentApplicationsScreen from '../screens/student/StudentApplicationsScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00c896',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 8,
          height: 70,
          borderTopColor: '#e5e7eb',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Feed"
        component={StudentFeedScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔄</Text>,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={StudentApplicationsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>✅</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StudentProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;