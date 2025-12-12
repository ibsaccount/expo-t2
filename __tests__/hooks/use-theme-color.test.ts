import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { Colors } from '../../constants/theme';

// Mock useColorScheme
jest.mock('../../hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

const mockUseColorScheme = require('../../hooks/use-color-scheme').useColorScheme;

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return light color when color scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.light.text);
  });

  it('should return dark color when color scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.dark.text);
  });

  it('should return light color when color scheme is null and default to light', () => {
    mockUseColorScheme.mockReturnValue(null);
    
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.light.text);
  });

  it('should return prop light color when provided and color scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');
    const customLightColor = '#FF0000';
    
    const { result } = renderHook(() => 
      useThemeColor({ light: customLightColor }, 'text')
    );
    
    expect(result.current).toBe(customLightColor);
  });

  it('should return prop dark color when provided and color scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const customDarkColor = '#00FF00';
    
    const { result } = renderHook(() => 
      useThemeColor({ dark: customDarkColor }, 'text')
    );
    
    expect(result.current).toBe(customDarkColor);
  });

  it('should return theme color when prop color is not provided for the current scheme', () => {
    mockUseColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => 
      useThemeColor({ light: '#FF0000' }, 'text') // Only light color provided
    );
    
    expect(result.current).toBe(Colors.dark.text); // Should use theme dark color
  });

  it('should work with different color names', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    const { result: backgroundResult } = renderHook(() => 
      useThemeColor({}, 'background')
    );
    const { result: tintResult } = renderHook(() => 
      useThemeColor({}, 'tint')
    );
    const { result: iconResult } = renderHook(() => 
      useThemeColor({}, 'icon')
    );
    
    expect(backgroundResult.current).toBe(Colors.light.background);
    expect(tintResult.current).toBe(Colors.light.tint);
    expect(iconResult.current).toBe(Colors.light.icon);
  });

  it('should handle color scheme switching', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(result.current).toBe(Colors.light.text);
    
    // Switch to dark mode
    mockUseColorScheme.mockReturnValue('dark');
    
    // Re-render with new color scheme
    const { result: darkResult } = renderHook(() => useThemeColor({}, 'text'));
    
    expect(darkResult.current).toBe(Colors.dark.text);
  });

  it('should prioritize props over theme colors', () => {
    mockUseColorScheme.mockReturnValue('light');
    const customLightColor = '#CUSTOM';
    const customDarkColor = '#CUSTOM_DARK';
    
    const { result } = renderHook(() => 
      useThemeColor({ 
        light: customLightColor, 
        dark: customDarkColor 
      }, 'text')
    );
    
    expect(result.current).toBe(customLightColor);
    
    // Switch to dark
    mockUseColorScheme.mockReturnValue('dark');
    const { result: darkResult } = renderHook(() => 
      useThemeColor({ 
        light: customLightColor, 
        dark: customDarkColor 
      }, 'text')
    );
    
    expect(darkResult.current).toBe(customDarkColor);
  });
});