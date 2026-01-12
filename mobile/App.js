import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhotoUploadScreen from './src/screens/PhotoUploadScreen';
import AnalyzingScreen from './src/screens/AnalyzingScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="PhotoUpload"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8f8f8',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="PhotoUpload" 
          component={PhotoUploadScreen}
          options={{ title: 'Beauty App' }}
        />
        <Stack.Screen 
          name="Analyzing" 
          component={AnalyzingScreen}
          options={{ title: 'Analyzing...', headerBackVisible: false }}
        />
        <Stack.Screen 
          name="Results" 
          component={ResultsScreen}
          options={{ title: 'Your Personalized Guide', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


