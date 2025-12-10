import React, { JSX, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from "../../components/ui/auth-context";
import { useTab } from "../../components/ui/tab-context";
import { useThemeColor } from "../../hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

interface TimeEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'active' | 'completed';
  employee?: string; // For team view
}

export default function TimecardScreen(): JSX.Element {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const navigationRef = useRef<any>(null);

  // Navigate to correct tab when screen is focused, but only if different
  useFocusEffect(
    React.useCallback(() => {
      if (navigationRef.current && user?.role === 'admin') {
        const targetRoute = activeTab === 'me' ? 'Me' : 'MyTeam';
        
        // Check if we're already on the correct route to prevent unnecessary navigation
        const currentRoute = navigationRef.current.getCurrentRoute?.()?.name;
        if (currentRoute !== targetRoute) {
          console.log('TimecardScreen focused - navigating from', currentRoute, 'to:', targetRoute);
          try {
            navigationRef.current.navigate(targetRoute);
          } catch (error) {
            console.log('TimecardScreen navigation error:', error);
          }
        } else {
          console.log('TimecardScreen focused - already on correct tab:', targetRoute);
        }
      }
    }, [activeTab, user?.role])
  );

  // Show simple view for employees
  if (user?.role === 'employee') {
    return <TimecardContent isTeamView={false} />;
  }

  // Show tabs for admins
  const initialRoute = activeTab === 'me' ? 'Me' : 'MyTeam';
  
  return (
    <Tab.Navigator
      key="timecard-material-tabs"
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: textColor + '80',
        tabBarIndicatorStyle: { backgroundColor: tintColor },
        tabBarStyle: { backgroundColor },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 14 },
        swipeEnabled: false, // Disable swipe switching
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
                console.log('TimecardScreen tab changed to:', newTab);
                setActiveTab(newTab);
              }
            }
          }
        };
      }}
    >
      <Tab.Screen 
        name="Me" 
        children={() => <TimecardContent isTeamView={false} />}
        options={{ title: 'Me' }}
      />
      <Tab.Screen 
        name="MyTeam" 
        children={() => <TimecardContent isTeamView={true} />}
        options={{ title: 'My Team' }}
      />
    </Tab.Navigator>
  );
}

// Main Timecard Content Component
function TimecardContent({ isTeamView }: { isTeamView: boolean }): JSX.Element {
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Different data for personal vs team view
  const getInitialEntries = (): TimeEntry[] => {
    if (isTeamView) {
      return [
        {
          id: '1',
          date: '2025-12-05',
          clockIn: '09:00 AM',
          clockOut: '05:30 PM',
          totalHours: 8.5,
          status: 'completed',
          employee: 'John Doe'
        },
        {
          id: '2',
          date: '2025-12-05',
          clockIn: '08:45 AM',
          clockOut: '05:15 PM',
          totalHours: 8.5,
          status: 'completed',
          employee: 'Jane Smith'
        },
        {
          id: '3',
          date: '2025-12-04',
          clockIn: '09:15 AM',
          clockOut: '06:00 PM',
          totalHours: 8.75,
          status: 'completed',
          employee: 'Mike Johnson'
        },
        {
          id: '4',
          date: '2025-12-04',
          clockIn: '09:30 AM',
          status: 'active',
          employee: 'Sarah Wilson'
        }
      ];
    } else {
      return [
        {
          id: '1',
          date: '2025-12-05',
          clockIn: '09:00 AM',
          clockOut: '05:30 PM',
          totalHours: 8.5,
          status: 'completed'
        },
        {
          id: '2',
          date: '2025-12-04',
          clockIn: '08:45 AM',
          clockOut: '05:15 PM',
          totalHours: 8.5,
          status: 'completed'
        },
        {
          id: '3',
          date: '2025-12-03',
          clockIn: '09:15 AM',
          clockOut: '06:00 PM',
          totalHours: 8.75,
          status: 'completed'
        }
      ];
    }
  };

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(getInitialEntries());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (isTeamView) {
      Alert.alert('Team View', 'Clock in/out actions are not available in team view.');
      return;
    }

    if (isClockedIn) {
      Alert.alert(
        'Clock Out',
        'Are you sure you want to clock out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clock Out',
            onPress: () => {
              setIsClockedIn(false);
              const now = new Date();
              const clockInEntry = timeEntries.find(entry => entry.status === 'active');
              
              if (clockInEntry) {
                const updatedEntries = timeEntries.map(entry => 
                  entry.id === clockInEntry.id 
                    ? {
                        ...entry,
                        clockOut: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        totalHours: 8.0,
                        status: 'completed' as const
                      }
                    : entry
                );
                setTimeEntries(updatedEntries);
              }
              
              Alert.alert('Success', 'You have been clocked out successfully!');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Clock In',
        'Are you sure you want to clock in?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clock In',
            onPress: () => {
              setIsClockedIn(true);
              const now = new Date();
              const newEntry: TimeEntry = {
                id: Date.now().toString(),
                date: now.toISOString().split('T')[0],
                clockIn: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'active'
              };
              setTimeEntries([newEntry, ...timeEntries]);
              Alert.alert('Success', 'You have been clocked in successfully!');
            }
          }
        ]
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalWeeklyHours = () => {
    return timeEntries
      .filter(entry => entry.totalHours)
      .reduce((total, entry) => total + (entry.totalHours || 0), 0)
      .toFixed(1);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          {isTeamView ? 'Team Timecard' : 'My Timecard'}
        </Text>
        <Text style={[styles.subtitle, { color: textColor + '80' }]}>
          {isTeamView ? 'Monitor team work hours' : 'Track your work hours'}
        </Text>
      </View>

      {/* Current Time Display - Only show for personal view */}
      {!isTeamView && (
        <View style={[styles.timeCard, { backgroundColor: backgroundColor, borderColor: textColor + '20' }]}>
          <Text style={[styles.currentTimeLabel, { color: textColor + '80' }]}>
            Current Time
          </Text>
          <Text style={[styles.currentTime, { color: textColor }]}>
            {currentTime}
          </Text>
          <Text style={[styles.dateLabel, { color: textColor + '60' }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      )}

      {/* Clock In/Out Button - Only show for personal view */}
      {!isTeamView && (
        <TouchableOpacity
          style={[
            styles.clockButton,
            { 
              backgroundColor: isClockedIn ? '#FF3B30' : '#34C759',
            }
          ]}
          onPress={handleClockIn}
        >
          <Ionicons 
            name={isClockedIn ? "log-out-outline" : "log-in-outline"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.clockButtonText}>
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Status and Stats */}
      <View style={styles.statsContainer}>
        {!isTeamView && (
          <View style={[styles.statCard, { backgroundColor: backgroundColor, borderColor: textColor + '20' }]}>
            <Text style={[styles.statLabel, { color: textColor + '80' }]}>Status</Text>
            <Text style={[styles.statValue, { color: isClockedIn ? '#34C759' : '#FF9500' }]}>
              {isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </Text>
          </View>
        )}
        
        <View style={[styles.statCard, { backgroundColor: backgroundColor, borderColor: textColor + '20' }]}>
          <Text style={[styles.statLabel, { color: textColor + '80' }]}>
            {isTeamView ? 'Team Hours' : 'Weekly Hours'}
          </Text>
          <Text style={[styles.statValue, { color: tintColor }]}>
            {getTotalWeeklyHours()} hrs
          </Text>
        </View>
      </View>

      {/* Time Entries History */}
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: textColor }]}>
          {isTeamView ? 'Team Entries' : 'Recent Entries'}
        </Text>
      </View>

      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        {timeEntries.map((entry) => (
          <View
            key={entry.id}
            style={[styles.entryItem, { backgroundColor: backgroundColor, borderColor: textColor + '20' }]}
          >
            <View style={styles.entryHeader}>
              <View>
                <Text style={[styles.entryDate, { color: textColor }]}>
                  {formatDate(entry.date)}
                </Text>
                {isTeamView && entry.employee && (
                  <Text style={[styles.employeeName, { color: tintColor }]}>
                    {entry.employee}
                  </Text>
                )}
              </View>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: entry.status === 'active' ? '#34C759' : '#007AFF' }
              ]}>
                <Text style={styles.statusText}>
                  {entry.status === 'active' ? 'Active' : 'Completed'}
                </Text>
              </View>
            </View>
            
            <View style={styles.entryDetails}>
              <View style={styles.entryTime}>
                <Text style={[styles.entryLabel, { color: textColor + '80' }]}>Clock In:</Text>
                <Text style={[styles.entryValue, { color: textColor }]}>{entry.clockIn}</Text>
              </View>
              
              {entry.clockOut && (
                <View style={styles.entryTime}>
                  <Text style={[styles.entryLabel, { color: textColor + '80' }]}>Clock Out:</Text>
                  <Text style={[styles.entryValue, { color: textColor }]}>{entry.clockOut}</Text>
                </View>
              )}
              
              {entry.totalHours && (
                <View style={styles.entryTime}>
                  <Text style={[styles.entryLabel, { color: textColor + '80' }]}>Total:</Text>
                  <Text style={[styles.entryValue, { color: tintColor, fontWeight: '600' }]}>
                    {entry.totalHours} hrs
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  timeCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentTimeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  currentTime: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 14,
  },
  clockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  clockButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyHeader: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  entriesList: {
    flex: 1,
  },
  entryItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  entryDetails: {
    gap: 8,
  },
  entryTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryLabel: {
    fontSize: 14,
  },
  entryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});