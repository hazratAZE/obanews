// screens/NewsInnerScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, NewsItem } from '../types/navigation';
import Skeleton from '../components/Skeleton';
import { ThemeContext } from '../global/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsInner'>;

const NewsInnerScreen: React.FC<Props> = ({ route }) => {
  const { news } = route.params; // HomeScreen-dən göndərilən news objesi
  const [newsDetail, setNewsDetail] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'black';
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${news.id}`,
        );
        const data = await response.json();
        console.log(data);
        setNewsDetail(data);
      } catch (error) {
        console.error('Xəbər detayı yüklənmədi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [news.id]);

  if (loading) {
    return (
      <View>
        <Skeleton
          width="100%"
          height={180}
          borderRadius={12}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          width="100%"
          height={20}
          borderRadius={12}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          width="100%"
          height={20}
          borderRadius={12}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          width="100%"
          height={16}
          borderRadius={12}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          width="100%"
          height={16}
          borderRadius={12}
          style={{ marginBottom: 16 }}
        />
      </View>
    );
  }

  if (!newsDetail) {
    return (
      <View style={styles.loader}>
        <Text>Xəbər tapılmadı!</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#171717' : '#f9f9f9' },
      ]}
    >
      <Image
        source={{
          uri: 'https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg',
        }}
        style={styles.image}
      />
      <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
        {newsDetail.title}
      </Text>
      <Text
        style={[styles.body, { color: isDarkMode ? '#f5f5f5' : '#555' }]}
        numberOfLines={3}
      >
        {newsDetail.body}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    padding: 12,
    paddingBottom: 6,
  },
  body: {
    fontSize: 16,
    color: '#555',
    padding: 12,
    lineHeight: 22,
  },
});

export default NewsInnerScreen;
