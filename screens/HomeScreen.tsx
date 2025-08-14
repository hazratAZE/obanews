// screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type NewsItem = {
  id: string;
  title: string;
  description: string;
};

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Texnologiya xəbərləri',
    description: 'Yeni iPhone təqdim olundu və bazarda böyük maraq yaratdı.',
  },
  {
    id: '2',
    title: 'İdman xəbərləri',
    description: 'Azərbaycan millisindən möhtəşəm qələbə!',
  },
  {
    id: '3',
    title: 'İqtisadiyyat xəbərləri',
    description: 'Neft qiymətləri artmağa davam edir.',
  },
];

const HomeScreen = () => {
  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={newsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 16,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
