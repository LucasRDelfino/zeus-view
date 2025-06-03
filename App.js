import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function App() {
  const [cidade, setCidade] = useState('');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const buscarDados = async () => {
    if (!cidade) {
      setErro('Por favor, digite uma cidade.');
      return;
    }

    setLoading(true);
    setErro('');
    setDados(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/weather`, {
        params: { cidade }
      });
      setDados(response.data);
    } catch (error) {
      console.log(error);
      setErro('Erro ao buscar dados. Verifique a cidade ou o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clima Atual</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a cidade"
        value={cidade}
        onChangeText={setCidade}
      />

      <Button title="Buscar" onPress={buscarDados} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {dados && (
    <View style={styles.card}>
        <Text style={styles.cidade}>{dados.cidade}</Text>
        <Text style={styles.descricao}>{dados.descricao}</Text>
        <Text style={styles.vento}>🌬️ Vento: {dados.velocidadeVento.toFixed(1)} km/h</Text>
        <Text style={styles.umidade}>💧 Umidade: {dados.umidade}%</Text>
    </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddeaf6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  erro: {
    color: 'red',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    elevation: 5, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cidade: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 18,
    marginTop: 5,
  },
  vento: {
    fontSize: 16,
    marginTop: 10,
  }
});
