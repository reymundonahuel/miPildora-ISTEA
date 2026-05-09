import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddMedScreen from './src/screens/AddMedScreen';

// tipos pa la navegacion
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddMed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear cuenta' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Medicamentos', headerBackVisible: false }} />
        <Stack.Screen name="AddMed" component={AddMedScreen} options={{ title: 'Nueva Medicación' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
