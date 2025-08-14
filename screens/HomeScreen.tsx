import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Skeleton from '../components/Skeleton';
import { BackHandler, Alert } from 'react-native';
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeDrawer'
>;
type NewsItem = {
  id: string;
  title: string;
  body: string;
};

const BATCH_SIZE = 10;

const HomeScreen = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [visibleNews, setVisibleNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // xəbərləri yüklə
  useFocusEffect(
    useCallback(() => {
      const fetchNews = async () => {
        try {
          const response = await fetch(
            'https://jsonplaceholder.typicode.com/posts',
          );
          const data = await response.json();
          setAllNews(data);
          setVisibleNews(data.slice(0, BATCH_SIZE));
        } catch (error) {
          console.error('Xəbərlər yüklənmədi:', error);
        } finally {
          setLoading(false);
        }
      };

      const loadSavedNews = async () => {
        try {
          const storedIds = await AsyncStorage.getItem('@savedNews');
          if (storedIds) {
            setSavedNewsIds(JSON.parse(storedIds));
          }
        } catch (e) {
          console.log('AsyncStorage-dan savedNews oxunmadı:', e);
        }
      };

      fetchNews();
      loadSavedNews();
    }, []),
  );
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
  // daha çox xəbər yüklə
  const loadMore = () => {
    const currentLength = visibleNews.length;
    const nextBatch = allNews.slice(currentLength, currentLength + BATCH_SIZE);
    setVisibleNews(prev => [...prev, ...nextBatch]);
  };

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

  // hər xəbər üçün kart
  const renderItem = ({ item }: { item: NewsItem }) => {
    const isSaved = savedNewsIds.includes(item.id.toString());

    return (
      <View style={styles.card}>
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
            <Text style={styles.title}>{item.title}</Text>
            {item.body ? (
              <Text style={styles.description} numberOfLines={3}>
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

  if (loading) {
    return (
      <View style={{ padding: 16 }}>
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
        <Skeleton
          width="100%"
          height={280}
          borderRadius={12}
          style={{ marginBottom: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleNews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  saveIcon: {
    width: 24,
    height: 24,
    tintColor: '#000', // rəngi dəyişmək istəsən burdan
  },

  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
