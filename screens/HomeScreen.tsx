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
  const navigation = useNavigation<HomeScreenNavigationProp>();
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts',
        );
        const data = await response.json();
        setAllNews(data);
        setVisibleNews(data.slice(0, BATCH_SIZE)); // ilk batch
      } catch (error) {
        console.error('Xəbərlər yüklənmədi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const loadMore = () => {
    const currentLength = visibleNews.length;
    const nextBatch = allNews.slice(currentLength, currentLength + BATCH_SIZE);
    setVisibleNews(prev => [...prev, ...nextBatch]);
  };

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Xəbərlər yüklənir...</Text>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
