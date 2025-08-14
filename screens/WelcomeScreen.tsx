// /screens/WelcomeScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  BackHandler,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

const WelcomeScreen = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Çıxış', 'Tətbiqdən çıxmaq istəyirsiniz?', [
          { text: 'Xeyr', style: 'cancel' },
          { text: 'Bəli', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      // event əlavə edirik
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      // cleanup
      return () => subscription.remove();
    }, []),
  );

  const handleContinue = async () => {
    if (name.trim() === '') {
      Alert.alert('Zəhmət olmasa adınızı daxil edin!');
      return;
    }

    try {
      // Adı AsyncStorage-a yazırıq
      await AsyncStorage.setItem('@username', name);
      console.log('Kullanıcı ismi asyncstorage-da saxlandı:', name);

      // Əgər savedNews daha əvvəl yoxdursa boş array yazırıq
      const savedNews = await AsyncStorage.getItem('@savedNews');
      if (!savedNews) {
        await AsyncStorage.setItem('@savedNews', JSON.stringify([]));
        console.log('Boş savedNews listi yaradıldı');
      }

      // Sonra HomeDrawer-a yönləndiririk
      navigation.navigate('HomeDrawer');
    } catch (error) {
      console.error('AsyncStorage-da yazmaq mümkün olmadı:', error);
      Alert.alert('Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/images/obamarket.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Salam, Hörmətli İstifadəçi</Text>
        <Text style={styles.subtitle}>Davam etmək üçün adınızı daxil edin</Text>

        <TextInput
          style={styles.input}
          placeholder="Adınızı daxil edin"
          placeholderTextColor={'#999'}
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Davam Et</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
