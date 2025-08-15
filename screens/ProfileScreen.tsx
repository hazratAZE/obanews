import React, { useState, useEffect, useContext } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Skeleton from '../components/Skeleton';
import { ThemeContext } from '../global/ThemeContext';

type NewsItem = {
  id: string;
  title: string;
  body: string;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

const ProfileScreen = () => {
  const [username, setUsername] = useState('Hörmətli İstifadəçi');
  const [inputName, setInputName] = useState(username);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'black';
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
  }, [savedNewsIds]);

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
    Alert.alert('Çıxış', 'Çıxış etmək istədiyinizə əminsinizmi?', [
      { text: 'Xeyr', style: 'cancel' },
      {
        text: 'Bəli',
        onPress: async () => {
          try {
            await AsyncStorage.clear(); // bütün storage təmizlə
            Alert.alert('Çıxış edildi!');
            navigation.navigate('Welcome'); // Welcome screen-ə yönləndir
          } catch (e) {
            console.log('Logout zamanı xəta:', e);
            Alert.alert('Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.');
          }
        },
      },
    ]);
  };

  // AsyncStorage-dan saxlanan xəbərlərin id-lərini və xəbərləri yüklə
  useFocusEffect(
    useCallback(() => {
      const fetchSavedNews = async () => {
        setLoading(true);
        try {
          const storedIds = await AsyncStorage.getItem('@savedNews');
          const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
          setSavedNewsIds(ids);

          if (ids.length === 0) {
            setNewsList([]);
            return;
          }

          const promises = ids.map(id =>
            fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
              res => res.json(),
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
    }, []),
  );
  // save / unsave funksiyası
  const toggleSaveNews = async (id: string) => {
    try {
      let updatedIds = [...savedNewsIds];
      if (updatedIds.includes(id)) {
        updatedIds = updatedIds.filter(savedId => savedId !== id);
      } else {
        updatedIds.push(id);
      }
      setSavedNewsIds(updatedIds);
      await AsyncStorage.setItem('@savedNews', JSON.stringify(updatedIds));
    } catch (e) {
      console.log('Xəbər yadda saxlanmadı:', e);
    }
  };
  const renderItem = ({ item }: { item: NewsItem }) => {
    const isSaved = savedNewsIds.includes(item.id.toString());

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: isDarkMode ? 'gray' : 'white' },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('NewsInner', { news: item })}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: 'https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg',
            }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text
              style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}
            >
              {item.title}
            </Text>
            {item.body ? (
              <Text
                style={[
                  styles.description,
                  { color: isDarkMode ? '#f5f5f5' : '#555' },
                ]}
                numberOfLines={3}
              >
                {item.body}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => toggleSaveNews(item.id.toString())}
        >
          <Image
            source={
              isSaved
                ? require('../assets/icons/saved.png') // əgər saxlanıbsa
                : require('../assets/icons/save.png') // əgər saxlanmayıbsa
            }
            style={styles.saveIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#171717' : '#f9f9f9' },
      ]}
    >
      <Image
        source={require('../assets/icons/usericon.png')}
        style={styles.icon}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? 'gray' : 'white',
            color: isDarkMode ? 'white' : 'black',
          },
        ]}
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

      <Text
        style={[
          styles.savedNewsHeader,
          { color: isDarkMode ? '#f5f5f5' : 'black' },
        ]}
      >
        Saxlanan Xəbərlər
      </Text>
      {loading ? (
        <View>
          <Skeleton
            width="100%"
            height={280}
            borderRadius={12}
            style={{ marginBottom: 16 }}
          />
          <Skeleton
            width="100%"
            height={280}
            borderRadius={12}
            style={{ marginBottom: 16 }}
          />
        </View>
      ) : newsList.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
            color: isDarkMode ? '#f5f5f5' : '#555',
          }}
        >
          Heç bir xəbər saxlanılmayıb.
        </Text>
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
  saveIcon: {
    width: 24,
    height: 24,
    tintColor: '#000', // rəngi dəyişmək istəsən burdan
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
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
    color: 'black',
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
