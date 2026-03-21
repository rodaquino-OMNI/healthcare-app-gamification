import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const haptic = {
    light: (): Promise<void> => {
        if (Platform.OS === 'ios') {
            return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        return Promise.resolve();
    },
    medium: (): Promise<void> => {
        if (Platform.OS === 'ios') {
            return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        return Promise.resolve();
    },
    success: (): Promise<void> => {
        if (Platform.OS === 'ios') {
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return Promise.resolve();
    },
    warning: (): Promise<void> => {
        if (Platform.OS === 'ios') {
            return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return Promise.resolve();
    },
    selection: (): Promise<void> => {
        if (Platform.OS === 'ios') {
            return Haptics.selectionAsync();
        }
        return Promise.resolve();
    },
};
