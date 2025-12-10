import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import MyScheduleScreen from '../screens/MyScheduleScreen'
import TimecardScreen from '../screens/TimecardScreen';
import MenuScreen from '../screens/MenuScreen';
import LoginScreen from '../screens/LoginScreen';
import { Ionicons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import { ToasterProvider } from "../../components/ui/toaster-context";
import { AlertProvider } from "../../components/ui/alert-context";
import { AuthProvider, useAuth } from "../../components/ui/auth-context";
import { TabProvider, useTab } from "../../components/ui/tab-context";
import { useThemeColor } from "../../hooks/use-theme-color";

export type BottomTabParamList = {
  Home: undefined;
  MySchedule: undefined;
  Timecard: undefined;
  Menu: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Loading screen component
function LoadingScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.loadingContainer, { backgroundColor }]}>
      <ActivityIndicator size="large" color={tintColor} />
    </View>
  );
}

// Main app navigation component
function AppNavigation() {
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const { resetToMeTab } = useTab();
  const hasResetOnLogin = React.useRef(false);

  // Reset tab to 'me' only once when user first logs in
  React.useEffect(() => {
    if (isAuthenticated && user && !hasResetOnLogin.current) {
      console.log('User logged in for first time, resetting tab to me');
      resetToMeTab();
      hasResetOnLogin.current = true;
    } else if (!isAuthenticated && !user) {
      console.log('User logged out, preparing for next login reset');
      hasResetOnLogin.current = false;
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "MySchedule") iconName = "calendar";
          else if (route.name === "Timecard") iconName = "time";
          else if (route.name === "Menu") iconName = "menu";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}>
     <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="MySchedule" 
        component={MyScheduleScreen}
        options={{ title: "My Schedule" }}
      />
      <Tab.Screen 
        name="Timecard" 
        component={TimecardScreen}
        options={{ 
          title: user?.role === 'admin' ? 'Time Cards' : 'Time Card'
        }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen} 
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator(): React.ReactElement {
  return (
    <AuthProvider>
      <AlertProvider>
        <ToasterProvider>
          <TabProvider>
            <NavigationContainer>
              <AppNavigation />
            </NavigationContainer>
          </TabProvider>
        </ToasterProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
