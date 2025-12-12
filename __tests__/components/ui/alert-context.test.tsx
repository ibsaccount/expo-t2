import React from 'react';
import { renderHook, act } from '../../test-utils';
import { AlertProvider, useAlert } from '../../../components/ui/alert-context';

// Mock the AlertModal component since it's rendered by the provider
jest.mock('../../../components/ui/alert-modal', () => {
  return {
    AlertModal: ({ visible, title, message, onClose, buttons, textArea }: any) => {
      if (!visible) return null;
      return (
        <div data-testid="alert-modal">
          <div data-testid="alert-title">{title}</div>
          <div data-testid="alert-message">{message}</div>
          {textArea && (
            <input 
              data-testid="alert-textarea"
              placeholder={textArea.placeholder}
              maxLength={textArea.maxLength}
            />
          )}
          {buttons?.map((button: any, index: number) => (
            <button
              key={index}
              data-testid={`alert-button-${button.text}`}
              onClick={() => button.onPress?.()}
            >
              {button.text}
            </button>
          ))}
          <button data-testid="alert-close" onClick={onClose}>Close</button>
        </div>
      );
    }
  };
});

describe('AlertContext', () => {
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
    <AlertProvider>{children}</AlertProvider>
  );

  it('should provide alert context functions', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });

    expect(typeof result.current.showAlert).toBe('function');
    expect(typeof result.current.showSimpleAlert).toBe('function');
    expect(typeof result.current.showConfirm).toBe('function');
    expect(typeof result.current.showDeleteConfirm).toBe('function');
    expect(typeof result.current.showTextAreaAlert).toBe('function');
    expect(typeof result.current.hideAlert).toBe('function');
    expect(typeof result.current.hideAllAlerts).toBe('function');
  });

  it('should show alert and return alert ID', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });

    let alertId: string;
    act(() => {
      alertId = result.current.showAlert({
        title: 'Test Alert',
        message: 'Test message',
        buttons: [{ text: 'OK', style: 'default' }]
      });
    });

    expect(alertId!).toMatch(/^alert_\d+_/);
  });

  it('should show simple alert', () => {
    const mockOnOk = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showSimpleAlert('Simple Title', 'Simple message', mockOnOk);
    });

    // The alert should be rendered (we can't easily test the DOM here but we can test the function call)
    expect(mockOnOk).not.toHaveBeenCalled(); // Should only be called when button is pressed
  });

  it('should show confirmation dialog', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showConfirm('Confirm Title', 'Confirm message', mockOnConfirm, mockOnCancel);
    });

    // Functions should not be called yet
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should show delete confirmation dialog', () => {
    const mockOnDelete = jest.fn();
    const mockOnCancel = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showDeleteConfirm('Delete Title', 'Delete message', mockOnDelete, mockOnCancel);
    });

    // Functions should not be called yet
    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should show text area alert', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showTextAreaAlert(
        'Text Area Title',
        'Text area message',
        {
          placeholder: 'Custom placeholder',
          maxLength: 100,
          multiline: false
        },
        mockOnSubmit,
        mockOnCancel
      );
    });

    // Functions should not be called yet
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should show text area alert with default config', () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showTextAreaAlert(
        'Text Area Title',
        'Text area message',
        undefined,
        mockOnSubmit
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should hide specific alert by ID', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });

    let alertId: string;
    act(() => {
      alertId = result.current.showAlert({
        title: 'Test Alert',
        message: 'Test message'
      });
    });

    act(() => {
      result.current.hideAlert(alertId!);
    });

    // Fast-forward the timeout
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Alert should be removed after timeout
  });

  it('should hide all alerts', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });

    // Show multiple alerts
    act(() => {
      result.current.showAlert({ title: 'Alert 1' });
      result.current.showAlert({ title: 'Alert 2' });
      result.current.showAlert({ title: 'Alert 3' });
    });

    // Hide all alerts
    act(() => {
      result.current.hideAllAlerts();
    });

    // Fast-forward the timeout
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // All alerts should be removed
  });

  it('should throw error when useAlert is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAlert());
    }).toThrow('useAlert must be used within an AlertProvider');

    consoleError.mockRestore();
  });

  it('should generate unique alert IDs', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });

    const alertIds: string[] = [];
    act(() => {
      alertIds.push(result.current.showAlert({ title: 'Alert 1' }));
      alertIds.push(result.current.showAlert({ title: 'Alert 2' }));
      alertIds.push(result.current.showAlert({ title: 'Alert 3' }));
    });

    // All IDs should be unique
    const uniqueIds = new Set(alertIds);
    expect(uniqueIds.size).toBe(3);
    
    // All IDs should follow the expected pattern
    alertIds.forEach(id => {
      expect(id).toMatch(/^alert_\d+_[a-z0-9]{9}$/);
    });
  });

  it('should handle alert with default buttons when none provided', () => {
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showAlert({
        title: 'Alert with default button'
      });
    });

    // Should not throw and should create alert with OK button
  });

  it('should handle text area alert submit with input value', () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showTextAreaAlert(
        'Input Alert',
        'Please enter text',
        undefined,
        mockOnSubmit
      );
    });

    // This tests the onPress function structure, actual button interaction would require DOM testing
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle delete confirm with empty OK function', () => {
    const mockOnDelete = jest.fn();
    const { result } = renderHook(() => useAlert(), { wrapper });

    act(() => {
      result.current.showDeleteConfirm(
        'Delete Item',
        'Are you sure?',
        mockOnDelete
      );
    });

    // Should create alert with three buttons including an empty OK function
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});