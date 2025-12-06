import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, LayoutOption, ThemeOption, AnalyticsMode } from '../types';
import { getAppSettings, saveAppSettings } from '../services/storageService';

interface ThemeContextType {
  theme: ThemeOption;
  layout: LayoutOption;
  analyticsMode: AnalyticsMode;
  enableDummyData: boolean;
  setTheme: (theme: ThemeOption) => void;
  setLayout: (layout: LayoutOption) => void;
  setAnalyticsMode: (mode: AnalyticsMode) => void;
  setEnableDummyData: (enable: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());

  useEffect(() => {
    // We do NOT set document.documentElement attribute here anymore
    // because we want the landing page to stay default (dark).
    // The DashboardLayout will use these values to style itself locally.
    saveAppSettings(settings);
  }, [settings]);

  const setTheme = (theme: ThemeOption) => setSettings(prev => ({ ...prev, theme }));
  const setLayout = (layout: LayoutOption) => setSettings(prev => ({ ...prev, layout }));
  const setAnalyticsMode = (analyticsMode: AnalyticsMode) => setSettings(prev => ({ ...prev, analyticsMode }));
  const setEnableDummyData = (enableDummyData: boolean) => setSettings(prev => ({ ...prev, enableDummyData }));

  return (
    <ThemeContext.Provider value={{ ...settings, setTheme, setLayout, setAnalyticsMode, setEnableDummyData }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};