import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../global/ThemeContext';

const SettingsScreen = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDarkMode = theme === 'black';

  const toggleSwitch = (value: boolean) => {
    setTheme(value ? 'black' : 'white');
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  whiteBackground: { backgroundColor: '#fff' },
  blackBackground: { backgroundColor: '#121212' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 40, color: '#000' },
  blackText: { color: '#fff' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 18, marginHorizontal: 10, color: '#000' },
});

export default SettingsScreen;
