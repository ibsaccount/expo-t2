# Alert Modal Component Documentation

## Overview

A generic, customizable alert modal component for React Native Expo applications. Supports dynamic button configurations including OK-only, OK/Cancel, and OK/Cancel/Delete combinations with different button styles.

## Features

- ✅ **Dynamic Button Configuration** - Support for 1, 2, or 3+ buttons
- ✅ **Three Button Styles**:
  - `default` - Blue background (primary action)
  - `cancel` - Transparent background with gray text
  - `destructive` - Red background (dangerous actions)
- ✅ **TextArea Input Support** - Optional textarea with character limit (default 255)
- ✅ **Smooth Animations** - Scale and fade animations for elegant appearance
- ✅ **Theme-aware** - Uses your app's light/dark theme colors
- ✅ **TypeScript Support** - Full type safety
- ✅ **Platform Optimized** - Proper shadows for iOS/Android
- ✅ **Multiple Alerts** - Support for stacked alerts (though not recommended UX)

## Installation

The alert system is already integrated into your app through the `AlertProvider` in your root navigation.

## Usage

### Basic Usage

```tsx
import { useAlert } from '@/components/ui/alert-context';

const MyComponent = () => {
  const { showSimpleAlert, showConfirm, showDeleteConfirm, showTextAreaAlert } = useAlert();

  const handleAction = () => {
    showSimpleAlert('Success!', 'Operation completed successfully');
  };

  const handleInput = () => {
    showTextAreaAlert(
      'Enter Comment',
      'Please provide your feedback:',
      { maxLength: 255, placeholder: 'Type here...' },
      (text) => console.log('User input:', text)
    );
  };

  return (
    <>
      <Button title="Show Alert" onPress={handleAction} />
      <Button title="Text Input" onPress={handleInput} />
    </>
  );
};
```

### Available Methods

#### `showSimpleAlert(title, message?, onOk?)`
Shows a simple alert with just an OK button.

#### `showConfirm(title, message?, onConfirm?, onCancel?)`
Shows a confirmation dialog with Cancel and OK buttons.

#### `showDeleteConfirm(title, message?, onDelete?, onCancel?)`
Shows a three-button confirmation with Cancel, OK, and Delete buttons.

#### `showTextAreaAlert(title, message?, textAreaConfig?, onSubmit?, onCancel?)`
Shows an alert with a textarea input field for text entry with character limit.

#### `showAlert(options)`
Generic method for custom button configurations.

#### `hideAlert(id)` & `hideAllAlerts()`
Manually control alert visibility.

### Button Configuration

```typescript
interface AlertButton {
  text: string;                    // Button label
  style?: AlertButtonStyle;        // 'default' | 'cancel' | 'destructive'
  onPress?: (inputValue?: string) => void; // Button callback (receives input if textarea present)
}

interface AlertTextAreaConfig {
  placeholder?: string;            // Input placeholder text
  defaultValue?: string;           // Initial input value
  maxLength?: number;             // Character limit (default: 255)
  multiline?: boolean;            // Allow multiple lines (default: true)
}

type AlertButtonStyle = 'default' | 'cancel' | 'destructive';
```

### Examples

#### Simple OK Alert
```tsx
showSimpleAlert(
  'Welcome!', 
  'Thanks for using our app',
  () => console.log('OK pressed')
);
```

#### Confirmation Dialog
```tsx
showConfirm(
  'Save Changes?',
  'Do you want to save your changes?',
  () => {
    // Save logic
    console.log('Changes saved');
  },
  () => {
    // Cancel logic
    console.log('Changes discarded');
  }
);
```

#### Delete Confirmation
```tsx
showDeleteConfirm(
  'Delete Item',
  'This action cannot be undone. Are you sure?',
  () => {
    // Delete logic
    console.log('Item deleted');
  },
  () => {
    console.log('Delete cancelled');
  }
);
```

#### Custom Alert with 3+ Buttons
```tsx
const { showAlert } = useAlert();

showAlert({
  title: 'Choose Action',
  message: 'What would you like to do?',
  buttons: [
    {
      text: 'Maybe',
      style: 'cancel',
      onPress: () => console.log('Maybe selected'),
    },
    {
      text: 'Yes',
      style: 'default',
      onPress: () => console.log('Yes selected'),
    },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: () => console.log('Delete selected'),
    },
  ],
});
```

#### TextArea Alert (Simple)
```tsx
showTextAreaAlert(
  'Add Comment',
  'Please enter your feedback:',
  {
    placeholder: 'Type your comment...',
    maxLength: 255,
  },
  (inputText) => {
    console.log('User entered:', inputText);
    // Handle the submitted text
  },
  () => {
    console.log('User cancelled input');
  }
);
```

#### TextArea Alert (Custom Configuration)
```tsx
showAlert({
  title: 'Report Issue',
  message: 'Please describe the problem:',
  textArea: {
    placeholder: 'Describe the issue in detail...',
    maxLength: 500,
    multiline: true,
    defaultValue: 'Issue: ',
  },
  buttons: [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => console.log('Cancelled'),
    },
    {
      text: 'Save Draft',
      style: 'default',
      onPress: (text) => console.log('Draft saved:', text),
    },
    {
      text: 'Submit',
      style: 'default',
      onPress: (text) => console.log('Report submitted:', text),
    },
  ],
});
```

#### Custom Alert with Many Buttons
```tsx
showAlert({
  title: 'Select Option',
  buttons: [
    { text: 'Option 1', style: 'cancel' },
    { text: 'Option 2', style: 'default' },
    { text: 'Option 3', style: 'default' },
    { text: 'Delete All', style: 'destructive' },
  ],
});
```

## Button Styles Visual Guide

### Default Button
- **Appearance**: Blue background, white text
- **Use**: Primary/positive actions (OK, Save, Continue, etc.)

### Cancel Button  
- **Appearance**: Transparent background, gray text, gray border
- **Use**: Cancel/neutral actions (Cancel, Maybe, Skip, etc.)

### Destructive Button
- **Appearance**: Red background, white text
- **Use**: Dangerous/irreversible actions (Delete, Remove, Clear, etc.)

## Button Layout

- **1 Button**: Full width with rounded corners
- **2 Buttons**: Side by side, left button has left rounded corners, right has right rounded corners
- **3+ Buttons**: Side by side, first has left corners, last has right corners, middle buttons have square corners

## Animation Details

- **Entrance**: Scale from 0.7 to 1.0 + fade in (200ms)
- **Exit**: Scale to 0.7 + fade out (150ms)
- **Background**: Dark overlay with 40% opacity
- **Tap Outside**: Closes the alert

## Integration

The alert system is integrated at the root level of your app:

```tsx
export default function RootNavigator() {
  return (
    <AlertProvider>
      <ToasterProvider>
        <NavigationContainer>
          {/* Your app content */}
        </NavigationContainer>
      </ToasterProvider>
    </AlertProvider>
  );
}
```

## Example Implementation

Check the `HomeScreen.tsx` for complete working examples with all alert types and configurations.

## Best Practices

1. **Limit Buttons**: Keep to 2-3 buttons for best UX
2. **Clear Labels**: Use descriptive button text
3. **Destructive Actions**: Always use `destructive` style for dangerous actions
4. **Cancel Option**: Provide a cancel option for confirmations
5. **Consistent Styling**: Use the predefined styles for consistency