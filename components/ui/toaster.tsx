import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

export type ToastType = 'info' | 'warning' | 'error' | 'success';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 means no auto close
  closable?: boolean;
  onClose?: () => void;
}

interface ToasterItemProps extends ToastProps {
  onRemove: (id: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

const ToasterItem: React.FC<ToasterItemProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  closable = true,
  onClose,
  onRemove,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100)); // Slide from top

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto close timer
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    onClose?.();
    
    // Exit animation - slide back up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(id);
    });
  };

  const getToastStyles = () => {
    const baseStyle = [styles.toast, { backgroundColor }];
    
    switch (type) {
      case 'error':
        return [...baseStyle, styles.errorToast];
      case 'warning':
        return [...baseStyle, styles.warningToast];
      case 'success':
        return [...baseStyle, styles.successToast];
      case 'info':
      default:
        return [...baseStyle, styles.infoToast];
    }
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

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'success':
        return '#10B981';
      case 'info':
      default:
        return '#3B82F6';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={getToastStyles()}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
            <Text style={styles.icon}>{getIconText()}</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            {message && (
              <Text style={[styles.message, { color: textColor }]}>{message}</Text>
            )}
          </View>
          
          {closable && (
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={[styles.closeText, { color: textColor }]}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export interface ToasterProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.toasterContainer}>
      {toasts.map((toast) => (
        <ToasterItem
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toasterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  container: {
    marginBottom: 8,
  },
  toast: {
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  infoToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  successToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  warningToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  errorToast: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.6,
  },
});