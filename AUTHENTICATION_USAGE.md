# Authentication System Documentation

## Overview
This authentication system provides a complete login flow with persistent user sessions using React Navigation and React Context.

## Features
- ✅ **Login Screen** with username/password authentication
- ✅ **Persistent Sessions** using AsyncStorage
- ✅ **Loading States** with smooth transitions
- ✅ **Demo Authentication** with predefined credentials
- ✅ **Logout Functionality** from Profile and Settings screens
- ✅ **Theme Integration** supporting light/dark mode

## Authentication Flow

### 1. Initial App Load
```
App Start → Check AsyncStorage → Show Loading → Login Screen OR Home Page
```

### 2. Login Process
```
Login Screen → Enter Credentials → Validate → Save to AsyncStorage → Navigate to Home
```

### 3. Logout Process
```
Profile/Settings → Logout Button → Confirm Dialog → Clear AsyncStorage → Navigate to Login
```

## Demo Credentials

### Account 1 (Demo User)
- **Username**: `demo`
- **Password**: `password`
- **Email**: `demo@example.com`

### Account 2 (Admin User)
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@example.com`

## File Structure

### Core Authentication Files
```
components/ui/auth-context.tsx     # Authentication context and hooks
src/screens/LoginScreen.tsx        # Login form component
src/navigation/RootNavigation.tsx  # Authentication-aware navigation
```

### Updated Screen Files
```
src/screens/ProfileScreen.tsx      # User profile with logout
src/screens/SettingsScreen.tsx     # App settings with logout
```

## Usage Examples

### Using Authentication Context
```tsx
import { useAuth } from '../../components/ui/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Access user data
  console.log(user?.username);
  
  // Check if logged in
  if (isAuthenticated) {
    // Show authenticated content
  }
}
```

### Login Function
```tsx
const handleLogin = async () => {
  try {
    await login(username, password);
    // User will be automatically navigated to home page
  } catch (error) {
    // Handle login error
  }
};
```

### Logout Function
```tsx
const handleLogout = async () => {
  await logout();
  // User will be automatically navigated to login page
};
```

## Authentication Context API

### Properties
- `user: User | null` - Current logged-in user or null
- `isLoading: boolean` - Loading state during authentication checks
- `isAuthenticated: boolean` - Whether user is currently authenticated

### Methods
- `login(username: string, password: string): Promise<void>` - Authenticate user
- `logout(): Promise<void>` - Clear authentication and return to login

## User Interface Components

### Login Screen Features
- Username and password input fields
- Loading indicator during authentication
- Demo login button for quick testing
- Responsive design with keyboard handling
- Error handling with alert dialogs

### Profile Screen Features
- Display current user information
- Logout button with confirmation
- Theme-aware styling

### Settings Screen Features
- Account information display
- App preferences section
- Data management options
- Logout functionality

## Security Notes

### Current Implementation
- Demo authentication with hardcoded credentials
- Local storage using AsyncStorage
- Simple credential validation

### Production Considerations
- Replace demo authentication with real API calls
- Implement secure token storage
- Add password encryption/hashing
- Implement refresh token logic
- Add biometric authentication support

## Navigation Flow

### Pre-Authentication
```
App Load → AuthProvider → LoginScreen
```

### Post-Authentication
```
App Load → AuthProvider → Tab Navigator → Home/Profile/Settings
```

### Authentication State Changes
```
Login Success → Store User → Show Main App
Logout → Clear Storage → Show Login Screen
App Restart → Check Storage → Show Appropriate Screen
```

## Testing the Authentication

### Test Login Flow
1. App starts with login screen
2. Enter demo credentials: `demo` / `password`
3. Loading indicator appears for 1.5 seconds
4. Home screen appears with bottom tabs

### Test Session Persistence
1. Log in successfully
2. Close and restart the app
3. App should skip login and go directly to home screen

### Test Logout Flow
1. Navigate to Profile or Settings tab
2. Tap logout button
3. Confirm logout in dialog
4. App returns to login screen
5. Restart app - should show login screen (session cleared)

## Customization

### Adding New Authentication Methods
1. Update the `login` function in `auth-context.tsx`
2. Add new credential validation logic
3. Update LoginScreen UI if needed

### Adding User Data Fields
1. Update the `User` interface in `auth-context.tsx`
2. Update login response handling
3. Update ProfileScreen to display new fields

### Styling Customization
- All components use `useThemeColor` for theme support
- Modify styles in respective screen files
- Colors automatically adapt to light/dark mode

## Error Handling

### Network Errors
- Login function simulates API delay
- Error messages shown via Alert dialogs
- Loading states prevent multiple requests

### Storage Errors
- AsyncStorage errors are caught and logged
- Fallback to unauthenticated state on storage errors
- User prompted to log in again if session invalid

This authentication system provides a solid foundation for user authentication in React Native Expo apps with room for customization and enhancement.