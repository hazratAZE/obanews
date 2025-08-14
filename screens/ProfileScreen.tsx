import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  FlatList,
} from 'react-native';

type SavedNews = {
  id: string;
  title: string;
};

// Daha çox fake saxlanan xəbər əlavə etdik
const savedNewsData: SavedNews[] = [
  { id: '1', title: 'Texnologiya: Yeni iPhone təqdim olundu' },
  { id: '2', title: 'İdman: Azərbaycan millisindən möhtəşəm qələbə!' },
  { id: '3', title: 'İqtisadiyyat: Neft qiymətləri artmağa davam edir' },
  { id: '4', title: 'Elm: Kosmosda yeni planet aşkarlandı' },
  { id: '5', title: 'Mədəniyyət: Yeni film festivali başladı' },
  { id: '6', title: 'Səyahət: Avropa üçün ən yaxşı məkanlar' },
  { id: '7', title: 'Sağlamlıq: Yeni diyet trendi populyar oldu' },
  { id: '8', title: 'Texnologiya: Tesla yeni model təqdim etdi' },
  { id: '9', title: 'İdman: Futbol çempionatında sürpriz nəticə' },
  { id: '10', title: 'İqtisadiyyat: Dollar məzənnəsi dəyişdi' },
];

const ProfileScreen = () => {
  const [username, setUsername] = useState('Hörmətli İstifadəçi');
  const [inputName, setInputName] = useState(username);

  const handleRefresh = () => {
    if (inputName.trim() === '') {
      Alert.alert('Zəhmət olmasa adınızı daxil edin!');
      return;
    }
    setUsername(inputName);
    Alert.alert('İstifadəçi adı yeniləndi!');
  };

  const handleLogout = () => {
    Alert.alert('Çıxış edildi!');
    // Burada drawer-ı bağlamaq və ya stack-ə yönləndirmək olar
  };

  const renderSavedNews = ({ item }: { item: SavedNews }) => (
    <View style={styles.newsCard}>
      <Text style={styles.newsText}>• {item.title}</Text>
    </View>
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
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.buttonText}>Adınızı Yeniləyin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Çıxış et</Text>
      </TouchableOpacity>

      {/* Saxlanan Xəbərlər Başlığı */}
      <Text style={styles.savedNewsHeader}>Saxlanan Xəbərlər</Text>
      <FlatList
        data={savedNewsData}
        keyExtractor={item => item.id}
        renderItem={renderSavedNews}
        style={styles.savedNewsList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
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
  button: {
    width: '80%',
    alignSelf: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#28a745',
    alignItems: 'center',
    marginVertical: 6,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  savedNewsHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    color: '#333',
  },
  savedNewsList: {
    flex: 1, // daha çox xəbər göstərmək üçün hündürlük
  },
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
  newsText: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProfileScreen;
