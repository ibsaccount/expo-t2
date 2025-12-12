import React from 'react';
import { render } from '../test-utils';
import { ThemedText } from '../../components/themed-text';

// Mock useThemeColor hook
const mockUseThemeColor = jest.fn();
jest.mock('../../hooks/use-theme-color', () => ({
  useThemeColor: (props: any, colorKey: string) => mockUseThemeColor(props, colorKey),
}));

describe('ThemedText', () => {
  beforeEach(() => {
    mockUseThemeColor.mockReset();
    mockUseThemeColor.mockReturnValue('#000000'); // default mock color
  });

  it('should render text content', () => {
    const { getByTestId } = render(
      <ThemedText testID="themed-text">Hello World</ThemedText>
    );
    
    const element = getByTestId('themed-text');
    expect(element).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({ light: undefined, dark: undefined }, 'text');
  });

  it('should call useThemeColor with custom light and dark colors', () => {
    render(
      <ThemedText lightColor="#FFFFFF" darkColor="#000000" testID="custom-text">
        Custom Colored Text
      </ThemedText>
    );
    
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#FFFFFF', dark: '#000000' },
      'text'
    );
  });

  it('should render different text types', () => {
    const textTypes = ['default', 'title', 'defaultSemiBold', 'subtitle', 'link'] as const;
    
    textTypes.forEach(type => {
      const { getByTestId } = render(
        <ThemedText type={type} testID={`${type}-text`}>{type} Text</ThemedText>
      );
      
      const element = getByTestId(`${type}-text`);
      expect(element).toBeTruthy();
    });
  });

  it('should apply theme color from useThemeColor hook', () => {
    const mockColor = '#FF5722';
    mockUseThemeColor.mockReturnValue(mockColor);
    
    const { getByTestId } = render(
      <ThemedText testID="colored-text">Colored Text</ThemedText>
    );
    
    const element = getByTestId('colored-text');
    expect(element).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({ light: undefined, dark: undefined }, 'text');
  });

  it('should handle additional props', () => {
    const { getByTestId } = render(
      <ThemedText 
        testID="themed-text"
        accessibilityLabel="Test text"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        Text with props
      </ThemedText>
    );
    
    const element = getByTestId('themed-text');
    expect(element).toBeTruthy();
  });

  it('should render with custom style props', () => {
    const customStyle = { fontSize: 20, fontWeight: 'bold' as const };
    
    const { getByTestId } = render(
      <ThemedText style={customStyle} testID="styled-text">Styled Text</ThemedText>
    );
    
    const element = getByTestId('styled-text');
    expect(element).toBeTruthy();
  });
});