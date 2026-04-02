require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  enableFreeze: jest.fn(),
  screensEnabled: jest.fn(() => true),
  Screen: 'Screen',
  ScreenContainer: 'ScreenContainer',
}));

jest.mock('react-native-mmkv', () => {
  const store = new Map();
  const createStorage = () => ({
    getString: key => (store.has(key) ? store.get(key) : undefined),
    set: (key, value) => {
      store.set(key, value);
    },
    delete: key => {
      store.delete(key);
    },
  });

  return {
    MMKV: jest.fn().mockImplementation(createStorage),
    createMMKV: jest.fn(createStorage),
  };
});

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({
    executeSync: jest.fn(),
    execute: jest.fn(async () => ({ rows: [] })),
    transaction: jest.fn(async work => {
      await work({});
    }),
    close: jest.fn(),
  })),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }) => children,
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const createBottomTabNavigator = () => {
    const Navigator = ({ children }) => children;
    const Screen = () => null;
    return { Navigator, Screen };
  };
  return { createBottomTabNavigator };
});

jest.mock('@react-navigation/native-stack', () => {
  const createNativeStackNavigator = () => {
    const Navigator = ({ children }) => children;
    const Screen = () => null;
    return { Navigator, Screen };
  };
  return { createNativeStackNavigator };
});

jest.mock('@mindflow/ui', () => ({
  typography: {
    fontSize: {
      display: 32,
      section: 24,
      title: 18,
      emphasis: 16,
      task: 16,
      body: 14,
      supportive: 13,
      badge: 11,
      meta: 12,
    },
  },
  getFeedbackCardRole: () => 'status',
  getProgressValue: ({ value, max }) => (max > 0 ? value / max : 0),
  resolveThemeName: (name) => name || 'graphite',
  getTheme: (name) => ({
    name: name || 'graphite',
    colors: {
      background: '#FFFFFF',
      surface: '#F5F5F5',
      surfaceCard: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      surfaceGlass: '#FFFFFF',
      surfaceInteractive: '#E0E0E0',
      textPrimary: '#1A1A1A',
      textSecondary: '#6B6B6B',
      textSoft: '#8C8C8C',
      textTertiary: '#B0B0B0',
      borderSoft: '#E5E5E5',
      borderMuted: '#D0D0D0',
      borderMedium: '#C0C0C0',
      borderStrong: '#A0A0A0',
      accentPrimary: '#007AFF',
      accentPrimaryPanelBorder: '#0056B3',
      accentAlert: '#FF3B30',
      accentInfo: '#007AFF',
      accentSuccess: '#34C759',
      accentSuccessDeep: '#248A3D',
      overlayGhost: '#F0F0F0',
      overlayScrim: 'rgba(0, 0, 0, 0.5)',
      overlayHandle: '#D0D0D0',
      shadowCard: 'rgba(0, 0, 0, 0.1)',
    },
  }),
}));

jest.mock('@shared/theme/use-theme', () => ({
  useTheme: () => ({
    theme: {
      name: 'graphite',
      colors: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        surfaceCard: '#FFFFFF',
        surfaceElevated: '#FFFFFF',
        surfaceGlass: '#FFFFFF',
        surfaceInteractive: '#E0E0E0',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B6B6B',
        textSoft: '#8C8C8C',
        textTertiary: '#B0B0B0',
        borderSoft: '#E5E5E5',
        borderMuted: '#D0D0D0',
        borderMedium: '#C0C0C0',
        borderStrong: '#A0A0A0',
        accentPrimary: '#007AFF',
        accentPrimaryPanelBorder: '#0056B3',
        accentAlert: '#FF3B30',
        accentInfo: '#007AFF',
        accentSuccess: '#34C759',
        accentSuccessDeep: '#248A3D',
        overlayGhost: '#F0F0F0',
        overlayScrim: 'rgba(0, 0, 0, 0.5)',
        overlayHandle: '#D0D0D0',
        shadowCard: 'rgba(0, 0, 0, 0.1)',
      },
    },
    themeName: 'graphite',
    setTheme: jest.fn(),
  }),
}));
