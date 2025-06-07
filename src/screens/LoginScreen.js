import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/userService';
import Botao from '../components/Botao';
import Input from '../components/Input';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

 const handleLogin = async () => {
  if (!usuario || !senha) {
    Alert.alert('Atenção', 'Preencha todos os campos.');
    return;
  }

  try {
    // Tenta login na API normalmente
    const response = await loginUsuario({ usuario, senha });
    await AsyncStorage.setItem('usuario', response.usuario);
    await AsyncStorage.setItem('cidade', response.cidade);
    Alert.alert('Sucesso', 'Login realizado!');
    navigation.replace('Clima');
  } catch (error) {
    // Se falhar a conexão com API, mockar login
    Alert.alert(
      'Aviso',
      'Não foi possível conectar ao serviço. Usando login mock para teste.'
    );

    // Mock: salva localmente usuário e cidade padrão
    await AsyncStorage.setItem('usuario', usuario);
    await AsyncStorage.setItem('cidade', 'Cidade Mock');

    navigation.replace('Clima');
  }
};
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.titulo}>Login</Text>

      <Input
        label="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Digite seu usuário"
      />

      <Input
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <Botao 
        titulo="ENTRAR" 
        onPress={handleLogin}
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('Cadastro')}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          Não tem uma conta? <Text style={styles.registerHighlight}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  registerLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 15,
  },
  registerHighlight: {
    color: '#4285f4',
    fontWeight: 'bold',
  },
});
