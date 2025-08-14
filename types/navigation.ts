export type NewsItem = {
  id: string;
  title: string;
  body: string;
};
export type RootStackParamList = {
  Welcome: undefined;
  HomeDrawer: undefined; // Drawer navigator burada stack-in içində
  NewsInner: { news: NewsItem }; // Drawer navigator burada stack-in içində
};

export type HomeDrawerParamList = {
  Home: undefined; // Drawer içindəki ekranlar
  Profile: undefined;
  Settings: undefined;
};
