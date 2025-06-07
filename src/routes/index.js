import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CadastroScreen from '../screens/CadastroScreen';
import LoginScreen from '../screens/LoginScreen';
import ClimaScreen from '../screens/ClimaScreen';
import ProbabilidadeScreen from '../screens/probabilidadeScreen';
import AlertasScreen from '../screens/AlertasScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

useEffect(() => {
  const verificarLogin = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const cidade = await AsyncStorage.getItem('cidade');

      if (usuario && cidade) {
        setIsLogged(true);
      }
    } catch (error) {
      console.log('Erro ao verificar login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  verificarLogin();
}, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLogged ? 'Clima' : 'Login'}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Clima" 
          component={ClimaScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Probabilidade" 
          component={ProbabilidadeScreen} 
          options={{ title: 'Probabilidade' }} 
        />
        <Stack.Screen 
          name="Alertas" 
          component={AlertasScreen} 
          options={{ title: 'Alertas' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}