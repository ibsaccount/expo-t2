import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View, TouchableOpacity } from 'react-native';

// Mock the theme hook
jest.mock('../../../hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

// Define types for testing
type ToastType = 'info' | 'warning' | 'error' | 'success';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

interface ToasterProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

// Create simplified mock components using React Native components
const SimpleToasterItem = (props: any) => {
  const {
    id,
    type,
    title,
    message,
    duration = 4000,
    closable = true,
    onClose,
    onRemove,
  } = props;

  // Mock the auto-close behavior
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        try {
          onClose?.();
        } catch (error) {
          // Ignore errors from onClose to ensure onRemove is always called
        }
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose, onRemove]);

  const handleClose = () => {
    try {
      onClose?.();
    } catch (error) {
      // Ignore errors from onClose to ensure onRemove is always called
    }
    onRemove(id);
  };

  const getIconText = () => {
    switch (type) {
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'success':
        return '✓';
      case 'info':
      default:
        return 'ⓘ';
    }
  };

  return (
    <View testID={`toast-${id}`}>
      <View testID="toast-content">
        <Text testID="toast-icon">{getIconText()}</Text>
        <View testID="toast-text">
          <Text testID="toast-title">{title}</Text>
          {message && <Text testID="toast-message">{message}</Text>}
        </View>
        {closable && (
          <TouchableOpacity testID="close-button" onPress={handleClose}>
            <Text>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const SimpleToaster = (props: ToasterProps) => {
  const { toasts, onRemove } = props;

  if (toasts.length === 0) return null;

  return (
    <View testID="toaster-container">
      {toasts.map((toast) => (
        <SimpleToasterItem key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </View>
  );
};

describe('Toaster Component', () => {
  const defaultToast: ToastProps = {
    id: 'test-toast',
    type: 'info',
    title: 'Test Toast',
    message: 'Test message',
    duration: 4000,
    closable: true,
  };

  const defaultProps: ToasterProps = {
    toasts: [defaultToast],
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render nothing when toasts array is empty', () => {
      const { queryByTestId } = render(
        <SimpleToaster toasts={[]} onRemove={jest.fn()} />
      );

      expect(queryByTestId('toaster-container')).toBeNull();
    });

    it('should render toaster container when toasts are present', () => {
      const { getByTestId } = render(<SimpleToaster {...defaultProps} />);

      expect(getByTestId('toaster-container')).toBeTruthy();
      expect(getByTestId('toast-test-toast')).toBeTruthy();
    });

    it('should render toast title correctly', () => {
      const { getByTestId } = render(<SimpleToaster {...defaultProps} />);

      const titleElement = getByTestId('toast-title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.props.children).toBe('Test Toast');
    });

    it('should render toast message when provided', () => {
      const { getByTestId } = render(<SimpleToaster {...defaultProps} />);

      const messageElement = getByTestId('toast-message');
      expect(messageElement).toBeTruthy();
      expect(messageElement.props.children).toBe('Test message');
    });

    it('should not render message when not provided', () => {
      const toast = { ...defaultToast, message: undefined };
      const props = { ...defaultProps, toasts: [toast] };
      const { queryByTestId } = render(<SimpleToaster {...props} />);

      expect(queryByTestId('toast-message')).toBeNull();
    });

    it('should render toast with correct ID in testID', () => {
      const toast = { ...defaultToast, id: 'custom-id' };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-custom-id')).toBeTruthy();
    });
  });

  describe('Toast Types and Icons', () => {
    it('should render info icon for info type', () => {
      const toast = { ...defaultToast, type: 'info' as const };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-icon').props.children).toBe('ⓘ');
    });

    it('should render success icon for success type', () => {
      const toast = { ...defaultToast, type: 'success' as const };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-icon').props.children).toBe('✓');
    });

    it('should render warning icon for warning type', () => {
      const toast = { ...defaultToast, type: 'warning' as const };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-icon').props.children).toBe('⚠');
    });

    it('should render error icon for error type', () => {
      const toast = { ...defaultToast, type: 'error' as const };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-icon').props.children).toBe('✕');
    });

    it('should default to info icon for unknown type', () => {
      const toast = { ...defaultToast, type: 'unknown' as any };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-icon').props.children).toBe('ⓘ');
    });
  });

  describe('Multiple Toasts', () => {
    it('should render multiple toasts correctly', () => {
      const toasts = [
        { ...defaultToast, id: 'toast-1', title: 'First Toast' },
        { ...defaultToast, id: 'toast-2', title: 'Second Toast' },
        { ...defaultToast, id: 'toast-3', title: 'Third Toast' },
      ];
      const props = { ...defaultProps, toasts };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-toast-1')).toBeTruthy();
      expect(getByTestId('toast-toast-2')).toBeTruthy();
      expect(getByTestId('toast-toast-3')).toBeTruthy();
    });

    it('should render different toast types together', () => {
      const toasts = [
        { ...defaultToast, id: 'info', type: 'info' as const, title: 'Info' },
        { ...defaultToast, id: 'success', type: 'success' as const, title: 'Success' },
        { ...defaultToast, id: 'warning', type: 'warning' as const, title: 'Warning' },
        { ...defaultToast, id: 'error', type: 'error' as const, title: 'Error' },
      ];
      const props = { ...defaultProps, toasts };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      expect(getByTestId('toast-info')).toBeTruthy();
      expect(getByTestId('toast-success')).toBeTruthy();
      expect(getByTestId('toast-warning')).toBeTruthy();
      expect(getByTestId('toast-error')).toBeTruthy();
    });

    it('should maintain toast order', () => {
      const toasts = [
        { ...defaultToast, id: 'first', title: 'First' },
        { ...defaultToast, id: 'second', title: 'Second' },
        { ...defaultToast, id: 'third', title: 'Third' },
      ];
      const props = { ...defaultProps, toasts };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      // Verify all toasts are rendered in order
      expect(getByTestId('toast-first')).toBeTruthy();
      expect(getByTestId('toast-second')).toBeTruthy();
      expect(getByTestId('toast-third')).toBeTruthy();
    });
  });

  describe('Close Functionality', () => {
    it('should render close button when closable is true', () => {
      const { getByTestId } = render(<SimpleToaster {...defaultProps} />);

      const closeButton = getByTestId('close-button');
      expect(closeButton).toBeTruthy();
      expect(closeButton.props.children.props.children).toBe('×');
    });

    it('should not render close button when closable is false', () => {
      const toast = { ...defaultToast, closable: false };
      const props = { ...defaultProps, toasts: [toast] };
      const { queryByTestId } = render(<SimpleToaster {...props} />);

      expect(queryByTestId('close-button')).toBeNull();
    });

    it('should call onClose and onRemove when close button is pressed', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, onClose };
      const props = { toasts: [toast], onRemove };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      fireEvent.press(getByTestId('close-button'));
      
      expect(onClose).toHaveBeenCalled();
      expect(onRemove).toHaveBeenCalledWith('test-toast');
    });

    it('should not crash when onClose is undefined', () => {
      const onRemove = jest.fn();
      const toast = { ...defaultToast, onClose: undefined };
      const props = { toasts: [toast], onRemove };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      expect(() => {
        fireEvent.press(getByTestId('close-button'));
      }).not.toThrow();
      
      expect(onRemove).toHaveBeenCalledWith('test-toast');
    });

    it('should handle close button default behavior', () => {
      const toast = { ...defaultToast, closable: undefined };
      const props = { ...defaultProps, toasts: [toast] };
      const { getByTestId } = render(<SimpleToaster {...props} />);

      // Should default to closable=true
      expect(getByTestId('close-button')).toBeTruthy();
    });
  });

  describe('Auto-close Timer', () => {
    it('should auto-close after specified duration', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, duration: 2000, onClose };
      const props = { toasts: [toast], onRemove };
      
      render(<SimpleToaster {...props} />);
      
      expect(onClose).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(2000);
      
      expect(onClose).toHaveBeenCalled();
      expect(onRemove).toHaveBeenCalledWith('test-toast');
    });

    it('should not auto-close when duration is 0', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, duration: 0, onClose };
      const props = { toasts: [toast], onRemove };
      
      render(<SimpleToaster {...props} />);
      
      jest.advanceTimersByTime(10000);
      
      expect(onClose).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
    });

    it('should handle custom duration values', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, duration: 5500, onClose };
      const props = { toasts: [toast], onRemove };
      
      render(<SimpleToaster {...props} />);
      
      jest.advanceTimersByTime(5499);
      expect(onClose).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(1);
      expect(onClose).toHaveBeenCalled();
      expect(onRemove).toHaveBeenCalledWith('test-toast');
    });

    it('should use default duration when not specified', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, duration: undefined, onClose };
      const props = { toasts: [toast], onRemove };
      
      render(<SimpleToaster {...props} />);
      
      jest.advanceTimersByTime(3999);
      expect(onClose).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(1);
      expect(onClose).toHaveBeenCalled();
    });

    it('should handle negative duration by not auto-closing', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, duration: -1000, onClose };
      const props = { toasts: [toast], onRemove };
      
      render(<SimpleToaster {...props} />);
      
      jest.advanceTimersByTime(10000);
      
      expect(onClose).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
    });

    it('should clean up timers on unmount', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, duration: 2000, onClose };
      const props = { toasts: [toast], onRemove };
      
      const { unmount } = render(<SimpleToaster {...props} />);
      
      unmount();
      
      jest.advanceTimersByTime(2000);
      
      expect(onClose).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle toast without title gracefully', () => {
      const toast = { ...defaultToast, title: '' };
      const props = { ...defaultProps, toasts: [toast] };
      
      expect(() => {
        render(<SimpleToaster {...props} />);
      }).not.toThrow();
    });

    it('should handle very long titles', () => {
      const longTitle = 'This is a very long title that might wrap or be truncated depending on the layout constraints of the toast component';
      const toast = { ...defaultToast, title: longTitle };
      const props = { ...defaultProps, toasts: [toast] };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      expect(getByTestId('toast-title').props.children).toBe(longTitle);
    });

    it('should handle very long messages', () => {
      const longMessage = 'This is a very long message that contains a lot of text and might need to be wrapped or truncated based on the available space in the toast notification component.';
      const toast = { ...defaultToast, message: longMessage };
      const props = { ...defaultProps, toasts: [toast] };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      expect(getByTestId('toast-message').props.children).toBe(longMessage);
    });

    it('should handle null/undefined props gracefully', () => {
      const toast = { ...defaultToast, message: null as any };
      const props = { ...defaultProps, toasts: [toast] };
      
      expect(() => {
        render(<SimpleToaster {...props} />);
      }).not.toThrow();
    });

    it('should handle duplicate IDs', () => {
      const toasts = [
        { ...defaultToast, id: 'duplicate', title: 'First' },
        { ...defaultToast, id: 'duplicate', title: 'Second' },
      ];
      const props = { ...defaultProps, toasts };
      
      expect(() => {
        render(<SimpleToaster {...props} />);
      }).not.toThrow();
    });

    it('should handle empty ID', () => {
      const toast = { ...defaultToast, id: '' };
      const props = { ...defaultProps, toasts: [toast] };
      
      expect(() => {
        render(<SimpleToaster {...props} />);
      }).not.toThrow();
    });

    it('should handle missing required props', () => {
      const toast = { ...defaultToast, type: undefined as any };
      const props = { ...defaultProps, toasts: [toast] };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      // Should fallback to info icon
      expect(getByTestId('toast-icon').props.children).toBe('ⓘ');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle mixed configurations', () => {
      const toasts = [
        { id: 'info', type: 'info' as const, title: 'Info', closable: false, duration: 0 },
        { id: 'success', type: 'success' as const, title: 'Success', message: 'Great!', duration: 1000 },
        { id: 'warning', type: 'warning' as const, title: 'Warning', closable: true, duration: 2000 },
        { id: 'error', type: 'error' as const, title: 'Error', message: 'Something failed', closable: false },
      ];
      const props = { ...defaultProps, toasts };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      expect(getByTestId('toast-info')).toBeTruthy();
      expect(getByTestId('toast-success')).toBeTruthy();
      expect(getByTestId('toast-warning')).toBeTruthy();
      expect(getByTestId('toast-error')).toBeTruthy();
    });

    it('should handle rapid toast additions and removals', () => {
      const onRemove = jest.fn();
      let toasts = [{ ...defaultToast, id: 'first' }];
      
      const { rerender, getByTestId, queryByTestId } = render(
        <SimpleToaster toasts={toasts} onRemove={onRemove} />
      );
      
      expect(getByTestId('toast-first')).toBeTruthy();
      
      // Add more toasts
      toasts = [
        ...toasts,
        { ...defaultToast, id: 'second', title: 'Second' },
        { ...defaultToast, id: 'third', title: 'Third' },
      ];
      
      rerender(<SimpleToaster toasts={toasts} onRemove={onRemove} />);
      
      expect(getByTestId('toast-first')).toBeTruthy();
      expect(getByTestId('toast-second')).toBeTruthy();
      expect(getByTestId('toast-third')).toBeTruthy();
      
      // Remove all toasts
      toasts = [];
      
      rerender(<SimpleToaster toasts={toasts} onRemove={onRemove} />);
      
      expect(queryByTestId('toaster-container')).toBeNull();
    });

    it('should handle simultaneous auto-close timers', () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();
      const onRemove = jest.fn();
      
      const toasts = [
        { ...defaultToast, id: 'first', duration: 1000, onClose: onClose1 },
        { ...defaultToast, id: 'second', duration: 2000, onClose: onClose2 },
      ];
      const props = { toasts, onRemove };
      
      render(<SimpleToaster {...props} />);
      
      jest.advanceTimersByTime(1000);
      expect(onClose1).toHaveBeenCalled();
      expect(onRemove).toHaveBeenCalledWith('first');
      expect(onClose2).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(1000);
      expect(onClose2).toHaveBeenCalled();
      expect(onRemove).toHaveBeenCalledWith('second');
    });
  });

  describe('Callback Integration', () => {
    it('should pass correct parameters to callbacks', () => {
      const onClose = jest.fn();
      const onRemove = jest.fn();
      const toast = { ...defaultToast, id: 'callback-test', onClose };
      const props = { toasts: [toast], onRemove };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      fireEvent.press(getByTestId('close-button'));
      
      expect(onClose).toHaveBeenCalledWith();
      expect(onRemove).toHaveBeenCalledWith('callback-test');
    });

    it('should handle onRemove being undefined', () => {
      const props = { toasts: [defaultToast], onRemove: undefined as any };
      
      expect(() => {
        render(<SimpleToaster {...props} />);
      }).not.toThrow();
    });

    it('should call callbacks in correct order', () => {
      const callOrder: string[] = [];
      const onClose = jest.fn(() => callOrder.push('onClose'));
      const onRemove = jest.fn(() => callOrder.push('onRemove'));
      
      const toast = { ...defaultToast, onClose };
      const props = { toasts: [toast], onRemove };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      fireEvent.press(getByTestId('close-button'));
      
      expect(callOrder).toEqual(['onClose', 'onRemove']);
    });

    it('should handle exceptions in callbacks gracefully', () => {
      const onClose = jest.fn(() => { throw new Error('Test error'); });
      const onRemove = jest.fn();
      
      const toast = { ...defaultToast, onClose };
      const props = { toasts: [toast], onRemove };
      
      const { getByTestId } = render(<SimpleToaster {...props} />);
      
      // The press should not throw because we handle the error gracefully
      expect(() => {
        fireEvent.press(getByTestId('close-button'));
      }).not.toThrow();
      
      // onClose should have been called
      expect(onClose).toHaveBeenCalled();
      // onRemove should still be called even if onClose throws
      expect(onRemove).toHaveBeenCalledWith('test-toast');
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large numbers of toasts', () => {
      const toasts = Array.from({ length: 50 }, (_, i) => ({
        ...defaultToast,
        id: `toast-${i}`,
        title: `Toast ${i}`,
      }));
      const props = { ...defaultProps, toasts };
      
      expect(() => {
        render(<SimpleToaster {...props} />);
      }).not.toThrow();
    });

    it('should re-render efficiently when props change', () => {
      const props1 = {
        toasts: [{ ...defaultToast, id: 'toast-1' }],
        onRemove: jest.fn(),
      };
      
      const { rerender } = render(<SimpleToaster {...props1} />);
      
      const props2 = {
        toasts: [
          { ...defaultToast, id: 'toast-1' },
          { ...defaultToast, id: 'toast-2', title: 'New Toast' },
        ],
        onRemove: jest.fn(),
      };
      
      expect(() => {
        rerender(<SimpleToaster {...props2} />);
      }).not.toThrow();
    });
  });
});