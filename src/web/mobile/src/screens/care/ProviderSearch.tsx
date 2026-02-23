import React, { useState, useEffect, useCallback } from 'react'; // React v18.0+
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // v6.0+

import { searchProviders } from '@api/care';
import { Provider } from '@shared/types/care.types';
import { Card, CardProps } from '@design-system/components/Card/Card';
import { Input, InputProps } from '@design-system/components/Input';
import { Button, ButtonProps } from '@design-system/components/Button/Button';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { JOURNEY_COLORS } from '@constants/journeys';
import { JourneyHeader, JourneyHeaderProps } from '@components/shared/JourneyHeader';
import { useAuth } from '@hooks/useAuth';
import { LoadingIndicator } from '@components/shared/LoadingIndicator';
import { ErrorState } from '@components/shared/ErrorState';
import { useTranslation } from 'react-i18next';

/**
 * A screen component that allows users to search for healthcare providers.
 *
 * @returns {JSX.Element} The rendered ProviderSearchScreen component.
 */
const ProviderSearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  // LD1: Initialize state variables for location, providers, loading, and error.
  const [location, setLocation] = useState<string>('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // LD1: Retrieve the JWT token from the authentication context using the useAuth hook.
  const { session } = useAuth();

  // LD1: Use the navigation hook to access navigation functions.
  const navigation = useNavigation();

  // LD1: Define a memoized searchProviders function using useCallback to fetch providers based on the location.
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // LD1: Call the searchProviders API function to fetch providers based on the location.
      const providerList = await searchProviders({ location });
      setProviders(providerList);
    } catch (e: any) {
      // LD1: Set the error state if an error occurs during the provider search.
      setError(e.message || t('journeys.care.providerSearch.fetchError'));
      setProviders([]);
    } finally {
      // LD1: Set the loading state to false after the provider search is complete.
      setLoading(false);
    }
  }, [location, session]);

  // LD1: Use useEffect to trigger the initial provider search when the component mounts.
  useEffect(() => {
    // LD1: Call the handleSearch function to perform the initial provider search.
    handleSearch();
  }, [handleSearch]);

  // LD1: Render the ProviderSearchScreen component.
  return (
    <View style={styles.container}>
      {/* LD1: Render a JourneyHeader with the title 'Find a Provider'. */}
      <JourneyHeader title={t('journeys.care.providerSearch.title')} />

      {/* LD1: Render an Input component for entering the location. */}
      <Input
        placeholder={t('journeys.care.providerSearch.enterLocation')}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        accessibilityLabel="Enter location to search for providers"
      />

      {/* LD1: Render a Button component to trigger the provider search. */}
      <Button
        title={t('common.buttons.search')}
        onPress={handleSearch}
        disabled={loading}
        journey="care"
        accessibilityLabel={t('journeys.care.providerSearch.searchAccessibility')}
      >
        {t('common.buttons.search')}
      </Button>

      {/* LD1: Conditionally render a LoadingIndicator while the providers are being fetched. */}
      {loading && <LoadingIndicator journey="care" label={t('journeys.care.providerSearch.searching')} />}

      {/* LD1: Conditionally render an ErrorState if an error occurs during the provider search. */}
      {error && <ErrorState message={error} />}

      {/* LD1: Render a list of Provider components if the providers are successfully fetched. */}
      {providers.map((provider) => (
        <Card key={provider.id} journey="care">
          {provider.name}
        </Card>
      ))}
    </View>
  );
};

// LD1: Define the styles for the ProviderSearchScreen component.
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background.default,
  },
});

// IE3: Be generous about your exports so long as it doesn't create a security risk.
export default ProviderSearchScreen;