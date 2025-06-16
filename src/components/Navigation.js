import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BottomNavigation from './BottomNavigation';
import RewardDetails from '../screens/RewardDetails';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import NotificationScreen from '../screens/dashboard/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Main" component={BottomNavigation} options={{headerShown: false}}/>
            <Stack.Screen name="RewardDetails" component={RewardDetails} options={{headerShown: false}}/>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Notifications" component={NotificationScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}