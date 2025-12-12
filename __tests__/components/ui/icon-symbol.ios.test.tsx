import React from 'react';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '../../../components/ui/icon-symbol.ios';

// Mock SymbolView from expo-symbols
jest.mock('expo-symbols', () => {
  const React = require('react');
  return {
    SymbolView: React.forwardRef(function MockSymbolView(props: any, ref: any) {
      return React.createElement('MockSymbolView', {
        ...props,
        ref,
        testID: 'symbol-view',
      });
    })
  };
});

describe('IconSymbol (iOS)', () => {
  it('should render SymbolView with correct props', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="house.fill"
        size={24}
        color="red"
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    expect(symbolView).toBeTruthy();
    expect(symbolView.props.name).toBe('house.fill');
    expect(symbolView.props.tintColor).toBe('red');
    expect(symbolView.props.weight).toBe('regular'); // default weight
    expect(symbolView.props.resizeMode).toBe('scaleAspectFit');
  });

  it('should render with default values when not specified', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="paperplane.fill"
        color="blue"
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    expect(symbolView.props.size).toBeUndefined(); // size is handled in style
    expect(symbolView.props.weight).toBe('regular');
    expect(symbolView.props.name).toBe('paperplane.fill');
    expect(symbolView.props.tintColor).toBe('blue');
  });

  it('should apply custom weight', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="chevron.right"
        color="green"
        weight="bold"
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    expect(symbolView.props.weight).toBe('bold');
    expect(symbolView.props.name).toBe('chevron.right');
    expect(symbolView.props.tintColor).toBe('green');
  });

  it('should apply size through style prop', () => {
    const { getByTestId } = render(
      <IconSymbol
        name="star.fill"
        size={32}
        color="yellow"
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    const style = symbolView.props.style;
    
    // Check that style is an array with size dimensions
    expect(Array.isArray(style)).toBe(true);
    expect(style[0]).toEqual({
      width: 32,
      height: 32,
    });
  });

  it('should merge custom style with size style', () => {
    const customStyle = { marginLeft: 10, opacity: 0.7 };
    
    const { getByTestId } = render(
      <IconSymbol
        name="heart.fill"
        size={16}
        color="pink"
        style={customStyle}
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    const style = symbolView.props.style;
    
    expect(Array.isArray(style)).toBe(true);
    expect(style[0]).toEqual({
      width: 16,
      height: 16,
    });
    expect(style[1]).toEqual(customStyle);
  });

  it('should handle different symbol weights', () => {
    const weights = ['ultraLight', 'thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'heavy', 'black'];
    
    weights.forEach((weight) => {
      const { getByTestId } = render(
        <IconSymbol
          name="circle.fill"
          color="black"
          weight={weight as any}
        />
      );
      
      const symbolView = getByTestId('symbol-view');
      expect(symbolView.props.weight).toBe(weight);
    });
  });

  it('should work with different symbol names', () => {
    const symbolNames = [
      'house.fill',
      'paperplane.fill', 
      'star.fill',
      'heart.fill',
      'circle.fill',
    ];

    symbolNames.forEach((name) => {
      const { getByTestId } = render(
        <IconSymbol
          name={name as any}
          color="black"
        />
      );
      
      const symbolView = getByTestId('symbol-view');
      expect(symbolView.props.name).toBe(name);
    });
  });

  it('should handle custom sizes correctly', () => {
    const sizes = [12, 16, 20, 24, 32, 48, 64];
    
    sizes.forEach((size) => {
      const { getByTestId } = render(
        <IconSymbol
          name={'gear' as any}
          size={size}
          color="gray"
        />
      );
      
      const symbolView = getByTestId('symbol-view');
      const style = symbolView.props.style[0];
      expect(style.width).toBe(size);
      expect(style.height).toBe(size);
    });
  });

  it('should work without optional props', () => {
    const { getByTestId } = render(
      <IconSymbol
        name={'bell' as any}
        color="orange"
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    expect(symbolView.props.name).toBe('bell');
    expect(symbolView.props.tintColor).toBe('orange');
    expect(symbolView.props.weight).toBe('regular');
    expect(symbolView.props.resizeMode).toBe('scaleAspectFit');
    
    // Should have default size style
    const style = symbolView.props.style[0];
    expect(style.width).toBe(24);
    expect(style.height).toBe(24);
  });

  it('should handle style as undefined', () => {
    const { getByTestId } = render(
      <IconSymbol
        name={'trash' as any}
        color="red"
        style={undefined}
      />
    );
    
    const symbolView = getByTestId('symbol-view');
    const style = symbolView.props.style;
    
    expect(Array.isArray(style)).toBe(true);
    expect(style[0]).toEqual({ width: 24, height: 24 });
    expect(style[1]).toBeUndefined();
  });
});