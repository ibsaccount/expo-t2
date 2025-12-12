import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-native';
import { TabProvider, useTab, TabType } from '../../../components/ui/tab-context';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('TabProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TabProvider>{children}</TabProvider>
  );

  it('should initialize with default tab', () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    expect(result.current.activeTab).toBe('me');
  });

  it('should load saved tab from AsyncStorage on mount', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce('team');
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    // Wait for useEffect to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.activeTab).toBe('team');
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@active_tab');
  });

  it('should handle invalid saved tab gracefully', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce('invalid' as any);
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.activeTab).toBe('me'); // Should fallback to default
  });

  it('should handle AsyncStorage error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.activeTab).toBe('me');
    expect(consoleError).toHaveBeenCalledWith('Error loading saved tab:', expect.any(Error));
    
    consoleError.mockRestore();
  });

  it('should set active tab and save to AsyncStorage', async () => {
    const consoleLoge = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    mockAsyncStorage.setItem.mockResolvedValueOnce();
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      await result.current.setActiveTab('team');
    });
    
    expect(result.current.activeTab).toBe('team');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@active_tab', 'team');
    expect(consoleLoge).toHaveBeenCalledWith('Tab saved and set to:', 'team');
    
    consoleLoge.mockRestore();
  });

  it('should prevent unnecessary updates when setting same tab', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce('me');
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      await result.current.setActiveTab('me'); // Same as current
    });
    
    expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should handle setActiveTab storage error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      await result.current.setActiveTab('team');
    });
    
    expect(result.current.activeTab).toBe('team'); // Should still set state
    expect(consoleError).toHaveBeenCalledWith('Error saving tab:', expect.any(Error));
    
    consoleError.mockRestore();
  });

  it('should reset to me tab', async () => {
    const consoleLoge = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockResolvedValueOnce('team');
    mockAsyncStorage.setItem.mockResolvedValueOnce();
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      await result.current.resetToMeTab();
    });
    
    expect(result.current.activeTab).toBe('me');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@active_tab', 'me');
    expect(consoleLoge).toHaveBeenCalledWith('Tab reset to: me');
    
    consoleLoge.mockRestore();
  });

  it('should handle resetToMeTab storage error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockResolvedValueOnce('team');
    mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));
    
    const { result } = renderHook(() => useTab(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      await result.current.resetToMeTab();
    });
    
    expect(result.current.activeTab).toBe('me'); // Should still set state
    expect(consoleError).toHaveBeenCalledWith('Error resetting tab:', expect.any(Error));
    
    consoleError.mockRestore();
  });

  it('should throw error when useTab is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTab());
    }).toThrow('useTab must be used within a TabProvider');
    
    consoleError.mockRestore();
  });
});