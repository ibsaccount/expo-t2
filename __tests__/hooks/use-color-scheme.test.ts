import { useColorScheme } from '../../hooks/use-color-scheme';

// Mock react-native useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

describe('useColorScheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export useColorScheme from react-native', () => {
    // The function should exist and be the same as React Native's
    expect(useColorScheme).toBeDefined();
    expect(typeof useColorScheme).toBe('function');
  });

  it('should return the same value as react-native useColorScheme', () => {
    const mockReactNative = jest.requireMock('react-native');
    
    // Mock return value
    mockReactNative.useColorScheme.mockReturnValue('dark');
    
    // Test that our export works
    const result = useColorScheme();
    expect(result).toBe('dark');
    expect(mockReactNative.useColorScheme).toHaveBeenCalled();
  });

  it('should handle light mode return', () => {
    const mockReactNative = jest.requireMock('react-native');
    
    mockReactNative.useColorScheme.mockReturnValue('light');
    
    const result = useColorScheme();
    expect(result).toBe('light');
  });

  it('should handle null return', () => {
    const mockReactNative = jest.requireMock('react-native');
    
    mockReactNative.useColorScheme.mockReturnValue(null);
    
    const result = useColorScheme();
    expect(result).toBe(null);
  });

  it('should be identical to react-native useColorScheme', () => {
    const mockReactNative = jest.requireMock('react-native');
    
    // Our re-exported hook should be exactly the same function
    expect(useColorScheme).toBe(mockReactNative.useColorScheme);
  });
});