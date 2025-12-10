import React, { JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from "react-native";
import { useAuth } from "../../components/ui/auth-context";
import { useThemeColor } from "../../hooks/use-theme-color";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  rightComponent?: React.ReactNode;
  showArrow?: boolean;
}

export default function MenuScreen(): JSX.Element {
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
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleNotImplemented = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} functionality will be available in a future update.`);
  };

  const profileMenuItems: MenuItem[] = [
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => handleNotImplemented('Edit Profile'),
      showArrow: true,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => handleNotImplemented('Notifications'),
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-outline',
      onPress: () => handleNotImplemented('Privacy & Security'),
      showArrow: true,
    },
  ];

  const workMenuItems: MenuItem[] = [
    {
      id: 'reports',
      title: 'Time Reports',
      icon: 'analytics-outline',
      onPress: () => handleNotImplemented('Time Reports'),
      showArrow: true,
    },
    {
      id: 'teams',
      title: 'My Teams',
      icon: 'people-outline',
      onPress: () => handleNotImplemented('My Teams'),
      showArrow: true,
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: 'folder-outline',
      onPress: () => handleNotImplemented('Projects'),
      showArrow: true,
    },
  ];

  const appMenuItems: MenuItem[] = [
    {
      id: 'darkmode',
      title: 'Dark Mode',
      icon: 'moon-outline',
      onPress: () => handleNotImplemented('Dark Mode Toggle'),
      rightComponent: (
        <Text style={[styles.settingValue, { color: textColor + '80' }]}>
          {colorScheme === 'dark' ? 'Enabled' : 'Disabled'}
        </Text>
      ),
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'language-outline',
      onPress: () => handleNotImplemented('Language Settings'),
      rightComponent: (
        <Text style={[styles.settingValue, { color: textColor + '80' }]}>
          English
        </Text>
      ),
      showArrow: true,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => handleNotImplemented('Help & Support'),
      showArrow: true,
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => handleNotImplemented('About'),
      showArrow: true,
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { borderColor: textColor + '10' }]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: tintColor + '15' }]}>
          <Ionicons name={item.icon} size={20} color={tintColor} />
        </View>
        <Text style={[styles.menuItemTitle, { color: textColor }]}>
          {item.title}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        {item.rightComponent}
        {item.showArrow && (
          <Ionicons name="chevron-forward" size={16} color={textColor + '60'} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
      {/* User Profile Section */}
      <View style={styles.userSection}>
        <View style={[styles.userCard, { backgroundColor: backgroundColor, borderColor: textColor + '20' }]}>
          <View style={[styles.avatarContainer, { backgroundColor: tintColor }]}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: textColor }]}>
              {user?.username}
            </Text>
            {user?.email && (
              <Text style={[styles.userEmail, { color: textColor + '80' }]}>
                {user.email}
              </Text>
            )}
            <Text style={[styles.userRole, { color: tintColor }]}>
              Employee
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Profile</Text>
        {profileMenuItems.map(renderMenuItem)}
      </View>

      {/* Work Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Work</Text>
        {workMenuItems.map(renderMenuItem)}
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>App Settings</Text>
        {appMenuItems.map(renderMenuItem)}
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.versionSection}>
        <Text style={[styles.versionText, { color: textColor + '60' }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userSection: {
    marginBottom: 32,
  },
  userCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 12,
  },
});