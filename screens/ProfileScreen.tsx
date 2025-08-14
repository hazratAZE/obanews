import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NewsItem = {
  id: string;
  title: string;
  body: string;
};

type SavedNewsId = string[];

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

// Sadəcə saxlanan xəbərlərin id-ləri
const savedNewsIds: SavedNewsId = ['1', '2', '3'];

const ProfileScreen = () => {
  const [username, setUsername] = useState('Hörmətli İstifadəçi');
  const [inputName, setInputName] = useState(username);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  // AsyncStorage-dan istifadəçi adını oxu
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@username');
        if (storedName) {
          setUsername(storedName);
          setInputName(storedName);
        }
      } catch (e) {
        console.log('AsyncStorage-dan oxuma zamanı xəta:', e);
      }
    };
    loadUsername();
  }, []);

  // AsyncStorage və state-i yenilə
  const handleRefresh = async () => {
    if (inputName.trim() === '') {
      Alert.alert('Zəhmət olmasa adınızı daxil edin!');
      return;
    }
    try {
      setUsername(inputName);
      await AsyncStorage.setItem('@username', inputName);
      Alert.alert('İstifadəçi adı yeniləndi!');
    } catch (e) {
      console.log('AsyncStorage-a yazma zamanı xəta:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Çıxış edildi!');
  };

  // Saxlanan id-lər üzrə API-dən xəbərləri çək
  useEffect(() => {
    const fetchSavedNews = async () => {
      setLoading(true);
      try {
        const promises = savedNewsIds.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(res =>
            res.json(),
          ),
        );
        const results = await Promise.all(promises);
        setNewsList(results);
      } catch (e) {
        console.log('Xəbərlər yüklənmədi:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedNews();
  }, []);

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('NewsInner', { news: item })}
    >
      <Image
        source={{
          uri: 'https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg',
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.body ? (
          <Text style={styles.description} numberOfLines={3}>
            {item.body}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/usericon.png')}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={inputName}
        onChangeText={setInputName}
        placeholder="Adınızı daxil edin"
      />
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Adınızı Yeniləyin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Çıxış et</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.savedNewsHeader}>Saxlanan Xəbərlər</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#28a745"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={newsList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          style={styles.savedNewsList}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  textContainer: { padding: 12 },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 14,
  },
  input: {
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  logoutButton: { backgroundColor: '#dc3545' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  savedNewsHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    color: '#333',
  },
  savedNewsList: { flex: 1 },
  newsCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  newsText: { fontSize: 14, color: '#555' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  description: { fontSize: 14, color: '#555' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
});

export default ProfileScreen;
