import React, { JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from "react-native";
import { useAuth } from "../../components/ui/auth-context";
import { useThemeColor } from "../../hooks/use-theme-color";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function SettingsScreen(): JSX.Element {
  const { user, logout } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const colorScheme = useColorScheme();

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

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will clear all app data. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // You can add data clearing logic here
            Alert.alert('Success', 'App data cleared');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: textColor }]}>
            Logged in as: {user?.username}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.settingButton, { borderColor: textColor + '30' }]}
          onPress={() => Alert.alert('Info', 'Profile editing not implemented yet')}
        >
          <Text style={[styles.settingButtonText, { color: textColor }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: textColor }]}>
            Dark Mode
          </Text>
          <Text style={[styles.settingValue, { color: textColor + '80' }]}>
            {colorScheme === 'dark' ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.settingButton, { borderColor: textColor + '30' }]}
          onPress={() => Alert.alert('Info', 'Notification settings not implemented yet')}
        >
          <Text style={[styles.settingButtonText, { color: textColor }]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Data</Text>
        
        <TouchableOpacity
          style={[styles.settingButton, { borderColor: textColor + '30' }]}
          onPress={handleClearData}
        >
          <Text style={[styles.settingButtonText, { color: textColor }]}>
            Clear App Data
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
  },
  settingButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  logoutSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
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
