// screens/NewsInnerScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsInner'>;

const NewsInnerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { news } = route.params; // HomeScreen-dən göndəriləcək news object

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: 'https://thumbs.dreamstime.com/b/news-woodn-dice-depicting-letters-bundle-small-newspapers-leaning-left-dice-34802664.jpg',
        }}
        style={styles.image}
      />

      <Text style={styles.title}>{news.title}</Text>
      {news.body ? <Text style={styles.body}>{news.body}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    padding: 12,
  },
  backText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '600',
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
