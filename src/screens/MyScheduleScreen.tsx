import React, { JSX, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../components/ui/auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  description: string;
  type: 'meeting' | 'task' | 'event';
}

export default function MyScheduleScreen(): JSX.Element {
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [scheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Team Meeting',
      time: '09:00 AM',
      description: 'Weekly team standup meeting',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Project Review',
      time: '11:30 AM',
      description: 'Review project progress and deliverables',
      type: 'meeting'
    },
    {
      id: '3',
      title: 'Complete Report',
      time: '02:00 PM',
      description: 'Finish monthly activity report',
      type: 'task'
    },
    {
      id: '4',
      title: 'Training Session',
      time: '04:00 PM',
      description: 'New employee orientation',
      type: 'event'
    }
  ]);

  const getIconName = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'meeting':
        return 'people';
      case 'task':
        return 'checkmark-circle';
      case 'event':
        return 'calendar';
      default:
        return 'time';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'meeting':
        return '#007AFF';
      case 'task':
        return '#FF9500';
      case 'event':
        return '#34C759';
      default:
        return tintColor;
    }
  };

  const handleItemPress = (item: ScheduleItem) => {
    Alert.alert(
      item.title,
      `Time: ${item.time}\nDescription: ${item.description}`,
      [
        { text: 'Edit', onPress: () => Alert.alert('Info', 'Edit functionality coming soon') },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Info', 'Delete functionality coming soon') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAddSchedule = () => {
    Alert.alert('Add Schedule', 'Add new schedule functionality coming soon');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Schedule</Text>
        <Text style={[styles.subtitle, { color: textColor + '80' }]}>
          Welcome back, {user?.username}
        </Text>
      </View>

      <View style={styles.dateSection}>
        <Text style={[styles.dateText, { color: textColor }]}>
          Today - {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ScrollView style={styles.scheduleList} showsVerticalScrollIndicator={false}>
        {scheduleItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.scheduleItem, { backgroundColor: backgroundColor, borderColor: textColor + '20' }]}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.scheduleItemHeader}>
              <View style={styles.scheduleItemInfo}>
                <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]}>
                  <Ionicons name={getIconName(item.type)} size={16} color="white" />
                </View>
                <View style={styles.scheduleItemContent}>
                  <Text style={[styles.scheduleTitle, { color: textColor }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.scheduleDescription, { color: textColor + '80' }]}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <Text style={[styles.scheduleTime, { color: tintColor }]}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: tintColor }]}
        onPress={handleAddSchedule}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Schedule</Text>
      </TouchableOpacity>
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
  dateSection: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleList: {
    flex: 1,
    marginBottom: 20,
  },
  scheduleItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleItemInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  typeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleItemContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});