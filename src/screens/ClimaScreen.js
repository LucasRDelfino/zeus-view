import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarClima } from '../services/weatherService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ClimaScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Buscar usuário salvo no AsyncStorage
  useEffect(() => {
    const buscarUsuario = async () => {
      const nome = await AsyncStorage.getItem('usuario');
      if (nome) setUsuario(nome);
    };
    buscarUsuario();
  }, []);

  // Função para obter ícone com base na descrição do clima
  const getWeatherIcon = (descricao) => {
    if (!descricao) return 'weather-cloudy';

    const desc = descricao.toLowerCase();
    if (desc.includes('nublado')) return 'weather-cloudy';
    if (desc.includes('chuva')) return 'weather-rainy';
    if (desc.includes('sol')) return 'weather-sunny';
    if (desc.includes('tempestade')) return 'weather-lightning';
    if (desc.includes('neve')) return 'weather-snowy';
    return 'weather-partly-cloudy';
  };

  const buscar = async () => {
    const cidade = await AsyncStorage.getItem('cidade');
    if (!cidade) {
      setErro('Nenhuma cidade cadastrada.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const dadosAPI = await buscarClima(cidade);
      setDados({
        cidade: dadosAPI.cidade,
        descricao: dadosAPI.descricao,
        temperatura: dadosAPI.temperatura || 0,
        velocidadeVento: dadosAPI.velocidadeVento || 0,
        umidade: dadosAPI.umidade || 0,
        icone: getWeatherIcon(dadosAPI.descricao),
        pressao: dadosAPI.pressao || 1012,
      });
    } catch (error) {
      console.log('Erro ao buscar clima da API, usando dados mock:', error);

      // Mock de dados para testes offline
      const dadosMock = {
        cidade,
        descricao: 'Parcialmente nublado',
        temperatura: 25,
        velocidadeVento: 10,
        umidade: 65,
        pressao: 1013,
        icone: getWeatherIcon('Parcialmente nublado'),
      };

      setDados(dadosMock);
      setErro('Não foi possível obter dados reais. Mostrando dados mock.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscar();
  }, []);

  // Previsão horária baseada nos dados atuais
  const hourlyTemperatures = [
    { time: 'Agora', temp: dados?.temperatura || 0, icon: dados?.icone || 'weather-cloudy' },
    { time: '13:00', temp: (dados?.temperatura || 0) + 2, icon: 'weather-partly-cloudy' },
    { time: '14:00', temp: (dados?.temperatura || 0) + 1, icon: 'weather-rainy' },
    { time: '15:00', temp: (dados?.temperatura || 0) - 2, icon: 'weather-rainy' },
    { time: '16:00', temp: (dados?.temperatura || 0) + 1, icon: 'weather-partly-cloudy' },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com usuário e botão ver alertas */}
      <View style={styles.header}>
        <Text style={styles.usuario}>{usuario || 'Usuário'}</Text>

        <TouchableOpacity
          style={styles.alertButton}
          onPress={() => navigation.navigate('Alertas')}
        >
          <Icon name="alert-circle" size={24} color="#e74c3c" />
          <Text style={styles.alertButtonText}>Ver Alertas</Text>
        </TouchableOpacity>
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {dados && (
        <View style={styles.weatherCard}>
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={20} color="#3498db" />
              <Text style={styles.locationName}>{dados.cidade}</Text>
            </View>
            <View style={styles.weatherRow}>
              <Icon name={dados.icone} size={20} color="#7f8c8d" />
              <Text style={styles.weatherCondition}>{dados.descricao}</Text>
            </View>
          </View>

          <View style={styles.temperatureContainer}>
            <Text style={styles.temperatureText}>{dados.temperatura}°</Text>
          </View>

          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Icon name="weather-windy" size={20} color="#7f8c8d" />
              <Text style={styles.detailLabel}>Vento</Text>
              <Text style={styles.detailValue}>{dados.velocidadeVento.toFixed(1)} km/h</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="water-percent" size={20} color="#7f8c8d" />
              <Text style={styles.detailLabel}>Umidade</Text>
              <Text style={styles.detailValue}>{dados.umidade}%</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="gauge" size={20} color="#7f8c8d" />
              <Text style={styles.detailLabel}>Pressão</Text>
              <Text style={styles.detailValue}>{dados.pressao} hPa</Text>
            </View>
          </View>
        </View>
      )}

      {/* Previsão horária */}
      <View style={styles.hourlyForecast}>
        <View style={styles.hourlyContainer}>
          {hourlyTemperatures.map((hour, index) => (
            <View key={index} style={styles.hourItem}>
              <Text style={styles.hourLabel}>{hour.time}</Text>
              <Icon name={hour.icon} size={24} color="#2c3e50" />
              <Text style={styles.hourTemp}>{hour.temp}°</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Probabilidade')}
        >
          <Icon name="lightning-bolt" size={20} color="#fff" />
          <Text style={styles.buttonText}>VER PROBABILIDADE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textButton}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Icon name="account-switch" size={20} color="#3498db" />
          <Text style={styles.textButtonText}>ALTERAR USUÁRIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  usuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },

  alertButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },

  erro: {
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },

  weatherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  locationContainer: {
    marginBottom: 10,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },

  weatherCondition: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 10,
  },

  temperatureContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },

  temperatureText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  detailItem: {
    alignItems: 'center',
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 5,
  },

  hourlyForecast: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  hourlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  hourItem: {
    alignItems: 'center',
    flex: 1,
  },

  hourLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },

  hourTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 5,
  },

  buttonsContainer: {
    marginTop: 10,
  },

  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  primaryButton: {
    backgroundColor: '#2ecc71',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },

  textButton: {
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  textButtonText: {
    color: '#3498db',
    fontWeight: '600',
    marginLeft: 10,
  },
});
