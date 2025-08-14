import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import NewsInnerScreen from './screens/NewsInnerScreen';
import { RootStackParamList, HomeDrawerParamList } from './types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<HomeDrawerParamList>();

const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView
    {...props}
    contentContainerStyle={{ paddingTop: 40 }}
  >
    <View style={styles.header}>
      <Image
        source={require('./assets/images/obamarket.jpg')}
        style={styles.logo}
      />
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

// Drawer navigator yalnız HomeScreen üçün
const HomeDrawer = () => (
  <Drawer.Navigator
    screenOptions={{ headerShown: true }}
    drawerContent={props => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Son Xəbərlər' }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profil' }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Ayarlar' }}
    />
  </Drawer.Navigator>
);

const App = () => {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('@username');
        if (username && username.trim() !== '') {
          setInitialRoute('HomeDrawer');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (e) {
        console.log('AsyncStorage oxuma zamanı xəta:', e);
        setInitialRoute('Welcome');
      }
    };
    checkUsername();
  }, []);

  if (initialRoute === null) {
    // Loader ekranı
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
        }}
      >
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeDrawer"
            component={HomeDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewsInner"
            component={NewsInnerScreen}
            options={{ title: 'Xəbər' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default App;
