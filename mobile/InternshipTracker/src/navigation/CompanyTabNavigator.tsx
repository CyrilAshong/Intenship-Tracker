import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CompanyJobsScreen from '../screens/company/CompanyJobsScreen';
import CompanyProfileScreen from '../screens/company/CompanyProfileScreen';

const Tab = createBottomTabNavigator();

const CompanyTabNavigator = () => {
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
        name="Jobs"
        component={CompanyJobsScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💼</Text>,
        }}
      />
      <Tab.Screen
        name="CompanyProfile"
        component={CompanyProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default CompanyTabNavigator;