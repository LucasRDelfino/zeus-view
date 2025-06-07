import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { buscarProbabilidade } from '../services/probabilidadeService';

const MOCK_PROBABILIDADE = {
  cidade: 'Cidade Fake',
  probabilidadeQuedaEnergia: '45.3',
  dataAtualizacao: new Date().toISOString(),
};

export default function ProbabilidadeScreen({ navigation }) {
  const [probabilidade, setProbabilidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const nomeUsuario = await AsyncStorage.getItem('usuario');
        if (nomeUsuario) setUsuario(nomeUsuario);

        const cidade = await AsyncStorage.getItem('cidade');
        if (cidade) {
          const resultado = await buscarProbabilidade(cidade);
          setProbabilidade(resultado);
        } else {
          // Se não tiver cidade, usa mock
          setProbabilidade(MOCK_PROBABILIDADE);
        }
      } catch (error) {
        console.error(error);
        // Se erro, usa mock
        setProbabilidade(MOCK_PROBABILIDADE);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.usuario}>{usuario || 'Usuário'}</Text>
        </View>

        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const valorProbabilidade = probabilidade?.probabilidadeQuedaEnergia
    ? parseFloat(probabilidade.probabilidadeQuedaEnergia).toFixed(1)
    : 'N/A';

  const dataAtualizacao = probabilidade?.dataAtualizacao
    ? new Date(probabilidade.dataAtualizacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '--/--/----';

  const nivelRisco =
    valorProbabilidade > 70
      ? 'Alto Risco'
      : valorProbabilidade > 30
      ? 'Risco Médio'
      : 'Baixo Risco';
  const corRisco =
    valorProbabilidade > 70
      ? '#e74c3c'
      : valorProbabilidade > 30
      ? '#f39c12'
      : '#2ecc71';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.usuario}>{usuario || 'Usuário'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cabecalho}>
          <Icon name="city" size={24} color="#2c3e50" />
          <Text style={styles.cidadeTexto}>{probabilidade?.cidade || 'N/A'}</Text>
        </View>

        <View style={styles.valorContainer}>
          <Text style={styles.valorProbabilidade}>{valorProbabilidade}%</Text>
          <Text style={styles.rotuloProbabilidade}>Probabilidade Queda Energia</Text>
        </View>

        <View style={styles.detalhesContainer}>
          <View style={styles.detalheItem}>
            <Icon name="lightning-bolt" size={20} color="#7f8c8d" />
            <Text style={styles.detalheRotulo}>Nível de Risco</Text>
            <Text style={[styles.detalheValor, { color: corRisco }]}>{nivelRisco}</Text>
          </View>

          <View style={styles.detalheItem}>
            <Icon name="calendar-clock" size={20} color="#7f8c8d" />
            <Text style={styles.detalheRotulo}>Última Atualização</Text>
            <Text style={styles.detalheValor}>{dataAtualizacao}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  usuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  card: {
    marginTop: 40,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 15,
  },
  cidadeTexto: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  valorContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  valorProbabilidade: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  rotuloProbabilidade: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  detalhesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detalheRotulo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 10,
    marginRight: 5,
    flex: 1,
  },
  detalheValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});
