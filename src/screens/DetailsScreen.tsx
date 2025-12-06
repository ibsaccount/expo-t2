import React, {JSX, useLayoutEffect} from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStackNavigator";
import { useFocusEffect } from "@react-navigation/native";
import { useTab } from "../../components/ui/tab-context";

type Props = NativeStackScreenProps<HomeStackParamList, "Details">;

export default function DetailsScreen({ route, navigation }: Props): JSX.Element {
  const { message, hideTabBar } = route.params || {};
  const { activeTab, setActiveTab } = useTab();

  // Use both useFocusEffect and useLayoutEffect for reliable tab bar control
  useFocusEffect(
    React.useCallback(() => {
      console.log('DetailsScreen focused with activeTab:', activeTab);
      // Set tab bar visibility when screen comes into focus
      navigation.getParent()?.setOptions({
        tabBarStyle: hideTabBar ? { display: 'none' } : {},
      });

      // Cleanup when screen loses focus - restore tabs
      return () => {
        console.log('DetailsScreen unfocused with activeTab:', activeTab);
        navigation.getParent()?.setOptions({
          tabBarStyle: {},
        });
      };
    }, [navigation, hideTabBar, activeTab])
  );

  // Also use useLayoutEffect for immediate updates when params change
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: hideTabBar ? { display: 'none' } : {},
    });
  }, [navigation, hideTabBar]);

  const toggleTabBar = () => {
    const newHideTabBar = !hideTabBar;
    
    // Update route params
    navigation.setParams({ 
      hideTabBar: newHideTabBar 
    });
    
    // Immediately update tab bar style
    navigation.getParent()?.setOptions({
      tabBarStyle: newHideTabBar ? { display: 'none' } : {},
    });
  };

  const goBackHome = () => {
    console.log('DetailsScreen navigating back with activeTab:', activeTab);
    navigation.goBack();
  };

  const testTabSync = () => {
    const newTab = activeTab === 'me' ? 'team' : 'me';
    console.log('DetailsScreen changing tab from', activeTab, 'to', newTab);
    setActiveTab(newTab);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      
      {message && (
        <Text style={styles.message}>Message: {message}</Text>
      )}
      
      <Text style={styles.status}>
        Tab Bar Status: {hideTabBar ? 'Hidden' : 'Visible'}
      </Text>
      
      <Text style={styles.status}>
        Current Active Tab: {activeTab}
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title={`Switch to ${activeTab === 'me' ? 'Team' : 'Me'} Tab`}
          onPress={testTabSync}
        />
        <Button
          title={hideTabBar ? "Show Tab Bar" : "Hide Tab Bar"}
          onPress={toggleTabBar}
        />
        <Button
          title="Go Back to Home"
          onPress={goBackHome}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  status: {
    fontSize: 14,
    marginBottom: 20,
    fontStyle: "italic",
    color: "gray",
  },
  buttonContainer: {
    gap: 15,
    width: "100%",
    maxWidth: 200,
  },
});
