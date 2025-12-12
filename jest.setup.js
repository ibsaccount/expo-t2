// Extend the default timeout for async operations
jest.setTimeout(10000);

// Mock React Native platform first
jest.mock('react-native', () => {
  const React = require('react');
  
  // Mock Text component that preserves props for testing
  const Text = React.forwardRef((props, ref) => {
    const element = React.createElement('span', { 
      ...props, 
      ref,
      'data-testid': 'text-element'
    }, props.children);
    
    // Preserve props for testing
    element.props = { ...props };
    return element;
  });
  
  // Mock View component that preserves props for testing
  const View = React.forwardRef((props, ref) => {
    const element = React.createElement('div', { 
      ...props, 
      ref,
      'data-testid': 'view-element'
    }, props.children);
    
    // Preserve props for testing
    element.props = { ...props };
    return element;
  });
  
  // Mock Pressable component
  const Pressable = React.forwardRef((props, ref) => {
    const element = React.createElement('div', { 
      ...props, 
      ref,
      onClick: props.onPress,
      'data-testid': 'pressable-element'
    }, props.children);
    
    element.props = { ...props };
    return element;
  });
  
  // Mock ScrollView component
  const ScrollView = React.forwardRef((props, ref) => {
    const element = React.createElement('div', { 
      ...props, 
      ref,
      'data-testid': 'scrollview-element'
    }, props.children);
    
    element.props = { ...props };
    return element;
  });

  return {
    Platform: {
      OS: 'ios',
      Version: '16.0',
      select: (platforms) => {
        if (platforms.ios) return platforms.ios;
        if (platforms.default) return platforms.default;
        return platforms.web || platforms.android || null;
      },
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => styles,
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    StatusBar: {
      setBarStyle: jest.fn(),
    },
    useColorScheme: jest.fn(() => 'light'),
    Animated: {
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        interpolate: jest.fn(() => ({
          setValue: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      })),
      timing: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      sequence: jest.fn((animations) => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      parallel: jest.fn((animations) => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      loop: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      delay: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
      })),
    },
    Modal: React.forwardRef((props, ref) => {
      const element = React.createElement('div', { 
        ...props, 
        ref,
        style: { display: props.visible ? 'block' : 'none' },
        'data-testid': 'modal-element'
      }, props.children);
      
      element.props = { ...props };
      return element;
    }),
    TextInput: React.forwardRef((props, ref) => {
      const element = React.createElement('input', { 
        ...props, 
        ref,
        type: 'text',
        'data-testid': 'text-input-element'
      }, props.children);
      
      element.props = { ...props };
      return element;
    }),
    Text,
    View,
    Pressable,
    ScrollView,
    SafeAreaView: View,
    TouchableOpacity: Pressable,
    FlatList: View,
    Image: View,
    KeyboardAvoidingView: View,
    TouchableOpacity: React.forwardRef((props, ref) => {
      const element = React.createElement('div', { 
        ...props, 
        ref,
        onClick: props.onPress,
        'data-testid': 'touchable-opacity-element'
      }, props.children);
      
      element.props = { ...props };
      return element;
    }),
  };
});

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    executionEnvironment: 'development',
    manifest: {},
    platform: {
      ios: {
        platform: 'ios',
      },
      android: {
        platform: 'android',
      },
    },
  },
  executionEnvironment: 'development',
}));

jest.mock('expo-haptics', () => ({
  impact: jest.fn(),
  notification: jest.fn(),
  selection: jest.fn(),
  ImpactFeedbackStyle: {
    Heavy: 'heavy',
    Light: 'light',
    Medium: 'medium',
  },
  NotificationFeedbackType: {
    Error: 'error',
    Success: 'success',
    Warning: 'warning',
  },
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    setParams: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
  })),
  useRoute: jest.fn(() => ({
    key: 'test',
    name: 'Test',
    params: {},
  })),
  useFocusEffect: jest.fn((callback) => callback()),
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(() => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  })),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  })),
}));

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  Feather: 'Feather',
}));

// Global test utilities
global.__DEV__ = true;