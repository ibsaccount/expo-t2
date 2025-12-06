import React, { JSX } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import { useTab } from "../../components/ui/tab-context";
import { useFocusEffect } from "@react-navigation/native";

export type HomeStackParamList = {
  HomeMain: undefined;
  Details: { message?: string; hideTabBar?: boolean };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator(): JSX.Element {
  const { activeTab } = useTab();

  // Listen for focus changes to maintain tab state across the stack
  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeStack focused with activeTab:', activeTab);
      // Tab state is preserved via context, no action needed
      return () => {
        console.log('HomeStack unfocused, activeTab:', activeTab);
      };
    }, [activeTab])
  );

  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          const currentRoute = e.data.state?.routes[e.data.state?.index]?.name;
          console.log('HomeStack navigation state changed, current screen:', currentRoute, 'activeTab:', activeTab);
        }
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: "Home" }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
