import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import SpanishScreen from './screens/SpanishScreen';
import GermanScreen from './screens/GermanScreen';
import BoxingScreen from './screens/BoxingScreen';
import OudScreen from './screens/OudScreen';
import GymScreen from './screens/GymScreen';
import ProgressScreen from './screens/ProgressScreen';
import DailyActivitiesScreen from './screens/DailyActivitiesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Placeholder({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18 }}>{title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <StatusBar style="auto" />
      <Drawer.Navigator initialRouteName="Progress">
        <Drawer.Screen name="Progress" component={ProgressScreen} />
        <Drawer.Screen name="Spanish" component={SpanishScreen} />
        <Drawer.Screen name="German" component={GermanScreen} />
        <Drawer.Screen name="Oud" component={OudScreen} />
        <Drawer.Screen name="Boxing" component={BoxingScreen} />
        <Drawer.Screen name="Gym" component={GymScreen} />
        <Drawer.Screen name="Daily Activities" component={DailyActivitiesScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
