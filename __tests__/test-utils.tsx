import React from 'react';
import { render as rtlRender } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../components/ui/auth-context';
import { TabProvider } from '../components/ui/tab-context';
import { AlertProvider } from '../components/ui/alert-context';
import { ToasterProvider } from '../components/ui/toaster-context';

// Mock user for testing
export const mockUser = {
  id: '1',
  username: 'testuser',
  role: 'employee' as const,
  email: 'test@example.com',
};

export const mockAdminUser = {
  id: '2', 
  username: 'admin',
  role: 'admin' as const,
  email: 'admin@example.com',
};

// Custom render function with providers
interface CustomRenderOptions {
  navigationOptions?: any;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    navigationOptions = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NavigationContainer {...navigationOptions}>
        <AuthProvider>
          <TabProvider>
            <AlertProvider>
              <ToasterProvider>
                {children}
              </ToasterProvider>
            </AlertProvider>
          </TabProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library/react-native
export * from '@testing-library/react-native';

// Override render method
export { renderWithProviders as render };

// Common test utilities
export const waitFor = (callback: () => void, options?: { timeout?: number }) => {
  return new Promise((resolve) => {
    const timeout = options?.timeout || 1000;
    setTimeout(() => {
      callback();
      resolve(true);
    }, timeout);
  });
};

export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  setOptions: jest.fn(),
});

export const createMockRoute = (params = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

// Mock functions for common operations
export const mockAlert = {
  alert: jest.fn(),
};

export const mockHaptics = {
  impact: jest.fn(),
  notification: jest.fn(),
  selection: jest.fn(),
};

// Setup global mocks for tests
beforeEach(() => {
  jest.clearAllMocks();
});