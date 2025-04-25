import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // v6.x
import { useAuth } from '../../hooks/useAuth';
import { useJourney } from '../../hooks/useJourney';
import { ROUTES } from '../../constants/routes';

/**
 * Displays the settings screen with options to manage profile and app settings.
 * Implements the "Preferences & Settings" requirement from User Management Features.
 */
export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { journey } = useJourney();

  // Get journey-specific color for theming
  const getJourneyColor = () => {
    switch(journey) {
      case 'health':
        return '#0ACF83'; // Green for Health journey
      case 'care':
        return '#FF8C42'; // Orange for Care journey
      case 'plan':
        return '#3A86FF'; // Blue for Plan journey
      default:
        return '#0066CC'; // Default brand color
    }
  };

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation to login screen is handled by the auth state change
    } catch (error) {
      console.error('Error signing out:', error);
      // Show error message to user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: getJourneyColor() }]}>Conta</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate(ROUTES.PROFILE)}
      >
        <Text style={styles.settingText}>Perfil Pessoal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate(ROUTES.AUTH_MFA)}
      >
        <Text style={styles.settingText}>Autenticação de Dois Fatores</Text>
      </TouchableOpacity>
      
      <Text style={[styles.sectionTitle, { color: getJourneyColor() }]}>Preferências</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
      >
        <Text style={styles.settingText}>Notificações</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => {/* Will navigate to language settings */}}
      >
        <Text style={styles.settingText}>Idioma</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => {/* Will navigate to privacy settings */}}
      >
        <Text style={styles.settingText}>Privacidade</Text>
      </TouchableOpacity>
      
      <Text style={[styles.sectionTitle, { color: getJourneyColor() }]}>Jornadas</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate(ROUTES.HEALTH_DASHBOARD)}
      >
        <Text style={styles.settingText}>Minha Saúde</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate(ROUTES.CARE_DASHBOARD)}
      >
        <Text style={styles.settingText}>Cuidar-me Agora</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate(ROUTES.PLAN_DASHBOARD)}
      >
        <Text style={styles.settingText}>Meu Plano & Benefícios</Text>
      </TouchableOpacity>
      
      <Text style={[styles.sectionTitle, { color: getJourneyColor() }]}>Suporte</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => {/* Will navigate to help center */}}
      >
        <Text style={styles.settingText}>Central de Ajuda</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => {/* Will navigate to terms and conditions */}}
      >
        <Text style={styles.settingText}>Termos e Condições</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => {/* Will navigate to about app */}}
      >
        <Text style={styles.settingText}>Sobre o App</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.settingItem, { marginTop: 30, borderTopWidth: 1, borderTopColor: '#eee' }]}
        onPress={handleSignOut}
      >
        <Text style={[styles.settingText, { color: '#FF3B30' }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
  },
});