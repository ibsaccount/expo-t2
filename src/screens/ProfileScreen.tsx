import React, { JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../components/ui/auth-context";
import { useThemeColor } from "../../hooks/use-theme-color";

export default function ProfileScreen(): JSX.Element {
  const { user, logout } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Profile</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={[styles.label, { color: textColor }]}>Username:</Text>
            <Text style={[styles.value, { color: textColor }]}>{user.username}</Text>
            
            {user.email && (
              <>
                <Text style={[styles.label, { color: textColor }]}>Email:</Text>
                <Text style={[styles.value, { color: textColor }]}>{user.email}</Text>
              </>
            )}
            
            <Text style={[styles.label, { color: textColor }]}>User ID:</Text>
            <Text style={[styles.value, { color: textColor }]}>{user.id}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: tintColor }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  userInfo: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  logoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 120,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
