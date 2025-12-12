import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AlertModal } from '../../../components/ui/alert-modal';

// Mock the useThemeColor hook
jest.mock('../../../hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

describe('AlertModal', () => {
  const defaultProps = {
    id: 'test-alert',
    title: 'Test Alert',
    message: 'Test message',
    buttons: [{ text: 'OK', onPress: jest.fn() }],
    visible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const { getByTestId } = render(<AlertModal {...defaultProps} />);
    expect(getByTestId('alert-modal-test-alert')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const props = { ...defaultProps, visible: false };
    const { queryByTestId } = render(<AlertModal {...props} />);
    expect(queryByTestId('alert-modal-test-alert')).toBeNull();
  });

  it('should render title', () => {
    const { getByTestId } = render(<AlertModal {...defaultProps} />);
    expect(getByTestId('alert-title')).toBeTruthy();
  });

  it('should render message when provided', () => {
    const { getByTestId } = render(<AlertModal {...defaultProps} />);
    expect(getByTestId('alert-message')).toBeTruthy();
  });

  it('should render buttons', () => {
    const { getByTestId } = render(<AlertModal {...defaultProps} />);
    expect(getByTestId('button-container')).toBeTruthy();
  });

  it('should handle button press', () => {
    const onPress = jest.fn();
    const props = { ...defaultProps, buttons: [{ text: 'OK', onPress }] };
    const { getByTestId } = render(<AlertModal {...props} />);
    
    fireEvent.press(getByTestId('button-0'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should handle backdrop press', () => {
    const { getByTestId } = render(<AlertModal {...defaultProps} />);
    
    fireEvent.press(getByTestId('backdrop'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should render text area when provided', () => {
    const props = { 
      ...defaultProps, 
      textArea: { placeholder: 'Enter text' } 
    };
    const { getByTestId } = render(<AlertModal {...props} />);
    
    expect(getByTestId('text-area-container')).toBeTruthy();
    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('should handle text input change', () => {
    const props = { 
      ...defaultProps, 
      textArea: { defaultValue: 'test' } 
    };
    const { getByTestId } = render(<AlertModal {...props} />);
    
    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'new text');
    
    // Test that the component doesn't crash
    expect(input).toBeTruthy();
  });

  it('should show character count', () => {
    const props = { 
      ...defaultProps, 
      textArea: { defaultValue: 'test', maxLength: 100 } 
    };
    const { getByTestId } = render(<AlertModal {...props} />);
    
    expect(getByTestId('char-count')).toBeTruthy();
  });
});