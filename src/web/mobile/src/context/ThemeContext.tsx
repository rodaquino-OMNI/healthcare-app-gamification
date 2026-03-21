/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { baseTheme, darkTheme, type Theme } from '@design-system/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ThemeProvider as SCThemeProvider } from 'styled-components/native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    isDark: boolean;
    theme: Theme;
}

const STORAGE_KEY = '@austa/theme-preference';

const ThemeContext = createContext<ThemeContextValue>({
    themeMode: 'system',
    setThemeMode: () => {},
    isDark: false,
    theme: baseTheme,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook return type is complex
export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useRNColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
            if (stored === 'light' || stored === 'dark' || stored === 'system') {
                setThemeModeState(stored);
            }
        });
    }, []);

    const setThemeMode = useCallback((mode: ThemeMode) => {
        setThemeModeState(mode);
        AsyncStorage.setItem(STORAGE_KEY, mode);
    }, []);

    const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
    const theme = isDark ? darkTheme : baseTheme;

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark, theme }}>
            <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
        </ThemeContext.Provider>
    );
};

export { ThemeContext };
