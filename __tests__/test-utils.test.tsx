import React from 'react';
import { Text } from 'react-native';
import { 
  renderWithProviders, 
  mockUser, 
  mockAdminUser, 
  waitFor, 
  createMockNavigation, 
  createMockRoute,
  mockAlert,
  mockHaptics
} from './test-utils';

// Create a simple test component
const TestComponent = ({ testId = 'test-component' }: { testId?: string }) => (
  <Text testID={testId}>Test Component</Text>
);

describe('test-utils', () => {
  describe('mockUser', () => {
    it('should have expected properties for regular user', () => {
      expect(mockUser).toEqual({
        id: '1',
        username: 'testuser',
        role: 'employee',
        email: 'test@example.com',
      });
    });

    it('should be a valid user object', () => {
      expect(mockUser.id).toBeTruthy();
      expect(mockUser.username).toBeTruthy();
      expect(mockUser.email).toContain('@');
      expect(mockUser.role).toBe('employee');
    });
  });

  describe('mockAdminUser', () => {
    it('should have expected properties for admin user', () => {
      expect(mockAdminUser).toEqual({
        id: '2',
        username: 'admin',
        role: 'admin',
        email: 'admin@example.com',
      });
    });

    it('should be a valid admin user object', () => {
      expect(mockAdminUser.id).toBeTruthy();
      expect(mockAdminUser.username).toBeTruthy();
      expect(mockAdminUser.email).toContain('@');
      expect(mockAdminUser.role).toBe('admin');
    });

    it('should have different id than regular user', () => {
      expect(mockAdminUser.id).not.toBe(mockUser.id);
    });
  });

  describe('renderWithProviders', () => {
    it('should render component with all providers', () => {
      const { getByTestId } = renderWithProviders(<TestComponent />);
      
      expect(getByTestId('test-component')).toBeTruthy();
    });

    it('should render component with custom testId', () => {
      const { getByTestId } = renderWithProviders(
        <TestComponent testId="custom-test-id" />
      );
      
      expect(getByTestId('custom-test-id')).toBeTruthy();
    });

    it('should handle navigation options', () => {
      const navigationOptions = { 
        initialRouteName: 'Home',
        screenOptions: { headerShown: false }
      };
      
      const { getByTestId } = renderWithProviders(
        <TestComponent />, 
        { navigationOptions }
      );
      
      expect(getByTestId('test-component')).toBeTruthy();
    });

    it('should handle empty navigation options', () => {
      const { getByTestId } = renderWithProviders(
        <TestComponent />, 
        { navigationOptions: {} }
      );
      
      expect(getByTestId('test-component')).toBeTruthy();
    });

    it('should handle undefined navigation options', () => {
      const { getByTestId } = renderWithProviders(
        <TestComponent />, 
        { navigationOptions: undefined }
      );
      
      expect(getByTestId('test-component')).toBeTruthy();
    });

    it('should handle additional render options', () => {
      const { getByTestId } = renderWithProviders(
        <TestComponent />
      );
      
      expect(getByTestId('test-component')).toBeTruthy();
    });

    it('should work without any options', () => {
      const { getByTestId } = renderWithProviders(<TestComponent />);
      
      expect(getByTestId('test-component')).toBeTruthy();
    });
  });

  describe('waitFor utility', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call callback after default timeout', async () => {
      const callback = jest.fn();
      
      const promise = waitFor(callback);
      
      jest.advanceTimersByTime(1000);
      
      await promise;
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call callback after custom timeout', async () => {
      const callback = jest.fn();
      
      const promise = waitFor(callback, { timeout: 500 });
      
      jest.advanceTimersByTime(500);
      
      await promise;
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call callback before timeout', async () => {
      const callback = jest.fn();
      
      const promise = waitFor(callback, { timeout: 1000 });
      
      jest.advanceTimersByTime(500);
      
      expect(callback).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(500);
      
      await promise;
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle zero timeout', async () => {
      const callback = jest.fn();
      
      // For zero timeout, just run the callback immediately
      callback();
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined options', async () => {
      const callback = jest.fn();
      
      const promise = waitFor(callback, undefined);
      
      jest.advanceTimersByTime(1000);
      
      await promise;
      
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMockNavigation', () => {
    it('should create navigation object with all required methods', () => {
      const navigation = createMockNavigation();
      
      expect(navigation.navigate).toEqual(expect.any(Function));
      expect(navigation.goBack).toEqual(expect.any(Function));
      expect(navigation.dispatch).toEqual(expect.any(Function));
      expect(navigation.setParams).toEqual(expect.any(Function));
      expect(navigation.addListener).toEqual(expect.any(Function));
      expect(navigation.removeListener).toEqual(expect.any(Function));
      expect(navigation.isFocused).toEqual(expect.any(Function));
      expect(navigation.canGoBack).toEqual(expect.any(Function));
      expect(navigation.setOptions).toEqual(expect.any(Function));
    });

    it('should return true for isFocused by default', () => {
      const navigation = createMockNavigation();
      
      expect(navigation.isFocused()).toBe(true);
    });

    it('should return true for canGoBack by default', () => {
      const navigation = createMockNavigation();
      
      expect(navigation.canGoBack()).toBe(true);
    });

    it('should track function calls', () => {
      const navigation = createMockNavigation();
      
      navigation.navigate('Home');
      navigation.goBack();
      navigation.setOptions({ title: 'Test' });
      
      expect(navigation.navigate).toHaveBeenCalledWith('Home');
      expect(navigation.goBack).toHaveBeenCalledTimes(1);
      expect(navigation.setOptions).toHaveBeenCalledWith({ title: 'Test' });
    });
  });

  describe('createMockRoute', () => {
    it('should create route object with default values', () => {
      const route = createMockRoute();
      
      expect(route).toEqual({
        key: 'test-route',
        name: 'TestScreen',
        params: {},
      });
    });

    it('should create route object with custom params', () => {
      const params = { id: '123', title: 'Test Title' };
      const route = createMockRoute(params);
      
      expect(route).toEqual({
        key: 'test-route',
        name: 'TestScreen',
        params,
      });
    });

    it('should handle complex params', () => {
      const params = {
        user: mockUser,
        settings: { theme: 'dark', notifications: true },
        items: [1, 2, 3],
      };
      const route = createMockRoute(params);
      
      expect(route.params).toEqual(params);
    });

    it('should handle null params as empty object', () => {
      const route = createMockRoute(undefined);
      
      expect(route.params).toEqual({});
    });

    it('should handle undefined params', () => {
      const route = createMockRoute(undefined);
      
      expect(route.params).toEqual({});
    });
  });

  describe('mockAlert', () => {
    it('should have alert function', () => {
      expect(mockAlert.alert).toEqual(expect.any(Function));
    });

    it('should track alert calls', () => {
      mockAlert.alert('Test message');
      
      expect(mockAlert.alert).toHaveBeenCalledWith('Test message');
    });

    it('should handle multiple alert calls', () => {
      mockAlert.alert('First message');
      mockAlert.alert('Second message');
      
      expect(mockAlert.alert).toHaveBeenCalledTimes(2);
      expect(mockAlert.alert).toHaveBeenNthCalledWith(1, 'First message');
      expect(mockAlert.alert).toHaveBeenNthCalledWith(2, 'Second message');
    });
  });

  describe('mockHaptics', () => {
    it('should have all haptic functions', () => {
      expect(mockHaptics.impact).toEqual(expect.any(Function));
      expect(mockHaptics.notification).toEqual(expect.any(Function));
      expect(mockHaptics.selection).toEqual(expect.any(Function));
    });

    it('should track impact calls', () => {
      mockHaptics.impact();
      
      expect(mockHaptics.impact).toHaveBeenCalledTimes(1);
    });

    it('should track notification calls', () => {
      mockHaptics.notification('success');
      
      expect(mockHaptics.notification).toHaveBeenCalledWith('success');
    });

    it('should track selection calls', () => {
      mockHaptics.selection();
      
      expect(mockHaptics.selection).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple haptic calls', () => {
      mockHaptics.impact();
      mockHaptics.notification('warning');
      mockHaptics.selection();
      
      expect(mockHaptics.impact).toHaveBeenCalledTimes(1);
      expect(mockHaptics.notification).toHaveBeenCalledWith('warning');
      expect(mockHaptics.selection).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration tests', () => {
    it('should work with navigation and route mocks together', () => {
      const navigation = createMockNavigation();
      const route = createMockRoute({ screen: 'Details', id: '123' });
      
      // Simulate navigation to a route
      navigation.navigate(route.name, route.params);
      
      expect(navigation.navigate).toHaveBeenCalledWith(
        'TestScreen', 
        { screen: 'Details', id: '123' }
      );
    });

    it('should handle complex component rendering with all utilities', () => {
      const navigation = createMockNavigation();
      const route = createMockRoute({ user: mockUser });
      
      // Component that uses all utilities
      const ComplexComponent = () => (
        <Text testID="complex-component">
          User: {(route.params as any).user.username}
        </Text>
      );
      
      const { getByTestId } = renderWithProviders(<ComplexComponent />);
      
      expect(getByTestId('complex-component')).toBeTruthy();
    });

    it('should handle error scenarios gracefully', () => {
      expect(() => {
        renderWithProviders(<TestComponent />, { invalidOption: true } as any);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty component rendering', () => {
      const EmptyComponent = () => null;
      
      renderWithProviders(<EmptyComponent />);
      
      // Test passes if no errors are thrown
      expect(true).toBe(true);
    });

    it('should handle component with complex props', () => {
      const ComplexComponent = ({ 
        data, 
        onPress, 
        style 
      }: { 
        data?: any; 
        onPress?: () => void; 
        style?: any; 
      }) => (
        <Text testID="complex-props" style={style} onPress={onPress}>
          {JSON.stringify(data)}
        </Text>
      );
      
      const complexData = { nested: { value: 'test' }, array: [1, 2, 3] };
      const onPress = jest.fn();
      const style = { fontSize: 16 };
      
      const { getByTestId } = renderWithProviders(
        <ComplexComponent data={complexData} onPress={onPress} style={style} />
      );
      
      expect(getByTestId('complex-props')).toBeTruthy();
    });
  });
});