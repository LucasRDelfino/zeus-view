import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { buscarAlertas } from '../services/alertaService';
import { getUFByCidade } from '../utils/cidadeParaUF';

const MOCK_ALERTAS = [
  {
    id: 'mock1',
    titulo: 'Tempestade Forte',
    descricao: 'Possibilidade de tempestade com ventos fortes e chuvas intensas.',
    severidade: 'extremo',
    tipo: 'tempestade',
    dataEmissao: new Date().toISOString(),
    regiao: 'Centro da cidade',
  },
  {
    id: 'mock2',
    titulo: 'Alerta de Calor',
    descricao: 'Temperaturas elevadas acima dos 35°C esperadas para hoje.',
    severidade: 'moderado',
    tipo: 'calor',
    dataEmissao: new Date().toISOString(),
    regiao: 'Zona Sul',
  },
];

export default function AlertasScreen({ navigation }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uf, setUf] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const cidade = await AsyncStorage.getItem('cidade');
      if (!cidade) {
        setAlertas(MOCK_ALERTAS);
        setUf('SP');
        return;
      }

      const estadoUF = getUFByCidade(cidade);
      if (!estadoUF) {
        setAlertas(MOCK_ALERTAS);
        setUf('SP');
        return;
      }

      setUf(estadoUF);
      const resultado = await buscarAlertas(`${estadoUF}?timestamp=${Date.now()}`);

      if (Array.isArray(resultado) && resultado.length > 0) {
        setAlertas(resultado);
      } else {
        setAlertas(MOCK_ALERTAS);
      }

    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      setAlertas(MOCK_ALERTAS);
      setUf('UF Desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#2ecc71';
    
    switch (severity.toLowerCase()) {
      case 'extremo':
      case 'vermelho':
        return '#e74c3c';
      case 'severo':
      case 'laranja':
        return '#f39c12';
      case 'moderado':
      case 'amarelo':
        return '#f1c40f';
      default:
        return '#2ecc71';
    }
  };

  const getAlertIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'tempestade':
        return 'weather-lightning';
      case 'chuva':
        return 'weather-pouring';
      case 'vento':
        return 'weather-windy';
      case 'calor':
        return 'weather-sunny';
      case 'frio':
        return 'weather-snowy';
      default:
        return 'weather-cloudy';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cabecalho}>
            <Icon name="alert" size={28} color="#2c3e50" />
            <Text style={styles.cidadeTexto} numberOfLines={1} ellipsizeMode="tail">
              Alertas - {uf}
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Icon name="reload" size={24} color="#3498db" />
            </TouchableOpacity>
          </View>

          {alertas.length === 0 ? (
            <View style={styles.semAlertasContainer}>
              <Icon name="weather-cloudy" size={56} color="#bdc3c7" />
              <Text style={styles.semAlertasTexto}>Nenhum alerta ativo</Text>
              <TouchableOpacity 
                style={[styles.botao, styles.botaoRecarregar]}
                onPress={handleRefresh}
              >
                <Text style={styles.botaoTexto}>Recarregar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            alertas.map((alerta, index) => (
              <View 
                key={`${alerta.id || index}`} 
                style={[
                  styles.alertaContainer,
                  { borderLeftColor: getSeverityColor(alerta.severidade) }
                ]}
              >
                <View style={styles.alertaCabecalho}>
                  <Icon 
                    name={getAlertIcon(alerta.tipo)} 
                    size={28} 
                    color={getSeverityColor(alerta.severidade)} 
                  />
                  <Text style={styles.alertaTitulo} numberOfLines={2} ellipsizeMode="tail">
                    {alerta.titulo}
                  </Text>
                </View>
                
                <Text style={styles.alertaDescricao} numberOfLines={4} ellipsizeMode="tail">
                  {alerta.descricao}
                </Text>
                
                <View style={styles.alertaRodape}>
                  <View style={styles.alertaInfo}>
                    <Icon name="calendar-clock" size={18} color="#7f8c8d" />
                    <Text style={styles.alertaTexto} numberOfLines={1} ellipsizeMode="tail">
                      {alerta.dataEmissao ? new Date(alerta.dataEmissao).toLocaleString('pt-BR') : 'Data não disponível'}
                    </Text>
                  </View>
                  <View style={styles.alertaInfo}>
                    <Icon name="map-marker-radius" size={18} color="#7f8c8d" />
                    <Text style={styles.alertaTexto} numberOfLines={1} ellipsizeMode="tail">
                      {alerta.regiao || 'Região não especificada'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 40,
    paddingTop: 10,
    paddingHorizontal: 0, // SEM padding horizontal no ScrollView pra evitar scroll lateral
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 20,
  },
  cidadeTexto: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  refreshButton: {
    padding: 8,
  },
  semAlertasContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  semAlertasTexto: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 25,
  },
  alertaContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  alertaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertaTitulo: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  alertaDescricao: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 15,
    lineHeight: 24,
  },
  alertaRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  alertaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginRight: 20,
  },
  alertaTexto: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 6,
    flexShrink: 1, // evita overflow no texto
  },
  botao: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botaoRecarregar: {
    backgroundColor: '#2ecc71',
  },
  botaoTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
});
