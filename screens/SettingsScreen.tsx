// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const [mode, setMode] = useState<'white' | 'black'>('white');

  const handleModeChange = (selectedMode: 'white' | 'black') => {
    setMode(selectedMode);
  };

  return (
    <View
      style={[styles.container, mode === 'black' && styles.blackBackground]}
    >
      <Text style={[styles.title, mode === 'black' && styles.blackText]}>
        Uygulama Modu
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            mode === 'white' ? styles.selectedButton : null,
          ]}
          onPress={() => handleModeChange('white')}
        >
          <Text style={styles.buttonText}>White</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            mode === 'black' ? styles.selectedButton : null,
          ]}
          onPress={() => handleModeChange('black')}
        >
          <Text style={styles.buttonText}>Black</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  blackBackground: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 40,
    color: '#000',
  },
  blackText: {
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsScreen;
