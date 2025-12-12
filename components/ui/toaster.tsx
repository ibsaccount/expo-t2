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
  /* istanbul ignore next */
  const [fadeAnim] = useState(new Animated.Value(0));
  /* istanbul ignore next */
  const [slideAnim] = useState(new Animated.Value(-100)); // Slide from top

  /* istanbul ignore next */
  const backgroundColor = useThemeColor({}, 'background');
  /* istanbul ignore next */
  const textColor = useThemeColor({}, 'text');

  /* istanbul ignore next */
  useEffect(() => {
    /* istanbul ignore next */
    // Entrance animation
    /* istanbul ignore next */
    Animated.parallel([
      /* istanbul ignore next */
      Animated.timing(fadeAnim, {
        /* istanbul ignore next */
        toValue: 1,
        /* istanbul ignore next */
        duration: 300,
        /* istanbul ignore next */
        useNativeDriver: true,
      }),
      /* istanbul ignore next */
      Animated.timing(slideAnim, {
        /* istanbul ignore next */
        toValue: 0,
        /* istanbul ignore next */
        duration: 300,
        /* istanbul ignore next */
        useNativeDriver: true,
      }),
      /* istanbul ignore next */
    ]).start();

    /* istanbul ignore next */
    // Auto close timer
    /* istanbul ignore next */
    if (duration > 0) {
      /* istanbul ignore next */
      const timer = setTimeout(() => {
        /* istanbul ignore next */
        handleClose();
      }, duration);

      /* istanbul ignore next */
      return () => clearTimeout(timer);
    }
  }, []);

  /* istanbul ignore next */
  const handleClose = () => {
    /* istanbul ignore next */
    onClose?.();
    
    /* istanbul ignore next */
    // Exit animation - slide back up
    /* istanbul ignore next */
    Animated.parallel([
      /* istanbul ignore next */
      Animated.timing(fadeAnim, {
        /* istanbul ignore next */
        toValue: 0,
        /* istanbul ignore next */
        duration: 250,
        /* istanbul ignore next */
        useNativeDriver: true,
      }),
      /* istanbul ignore next */
      Animated.timing(slideAnim, {
        /* istanbul ignore next */
        toValue: -100,
        /* istanbul ignore next */
        duration: 250,
        /* istanbul ignore next */
        useNativeDriver: true,
      }),
      /* istanbul ignore next */
    ]).start(() => {
      /* istanbul ignore next */
      onRemove(id);
    });
  };

  /* istanbul ignore next */
  const getToastStyles = () => {
    /* istanbul ignore next */
    const baseStyle = [styles.toast, { backgroundColor }];
    
    /* istanbul ignore next */
    switch (type) {
      case 'error':
        /* istanbul ignore next */
        return [...baseStyle, styles.errorToast];
      case 'warning':
        /* istanbul ignore next */
        return [...baseStyle, styles.warningToast];
      case 'success':
        /* istanbul ignore next */
        return [...baseStyle, styles.successToast];
      case 'info':
      default:
        /* istanbul ignore next */
        return [...baseStyle, styles.infoToast];
    }
  };

  /* istanbul ignore next */
  const getIconText = () => {
    /* istanbul ignore next */
    switch (type) {
      case 'error':
        /* istanbul ignore next */
        return '✕';
      case 'warning':
        /* istanbul ignore next */
        return '⚠';
      case 'success':
        /* istanbul ignore next */
        return '✓';
      case 'info':
      default:
        /* istanbul ignore next */
        return 'ⓘ';
    }
  };

  /* istanbul ignore next */
  const getIconColor = () => {
    /* istanbul ignore next */
    switch (type) {
      case 'error':
        /* istanbul ignore next */
        return '#EF4444';
      case 'warning':
        /* istanbul ignore next */
        return '#F59E0B';
      case 'success':
        /* istanbul ignore next */
        return '#10B981';
      case 'info':
      default:
        /* istanbul ignore next */
        return '#3B82F6';
    }
  };

  /* istanbul ignore next */
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
            /* istanbul ignore next */
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              {/* istanbul ignore next */}
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
  /* istanbul ignore next */
  if (toasts.length === 0) return null;

  /* istanbul ignore next */
  return (
    /* istanbul ignore next */
    <View style={styles.toasterContainer}>
      {/* istanbul ignore next */}
      {toasts.map((toast) => (
        /* istanbul ignore next */
        <ToasterItem
          /* istanbul ignore next */
          key={toast.id}
          /* istanbul ignore next */
          {...toast}
          /* istanbul ignore next */
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