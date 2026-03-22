/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { Avatar } from '@design-system/components/Avatar/Avatar';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@design-system/tokens/colors';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';

import { ProfileForm } from '../../components/forms/ProfileForm';
import { useAuth } from '../../hooks/useAuth';
import type { SettingsStackParamList } from '../../navigation/types';

interface TokenUser {
    name?: string;
    email?: string;
    avatar?: string;
}

/**
 * Displays the user profile screen, allowing users to view and edit their profile information.
 * It integrates with the authentication context to retrieve and update user data.
 */
export const ProfileScreen: React.FC = () => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const { t } = useTranslation();
    const { session, getUserFromToken } = useAuth();
    const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
    const [isEditing, setIsEditing] = useState(false);

    // Get user data from the JWT token
    const user = session?.accessToken ? (getUserFromToken(session.accessToken) as TokenUser) : null;

    const handleEditToggle = (): void => {
        setIsEditing(!isEditing);
    };

    const navigateToSettings = () => {
        navigation.navigate('SettingsMain');
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{t('profile.errorNotAvailable')}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar
                    src={user.avatar}
                    name={user.name || t('profile.defaultUser')}
                    size="80px"
                    journey="health" // Default to health journey
                    fallbackType={user.name ? 'initials' : 'icon'}
                />

                {!isEditing && (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name || t('profile.defaultUser')}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                )}
            </View>

            {isEditing ? (
                <View style={styles.formContainer}>
                    <ProfileForm />
                    <TouchableOpacity style={styles.cancelButton} onPress={handleEditToggle}>
                        <Text style={styles.cancelButtonText}>{t('common.buttons.cancel')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleEditToggle}>
                        <Text style={styles.actionButtonText}>{t('profile.editProfile')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={navigateToSettings}>
                        <Text style={styles.actionButtonText}>{t('profile.settings')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.colors.background.default,
        },
        header: {
            alignItems: 'center',
            marginBottom: 20,
        },
        userInfo: {
            alignItems: 'center',
            marginTop: 10,
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        userEmail: {
            fontSize: 16,
            color: theme.colors.text.muted,
        },
        actionsContainer: {
            marginTop: 20,
        },
        actionButton: {
            backgroundColor: colors.brand.primary,
            borderRadius: 8,
            padding: 15,
            alignItems: 'center',
            marginBottom: 10,
        },
        actionButtonText: {
            color: theme.colors.text.onBrand,
            fontSize: 16,
            fontWeight: '500',
        },
        formContainer: {
            marginTop: 20,
        },
        cancelButton: {
            marginTop: 10,
            padding: 15,
            alignItems: 'center',
        },
        cancelButtonText: {
            color: colors.brand.primary,
            fontSize: 16,
        },
        errorContainer: {
            padding: 20,
            borderRadius: 8,
            backgroundColor: colors.semantic.errorBg,
            borderColor: colors.semantic.errorBg,
            borderWidth: 1,
            marginTop: 20,
        },
        errorText: {
            fontSize: 16,
            textAlign: 'center',
            color: colors.semantic.error,
        },
    });
