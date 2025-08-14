import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import { RootStackParamList, HomeDrawerParamList } from './types/navigation';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<HomeDrawerParamList>();
const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 40 }}
    >
      {/* Yuxarıda şəkil */}
      <View style={styles.header}>
        <Image
          source={require('./assets/images/obamarket.jpg')}
          style={styles.logo}
        />
      </View>

      {/* Drawer itemləri */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
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
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeDrawer"
            component={HomeDrawer}
            options={{ headerShown: false }} // Drawer öz header-ini göstərsin
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
