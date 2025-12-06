import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TabType = 'me' | 'team';

export interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resetToMeTab: () => Promise<void>;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

const TAB_STORAGE_KEY = '@active_tab';

export function TabProvider({ children }: TabProviderProps) {
  const [activeTab, setActiveTabState] = useState<TabType>('me');

  // Load saved tab from AsyncStorage on mount
  useEffect(() => {
    loadSavedTab();
  }, []);

  const loadSavedTab = async () => {
    try {
      const savedTab = await AsyncStorage.getItem(TAB_STORAGE_KEY);
      if (savedTab && (savedTab === 'me' || savedTab === 'team')) {
        setActiveTabState(savedTab as TabType);
      }
    } catch (error) {
      console.error('Error loading saved tab:', error);
    }
  };

  const setActiveTab = async (tab: TabType) => {
    // Prevent unnecessary updates if tab hasn't changed
    if (tab === activeTab) {
      return;
    }

    try {
      await AsyncStorage.setItem(TAB_STORAGE_KEY, tab);
      setActiveTabState(tab);
      console.log('Tab saved and set to:', tab);
    } catch (error) {
      console.error('Error saving tab:', error);
      // Still set the state even if storage fails
      setActiveTabState(tab);
    }
  };

  const resetToMeTab = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(TAB_STORAGE_KEY, 'me');
      setActiveTabState('me');
      console.log('Tab reset to: me');
    } catch (error) {
      console.error('Error resetting tab:', error);
      // Still set the state even if storage fails
      setActiveTabState('me');
    }
  };

  const value: TabContextType = {
    activeTab,
    setActiveTab,
    resetToMeTab,
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab(): TabContextType {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
}

export { TabContext };