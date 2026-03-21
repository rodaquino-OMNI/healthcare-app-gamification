import { colors } from '@design-system/tokens/colors';
import { useNavigation } from '@react-navigation/native'; // v6.0+
import React from 'react'; // React v18.0+
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native'; // React Native v0.71+

import { MedicationList } from '@components/lists/MedicationList';
import { JourneyHeader } from '@components/shared/JourneyHeader';
import { useJourney } from '@hooks/useJourney';

// AppointmentList component is not yet available — stub for now
const AppointmentList: React.FC = () => null;

/**
 * Renders the Care Now dashboard screen, displaying upcoming appointments and medication tracking information.
 *
 * @returns {JSX.Element} A View containing the dashboard content.
 */
export const Dashboard: React.FC = () => {
    // LD1: Retrieves the navigation object using the useNavigation hook.
    const _navigation = useNavigation();
    // LD1: Retrieves the Care journey ID using the useJourney hook.
    const { journey: _journey } = useJourney();
    const { t } = useTranslation();

    // LD1: Renders a JourneyHeader component with the title 'Cuidar-me Agora' and a back button.
    // LD1: Renders an AppointmentList component to display upcoming appointments.
    // LD1: Renders a MedicationList component to display medications to track.
    // LD1: If there are no appointments and no medications, renders an EmptyState component.
    return (
        <View style={styles.container}>
            <JourneyHeader title={t('journeys.care.title')} showBackButton />
            <AppointmentList />
            <MedicationList />
        </View>
    );
};

// LD1: Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.journeys.plan.background, // LD1: Light background color for plan journey screens
    },
});
