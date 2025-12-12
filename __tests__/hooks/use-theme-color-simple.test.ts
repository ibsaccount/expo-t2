import { Colors } from '../../constants/theme';

// Mock useColorScheme for testing
const mockUseColorScheme = jest.fn();

// Mock the hook module
jest.mock('../../hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

// Import after mocking
import { useThemeColor } from '../../hooks/use-theme-color';

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return light color when color scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    const result = useThemeColor({}, 'text');
    
    expect(result).toBe(Colors.light.text);
  });

  it('should return dark color when color scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    
    const result = useThemeColor({}, 'text');
    
    expect(result).toBe(Colors.dark.text);
  });

  it('should return light color when color scheme is null (defaults to light)', () => {
    mockUseColorScheme.mockReturnValue(null);
    
    const result = useThemeColor({}, 'text');
    
    expect(result).toBe(Colors.light.text);
  });

  it('should return custom light color when provided', () => {
    mockUseColorScheme.mockReturnValue('light');
    const customLightColor = '#FF0000';
    
    const result = useThemeColor({ light: customLightColor }, 'text');
    
    expect(result).toBe(customLightColor);
  });

  it('should return custom dark color when provided', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const customDarkColor = '#00FF00';
    
    const result = useThemeColor({ dark: customDarkColor }, 'text');
    
    expect(result).toBe(customDarkColor);
  });

  it('should work with different color names', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    expect(useThemeColor({}, 'background')).toBe(Colors.light.background);
    expect(useThemeColor({}, 'tint')).toBe(Colors.light.tint);
    expect(useThemeColor({}, 'icon')).toBe(Colors.light.icon);
  });

  it('should prioritize props over theme colors', () => {
    mockUseColorScheme.mockReturnValue('light');
    const customLightColor = '#CUSTOM';
    
    const result = useThemeColor({ light: customLightColor }, 'text');
    
    expect(result).toBe(customLightColor);
    expect(result).not.toBe(Colors.light.text);
  });
});