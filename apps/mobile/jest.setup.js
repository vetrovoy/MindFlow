require('react-native-gesture-handler/jestSetup');

jest.mock('@shared/lib/use-copy', () => {
  const { getCopy } = require('@mindflow/copy');

  return {
    useCopy: () => getCopy('ru'),
    useLanguage: () => ({
      language: 'ru',
      setLanguage: jest.fn(),
    }),
  };
});

jest.mock(
  'react-native-worklets',
  () => ({
    createSerializable: value => value,
  }),
  { virtual: true },
);

jest.mock('reanimated-color-picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  const ColorPickerContainer = ({ children }) =>
    React.createElement(View, { testID: 'rn-color-picker' }, children);
  const Swatches = () =>
    React.createElement(View, { testID: 'color-picker-swatches' });
  const Panel5 = () =>
    React.createElement(View, { testID: 'color-picker-panel5' });
  return { default: ColorPickerContainer, Swatches, Panel5, __esModule: true };
});

jest.mock('react-native-date-picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  const DatePickerMock = () =>
    React.createElement(View, { testID: 'date-picker-modal' });
  DatePickerMock.displayName = 'DatePicker';
  return { default: DatePickerMock, __esModule: true };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');

  const BottomSheetModal = React.forwardRef(({ children, onDismiss }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      present: () => {
        setIsVisible(true);
      },
      dismiss: () => {
        setIsVisible(false);
      },
      expand: () => {},
      collapse: () => {},
      close: () => {},
      forceClose: () => {},
      snapToIndex: () => {},
      snapToPosition: () => {},
    }));

    if (!isVisible) return null;
    return React.createElement(
      View,
      null,
      typeof children === 'function' ? children() : children,
    );
  });

  const BottomSheetModalProvider = ({ children }) => children;
  const BottomSheetView = ({ children, style }) =>
    React.createElement(View, { style }, children);
  const BottomSheetScrollView = React.forwardRef(
    ({ children, style, contentContainerStyle }, ref) =>
      React.createElement(
        View,
        { ref, style },
        typeof children === 'function' ? children() : children,
      ),
  );
  const BottomSheetBackdrop = () => null;

  return {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
    BottomSheetScrollView,
    BottomSheetBackdrop,
  };
});

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

jest.mock('@shopify/flash-list', () => {
  const React = require('react');
  const { FlatList } = require('react-native');

  return {
    FlashList: React.forwardRef((props, ref) => (
      <FlatList ref={ref} {...props} />
    )),
  };
});

jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList, View } = require('react-native');

  const DraggableFlatList = React.forwardRef((props, ref) =>
    React.createElement(FlatList, { ...props, ref }),
  );

  const ScaleDecorator = ({ children }) =>
    React.createElement(View, null, children);

  return {
    __esModule: true,
    default: DraggableFlatList,
    ScaleDecorator,
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createComponent = () =>
    React.forwardRef((props, ref) => <View ref={ref} {...props} />);

  return {
    __esModule: true,
    default: createComponent(),
    Svg: createComponent(),
    Path: createComponent(),
    Circle: createComponent(),
    Line: createComponent(),
    Polyline: createComponent(),
    Rect: createComponent(),
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createIcon = () =>
    React.forwardRef((props, ref) => <View ref={ref} {...props} />);

  return new Proxy(
    {},
    {
      get: (_, key) => {
        if (key === '__esModule') {
          return true;
        }

        return createIcon();
      },
    },
  );
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
  resolveThemeName: name => name || 'graphite',
  getTheme: name => ({
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

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'ru', countryCode: 'RU' }],
}));
