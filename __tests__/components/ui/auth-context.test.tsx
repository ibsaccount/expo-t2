import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth, User } from '../../../components/ui/auth-context';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize with loading state', () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should load user from AsyncStorage on mount', async () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'employee',
    };
    
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Wait for useEffect to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@auth_user');
  });

  it('should handle AsyncStorage error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleError).toHaveBeenCalledWith('Error checking auth state:', expect.any(Error));
    
    consoleError.mockRestore();
  });

  it('should login employee user successfully', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    mockAsyncStorage.setItem.mockResolvedValueOnce();
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });
    
    // Login
    await act(async () => {
      const loginPromise = result.current.login('user', 'password');
      jest.advanceTimersByTime(1500); // Simulate delay
      await loginPromise;
    });
    
    expect(result.current.user).toEqual({
      id: '1',
      username: 'user',
      email: 'user@example.com',
      role: 'employee',
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@auth_user',
      JSON.stringify({
        id: '1',
        username: 'user',
        email: 'user@example.com',
        role: 'employee',
      })
    );
  });

  it('should login admin user successfully', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    mockAsyncStorage.setItem.mockResolvedValueOnce();
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      const loginPromise = result.current.login('admin', 'password');
      jest.advanceTimersByTime(1500);
      await loginPromise;
    });
    
    expect(result.current.user).toEqual({
      id: '2',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should reject invalid credentials', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      try {
        const loginPromise = result.current.login('invalid', 'credentials');
        jest.advanceTimersByTime(1500);
        await loginPromise;
      } catch (error) {
        expect(error).toEqual(new Error('Invalid credentials'));
      }
    });
    
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should logout user successfully', async () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'employee',
    };
    
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));
    mockAsyncStorage.removeItem.mockResolvedValueOnce();
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });
    
    // Logout
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@auth_user');
  });

  it('should handle logout error gracefully', async () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'employee',
    };
    
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));
    mockAsyncStorage.removeItem.mockRejectedValueOnce(new Error('Remove error'));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await Promise.resolve();
    });
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBe(null);
    expect(consoleError).toHaveBeenCalledWith('Error logging out:', expect.any(Error));
    
    consoleError.mockRestore();
  });

  it('should throw error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleError.mockRestore();
  });
});