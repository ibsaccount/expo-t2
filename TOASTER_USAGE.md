# Toaster Component Documentation

## Overview

A generic, customizable toaster component for React Native Expo applications. Supports info, warning, error, and success toast types with configurable auto-close and manual close options.

## Features

- ✅ Four toast types: `info`, `success`, `warning`, `error`
- ✅ Configurable auto-close duration
- ✅ Manual close option
- ✅ Theme-aware styling (light/dark mode support)
- ✅ Smooth animations (slide in from left, fade in/out)
- ✅ Maximum toast limit to prevent UI clutter
- ✅ TypeScript support
- ✅ Platform-specific shadows (iOS/Android)

## Installation

The toaster is already integrated into your app through the `ToasterProvider` in your root navigation.

## Usage

### Basic Usage

```tsx
import { useToaster } from '@/components/ui/toaster-context';

const MyComponent = () => {
  const { showInfo, showSuccess, showWarning, showError } = useToaster();

  const handleClick = () => {
    showInfo('Hello!', 'This is an info message');
  };

  return (
    <Button title="Show Toast" onPress={handleClick} />
  );
};
```

### Available Methods

#### `showInfo(title, message?, options?)`
Shows an info toast with a blue theme.

#### `showSuccess(title, message?, options?)`
Shows a success toast with a green theme.

#### `showWarning(title, message?, options?)`
Shows a warning toast with a yellow/orange theme.

#### `showError(title, message?, options?)`
Shows an error toast with a red theme.

#### `showToast(title, message?, options?)`
Generic method that accepts a type parameter.

#### `hideToast(id)`
Manually hide a specific toast by its ID.

#### `hideAllToasts()`
Hide all currently visible toasts.

### Options

```typescript
interface ToastOptions {
  type?: 'info' | 'warning' | 'error' | 'success';
  duration?: number;    // Auto-close duration in ms (0 = no auto-close)
  closable?: boolean;   // Show close button (default: true)
  onClose?: () => void; // Callback when toast is closed
}
```

### Examples

#### Basic Toast
```tsx
showInfo('Welcome!', 'Thanks for using our app');
```

#### Toast with Custom Duration
```tsx
showSuccess('Saved!', 'Your changes have been saved', { 
  duration: 2000 
});
```

#### Toast that Never Auto-closes
```tsx
showWarning('Important!', 'Please read this carefully', { 
  duration: 0 
});
```

#### Toast without Close Button
```tsx
showError('Network Error', 'Please check your connection', { 
  closable: false,
  duration: 5000 
});
```

#### Toast with Callback
```tsx
showInfo('Processing...', 'Please wait', {
  onClose: () => console.log('Toast was closed')
});
```

#### Using the Generic Method
```tsx
const { showToast } = useToaster();

showToast('Custom Toast', 'This is a custom message', {
  type: 'success',
  duration: 3000
});
```

## Customization

### Styling
The toaster uses your app's theme colors defined in `constants/theme.ts` and responds to light/dark mode changes automatically.

### Position
Toasts appear at the top of the screen with proper safe area handling for both iOS and Android.

### Animation
- Entrance: Slides in from left + fade in
- Exit: Slides out to left + fade out
- Duration: 300ms entrance, 250ms exit

### Limits
By default, a maximum of 5 toasts can be shown simultaneously. This can be configured in the `ToasterProvider`:

```tsx
<ToasterProvider maxToasts={3}>
  {children}
</ToasterProvider>
```

## Integration

The toaster is integrated at the root level of your app in `RootNavigation.tsx`:

```tsx
export default function RootNavigator() {
  return (
    <ToasterProvider>
      <NavigationContainer>
        {/* Your app content */}
      </NavigationContainer>
    </ToasterProvider>
  );
}
```

## Example Implementation

Check the `HomeScreen.tsx` for a complete working example with all toast types and different configurations.