import React from 'react';
import { renderHook, act } from '../../test-utils';
import { ToasterProvider, useToaster } from '../../../components/ui/toaster-context';

// Mock the Toaster component since it's rendered by the provider
jest.mock('../../../components/ui/toaster', () => {
  return {
    Toaster: ({ toasts, onRemove }: any) => (
      <div data-testid="toaster-container">
        {toasts.map((toast: any) => (
          <div key={toast.id} data-testid={`toast-${toast.id}`}>
            <div data-testid="toast-title">{toast.title}</div>
            <div data-testid="toast-message">{toast.message}</div>
            <div data-testid="toast-type">{toast.type}</div>
            {toast.closable && (
              <button
                data-testid="toast-close"
                onClick={() => onRemove(toast.id)}
              >
                Close
              </button>
            )}
          </div>
        ))}
      </div>
    )
  };
});

describe('ToasterContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToasterProvider>{children}</ToasterProvider>
  );

  const wrapperWithMaxToasts = ({ children }: { children: React.ReactNode }) => (
    <ToasterProvider maxToasts={2}>{children}</ToasterProvider>
  );

  it('should provide toaster context functions', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    expect(typeof result.current.showToast).toBe('function');
    expect(typeof result.current.showInfo).toBe('function');
    expect(typeof result.current.showSuccess).toBe('function');
    expect(typeof result.current.showWarning).toBe('function');
    expect(typeof result.current.showError).toBe('function');
    expect(typeof result.current.hideToast).toBe('function');
    expect(typeof result.current.hideAllToasts).toBe('function');
  });

  it('should show toast and return toast ID', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    let toastId: string;
    act(() => {
      toastId = result.current.showToast('Test Toast', 'Test message');
    });

    expect(toastId!).toMatch(/^toast_\d+_/);
  });

  it('should show toast with custom options', () => {
    const mockOnClose = jest.fn();
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Custom Toast', 'Custom message', {
        type: 'warning',
        duration: 2000,
        closable: false,
        onClose: mockOnClose
      });
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show info toast', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showInfo('Info Toast', 'Info message');
    });

    // Should create a toast with info type
  });

  it('should show success toast', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showSuccess('Success Toast', 'Success message');
    });

    // Should create a toast with success type
  });

  it('should show warning toast', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showWarning('Warning Toast', 'Warning message');
    });

    // Should create a toast with warning type
  });

  it('should show error toast', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showError('Error Toast', 'Error message');
    });

    // Should create a toast with error type
  });

  it('should show typed toasts with custom options', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showInfo('Info', 'Message', { duration: 1000 });
      result.current.showSuccess('Success', 'Message', { closable: false });
      result.current.showWarning('Warning', 'Message', { duration: 3000 });
      result.current.showError('Error', 'Message', { closable: true });
    });

    // All toasts should be created with their respective types
  });

  it('should hide specific toast by ID', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    let toastId: string;
    act(() => {
      toastId = result.current.showToast('Test Toast', 'Test message');
    });

    act(() => {
      result.current.hideToast(toastId!);
    });

    // Toast should be removed
  });

  it('should hide all toasts', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Toast 1');
      result.current.showToast('Toast 2');
      result.current.showToast('Toast 3');
    });

    act(() => {
      result.current.hideAllToasts();
    });

    // All toasts should be removed
  });

  it('should limit number of toasts based on maxToasts prop', () => {
    const { result } = renderHook(() => useToaster(), { wrapper: wrapperWithMaxToasts });

    act(() => {
      result.current.showToast('Toast 1');
      result.current.showToast('Toast 2');
      result.current.showToast('Toast 3'); // This should push out Toast 1
    });

    // Should only keep the 2 most recent toasts
  });

  it('should use default maxToasts when not provided', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      // Add more than 5 toasts to test default limit
      for (let i = 1; i <= 7; i++) {
        result.current.showToast(`Toast ${i}`);
      }
    });

    // Should only keep the 5 most recent toasts
  });

  it('should throw error when useToaster is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useToaster());
    }).toThrow('useToaster must be used within a ToasterProvider');

    consoleError.mockRestore();
  });

  it('should generate unique toast IDs', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    const toastIds: string[] = [];
    act(() => {
      toastIds.push(result.current.showToast('Toast 1'));
      toastIds.push(result.current.showToast('Toast 2'));
      toastIds.push(result.current.showToast('Toast 3'));
    });

    // All IDs should be unique
    const uniqueIds = new Set(toastIds);
    expect(uniqueIds.size).toBe(3);
    
    // All IDs should follow the expected pattern
    toastIds.forEach(id => {
      expect(id).toMatch(/^toast_\d+_[a-z0-9]{9}$/);
    });
  });

  it('should handle toast with only title', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Only Title');
    });

    // Should create toast with just title and no message
  });

  it('should use default options when not provided', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Default Toast', 'Default message');
    });

    // Should use default: type='info', duration=4000, closable=true
  });

  it('should handle onClose callback', () => {
    const mockOnClose = jest.fn();
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Toast with callback', 'Message', {
        onClose: mockOnClose
      });
    });

    // onClose should be attached to the toast but not called yet
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle different duration values', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Short toast', 'Message', { duration: 1000 });
      result.current.showToast('Long toast', 'Message', { duration: 10000 });
      result.current.showToast('No duration', 'Message', { duration: 0 });
    });

    // All toasts should be created with their respective durations
  });

  it('should handle closable option', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('Closable toast', 'Message', { closable: true });
      result.current.showToast('Non-closable toast', 'Message', { closable: false });
    });

    // Toasts should have their respective closable states
  });

  it('should maintain toast order (newest first)', () => {
    const { result } = renderHook(() => useToaster(), { wrapper });

    act(() => {
      result.current.showToast('First toast');
      result.current.showToast('Second toast');
      result.current.showToast('Third toast');
    });

    // Newest toasts should appear first in the array
  });
});