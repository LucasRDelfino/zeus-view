import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cadastrarUsuario } from '../services/userService';
import Botao from '../components/Botao';
import Input from '../components/Input';

export default function CadastroScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [cidade, setCidade] = useState('');

  const handleCadastro = async () => {
    if (!usuario || !senha || !cidade) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const user = { usuario, senha, cidade };

    try {
      // Tentativa de cadastro via API
      await cadastrarUsuario(user);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    } catch (error) {
      Alert.alert(
        'Aviso',
        'Não foi possível conectar com a API. Os dados foram salvos localmente.',
        [{ text: 'OK' }]
      );

      // Se a API falhar, salva localmente
      try {
        await AsyncStorage.setItem(`usuario_local_${usuario}`, JSON.stringify(user));
        Alert.alert('Offline', 'Cadastro salvo localmente. Você está sem conexão com o servidor.');
      } catch (storageError) {
        console.error(storageError);
        Alert.alert('Erro', 'Não foi possível salvar os dados localmente.');
        return;
      }
    }

    // Salva dados do usuário logado localmente (usado para navegação)
    await AsyncStorage.setItem('usuario', usuario);
    await AsyncStorage.setItem('cidade', cidade);
    
    navigation.replace('Clima');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.titulo}>Cadastro</Text>

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

      <Input
        label="Cidade"
        value={cidade}
        onChangeText={setCidade}
        placeholder="Digite sua cidade"
      />

      <Botao 
        titulo="CADASTRAR" 
        onPress={handleCadastro}
      />

      <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
      >

      <Text style={styles.loginText}>
          Já tem uma conta? <Text style={styles.loginHighlight}>Faça login</Text>
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
    marginBottom: 20, 
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20, 
    textAlign: 'center',
    color: '#333',
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  loginHighlight: {
    color: '#4285f4',
    fontWeight: 'bold',
  },
});
