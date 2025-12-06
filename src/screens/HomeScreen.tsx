import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from "../../components/ui/auth-context";
import { useTab } from "../../components/ui/tab-context";
import { useThemeColor } from "@/hooks/use-theme-color";

const Tab = createMaterialTopTabNavigator();

// Me Tab Content
function MeHomeContent() {
  const { user } = useAuth();
  const { activeTab } = useTab();
  const navigation = useNavigation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const navigateToDetails = () => {
    console.log('MeHomeContent navigating to Details with activeTab:', activeTab);
    // @ts-ignore - navigation type will be resolved at runtime
    navigation.navigate('Details', { 
      message: `Navigated from Me tab (activeTab: ${activeTab})`,
      hideTabBar: false 
    });
  };

  return (
    <View style={[styles.tabContent, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>My Dashboard</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>
        Welcome back, {user?.username}!
      </Text>
      <Text style={[styles.description, { color: textColor }]}>
        Here you can view your personal dashboard, tasks, and activities.
      </Text>
      <Text style={[styles.debugText, { color: textColor }]}>
        Current active tab: {activeTab}
      </Text>
      
      <TouchableOpacity 
        style={[styles.navigateButton, { backgroundColor: tintColor }]}
        onPress={navigateToDetails}
      >
        <Text style={[styles.buttonText, { color: backgroundColor }]}>
          Navigate to Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Team Tab Content  
function TeamHomeContent() {
  const { user } = useAuth();
  const { activeTab } = useTab();
  const navigation = useNavigation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const navigateToDetails = () => {
    console.log('TeamHomeContent navigating to Details with activeTab:', activeTab);
    // @ts-ignore - navigation type will be resolved at runtime
    navigation.navigate('Details', { 
      message: `Navigated from My Team tab (activeTab: ${activeTab})`,
      hideTabBar: false 
    });
  };

  return (
    <View style={[styles.tabContent, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Team Dashboard</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>
        Manage your team, {user?.username}
      </Text>
      <Text style={[styles.description, { color: textColor }]}>
        View team performance, assign tasks, and monitor team activities.
      </Text>
      <Text style={[styles.debugText, { color: textColor }]}>
        Current active tab: {activeTab}
      </Text>
      
      <TouchableOpacity 
        style={[styles.navigateButton, { backgroundColor: tintColor }]}
        onPress={navigateToDetails}
      >
        <Text style={[styles.buttonText, { color: backgroundColor }]}>
          Navigate to Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const navigationRef = useRef<any>(null);

  // Navigate to correct tab when screen is focused, but only if different
  useFocusEffect(
    React.useCallback(() => {
      if (navigationRef.current && user?.role === 'admin') {
        const targetRoute = activeTab === 'me' ? 'Me' : 'MyTeam';
        
        // Check if we're already on the correct route to prevent unnecessary navigation
        const currentRoute = navigationRef.current.getCurrentRoute?.()?.name;
        if (currentRoute !== targetRoute) {
          console.log('HomeScreen focused - navigating from', currentRoute, 'to:', targetRoute);
          try {
            navigationRef.current.navigate(targetRoute);
          } catch (error) {
            console.log('HomeScreen navigation error:', error);
          }
        } else {
          console.log('HomeScreen focused - already on correct tab:', targetRoute);
        }
      }
    }, [activeTab, user?.role])
  );

  // Show simple view for employees
  if (user?.role === 'employee') {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Dashboard Home</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Welcome back, {user?.username}!
        </Text>
        <Text style={[styles.description, { color: textColor }]}>
          Here you can view your personal dashboard, tasks, and activities.
        </Text>
      </View>
    );
  }

  // Show tabs for admins
  const initialRoute = activeTab === 'me' ? 'Me' : 'MyTeam';
  
  return (
    <Tab.Navigator
      key="home-material-tabs"
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: textColor + '80',
        tabBarIndicatorStyle: { backgroundColor: tintColor },
        tabBarStyle: { backgroundColor },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 14 },
      }}
      screenListeners={({ navigation }) => {
        // Store navigation reference
        navigationRef.current = navigation;
        
        return {
          state: (e) => {
            if (e.data.state) {
              const routeName = e.data.state.routeNames[e.data.state.index];
              const newTab = routeName === 'Me' ? 'me' : 'team';
              
              // Only update if the tab actually changed to prevent loops
              if (newTab !== activeTab) {
                console.log('HomeScreen tab changed to:', newTab);
                setActiveTab(newTab);
              }
            }
          }
        };
      }}
    >
      <Tab.Screen 
        name="Me" 
        component={MeHomeContent}
        options={{ title: 'Me' }}
      />
      <Tab.Screen 
        name="MyTeam" 
        component={TeamHomeContent}
        options={{ title: 'My Team' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  navigateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
