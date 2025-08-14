// screens/SettingsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // false = ağ, true = qara

  // AsyncStorage-dan mövcud mode-u oxu
  useEffect(() => {
    const loadMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('@mode');
        if (storedMode === 'black') {
          setIsDarkMode(true);
        } else {
          setIsDarkMode(false);
        }
      } catch (e) {
        console.log('Mode oxunmadı:', e);
      }
    };
    loadMode();
  }, []);

  const toggleSwitch = async (value: boolean) => {
    try {
      setIsDarkMode(value);
      const mode = value ? 'black' : 'white';
      await AsyncStorage.setItem('@mode', mode);
      console.log('Mode AsyncStorage-a yazıldı:', mode);
    } catch (e) {
      console.log('Mode yazılmadı:', e);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.blackBackground : styles.whiteBackground,
      ]}
    >
      <Text style={[styles.title, isDarkMode && styles.blackText]}>
        Tətbiq Modu
      </Text>

      <View style={styles.switchContainer}>
        <Text style={[styles.label, isDarkMode && styles.blackText]}>
          Ağ Mod
        </Text>
        <Switch
          trackColor={{ false: '#ccc', true: '#28a745' }}
          thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
        <Text style={[styles.label, isDarkMode && styles.blackText]}>
          Qara Mod
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBackground: {
    backgroundColor: '#fff',
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#000',
  },
});

export default SettingsScreen;
