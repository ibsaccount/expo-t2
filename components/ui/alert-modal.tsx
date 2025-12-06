import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButton {
  text: string;
  style?: AlertButtonStyle;
  onPress?: (inputValue?: string) => void;
}

export interface AlertTextAreaConfig {
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  multiline?: boolean;
}

export interface AlertProps {
  id: string;
  title: string;
  message?: string;
  buttons: AlertButton[];
  visible: boolean;
  onClose: () => void;
  textArea?: AlertTextAreaConfig;
}

export const AlertModal: React.FC<AlertProps> = ({
  id,
  title,
  message,
  buttons,
  visible,
  onClose,
  textArea,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.7)).current;
  
  const [inputValue, setInputValue] = useState(textArea?.defaultValue || '');

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress(textArea ? inputValue : undefined);
    }
    onClose();
  };

  const getButtonStyle = (button: AlertButton, index: number) => {
    let positionStyle = {};
    let colorStyle = {};
    
    // Position styles
    if (buttons.length === 1) {
      positionStyle = styles.singleButton;
    } else if (buttons.length === 2) {
      positionStyle = index === 0 ? styles.leftButton : styles.rightButton;
    } else {
      if (index === 0) positionStyle = styles.leftButton;
      else if (index === buttons.length - 1) positionStyle = styles.rightButton;
      else positionStyle = styles.middleButton;
    }

    // Color styles
    switch (button.style) {
      case 'destructive':
        colorStyle = styles.destructiveButton;
        break;
      case 'cancel':
        colorStyle = styles.cancelButton;
        break;
      default:
        colorStyle = styles.defaultButton;
    }

    return [styles.button, positionStyle, colorStyle];
  };

  const getButtonTextStyle = (button: AlertButton) => {
    let textColorStyle = {};
    
    switch (button.style) {
      case 'destructive':
        textColorStyle = styles.destructiveButtonText;
        break;
      case 'cancel':
        textColorStyle = styles.cancelButtonText;
        break;
      default:
        textColorStyle = styles.defaultButtonText;
    }

    return [styles.buttonText, textColorStyle];
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={!!textArea}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            activeOpacity={1}
          />
          
          <Animated.View
            style={[
              styles.alertContainer,
              { backgroundColor },
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            
            {message && (
              <Text style={[styles.message, { color: textColor }]}>{message}</Text>
            )}
            
            {textArea && (
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={[
                    styles.textArea,
                    { 
                      color: textColor,
                      borderColor: textColor + '30',
                    }
                  ]}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder={textArea.placeholder || 'Enter text...'}
                  placeholderTextColor={textColor + '60'}
                  maxLength={textArea.maxLength || 255}
                  multiline={textArea.multiline !== false}
                  textAlignVertical="top"
                />
                <Text style={[styles.characterCount, { color: textColor + '80' }]}>
                  {inputValue.length}/{textArea.maxLength || 255}
                </Text>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={getButtonStyle(button, index)}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text style={getButtonTextStyle(button)}>{button.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 2,
  },
  singleButton: {
    borderRadius: 8,
    marginHorizontal: 0,
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginLeft: 0,
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginRight: 0,
  },
  middleButton: {
    borderRadius: 0,
  },
  defaultButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#999',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  defaultButtonText: {
    color: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#999',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
  textAreaContainer: {
    marginBottom: 15,
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 5,
  },
});