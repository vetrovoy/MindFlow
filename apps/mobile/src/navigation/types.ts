import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeTabParamList = {
  Inbox: undefined;
  Today: undefined;
  Lists: undefined;
};

export type SettingsTabParamList = {
  Search: undefined;
  Archive: undefined;
};

export type RootDrawerParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  Settings: NavigatorScreenParams<SettingsTabParamList>;
};
