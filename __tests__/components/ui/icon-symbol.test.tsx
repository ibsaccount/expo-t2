import React from 'react';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '../../../components/ui/icon-symbol';

// Mock MaterialIcons from @expo/vector-icons
jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const React = require('react');
  return React.forwardRef(function MockMaterialIcons(props: any, ref: any) {
    return React.createElement('MaterialIcons', {
      ...props,
      ref,
      testID: 'material-icons',
    });
  });
});

describe('IconSymbol', () => {
  it('should render MaterialIcons with mapped icon name', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="house.fill"
        size={24}
        color="red"
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon).toBeTruthy();
    expect(icon.props.name).toBe('home');
    expect(icon.props.size).toBe(24);
    expect(icon.props.color).toBe('red');
  });

  it('should render with default size when not specified', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="paperplane.fill"
        color="blue"
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon.props.size).toBe(24); // default size
    expect(icon.props.name).toBe('send'); // mapped name
    expect(icon.props.color).toBe('blue');
  });

  it('should map chevron.left.forwardslash.chevron.right to code icon', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="chevron.left.forwardslash.chevron.right"
        size={32}
        color="green"
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon.props.name).toBe('code');
    expect(icon.props.size).toBe(32);
    expect(icon.props.color).toBe('green');
  });

  it('should map chevron.right to chevron-right icon', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="chevron.right"
        size={16}
        color="purple"
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon.props.name).toBe('chevron-right');
    expect(icon.props.size).toBe(16);
    expect(icon.props.color).toBe('purple');
  });

  it('should pass style prop to MaterialIcons', () => {
    const testStyle = { marginTop: 10, opacity: 0.8 };
    
    const { getByTestId } = render(
      <IconSymbol
        name="house.fill"
        color="black"
        style={testStyle}
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon.props.style).toEqual(testStyle);
  });

  it('should handle custom size values', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="paperplane.fill"
        size={48}
        color="orange"
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon.props.size).toBe(48);
  });

  it('should work with OpaqueColorValue color type', () => {
    const opaqueColor = '#FF0000' as any; // simulating OpaqueColorValue
    
    const { getByTestId } = render(
      <IconSymbol
        name="house.fill"
        color={opaqueColor}
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon.props.color).toBe(opaqueColor);
  });

  it('should work without style prop', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="chevron.right"
        color="gray"
      />
    );
    
    const icon = getByTestId('material-icons');
    expect(icon).toBeTruthy();
    // Style should be undefined if not provided
  });

  it('should handle all mapped icon names correctly', () => {
    const mappedIcons = [
      { symbolName: 'house.fill', materialName: 'home' },
      { symbolName: 'paperplane.fill', materialName: 'send' },
      { symbolName: 'chevron.left.forwardslash.chevron.right', materialName: 'code' },
      { symbolName: 'chevron.right', materialName: 'chevron-right' },
    ];

    mappedIcons.forEach(({ symbolName, materialName }) => {
      const { getByTestId } = render(
        <IconSymbol
          name={symbolName as any}
          color="black"
        />
      );
      
      const icon = getByTestId('material-icons');
      expect(icon.props.name).toBe(materialName);
    });
  });
});