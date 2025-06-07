import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

export default function Input({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  estilo,
  estiloInput
}) {
  return (
    <View style={[styles.container, estilo]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, estiloInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});