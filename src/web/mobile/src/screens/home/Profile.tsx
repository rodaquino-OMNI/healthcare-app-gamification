import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import ProfileForm from '../../components/forms/ProfileForm';
import Avatar from '../../../design-system/src/components/Avatar/Avatar';
import { ROUTES } from '../../constants/routes';

/**
 * Displays the user profile screen, allowing users to view and edit their profile information.
 * It integrates with the authentication context to retrieve and update user data.
 */
export const ProfileScreen: React.FC = () => {
  const { session, getUserFromToken } = useAuth();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  // Get user data from the JWT token
  const user = session?.accessToken ? getUserFromToken(session.accessToken) : null;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const navigateToSettings = () => {
    navigation.navigate(ROUTES.SETTINGS);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            User information not available. Please login again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar 
          src={user.avatar} 
          name={user.name || 'User'}
          size="80px"
          journey="health" // Default to health journey
          fallbackType={user.name ? 'initials' : 'icon'}
        />
        
        {!isEditing && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
      </View>

      {isEditing ? (
        <View style={styles.formContainer}>
          <ProfileForm />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleEditToggle}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditToggle}
          >
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToSettings}
          >
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
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
    color: '#757575',
  },
  actionsContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
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
    color: '#0066CC',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF3F2',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF3B30',
  },
});