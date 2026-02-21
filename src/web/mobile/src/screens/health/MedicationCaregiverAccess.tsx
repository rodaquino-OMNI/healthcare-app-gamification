import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Access level type
 */
type AccessLevel = 'view_only' | 'full_access';

/**
 * Caregiver data model
 */
interface Caregiver {
  id: string;
  name: string;
  email: string;
  relationship: string;
  accessLevel: AccessLevel;
}

/**
 * Mock caregivers for development
 */
const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    relationship: 'medication.caregiverAccess.relationMother',
    accessLevel: 'full_access',
  },
  {
    id: '2',
    name: 'Joao Santos',
    email: 'joao.santos@email.com',
    relationship: 'medication.caregiverAccess.relationSpouse',
    accessLevel: 'view_only',
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    relationship: 'medication.caregiverAccess.relationSibling',
    accessLevel: 'view_only',
  },
];

/**
 * MedicationCaregiverAccess allows users to manage caregiver permissions
 * for their medication list, including toggling access levels and revoking access.
 */
export const MedicationCaregiverAccess: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);

  const handleToggleAccess = useCallback(
    (caregiverId: string, newLevel: AccessLevel) => {
      setCaregivers((prev) =>
        prev.map((c) =>
          c.id === caregiverId ? { ...c, accessLevel: newLevel } : c,
        ),
      );
    },
    [],
  );

  const handleRevokeAccess = useCallback(
    (caregiver: Caregiver) => {
      Alert.alert(
        t('medication.caregiverAccess.revokeTitle'),
        t('medication.caregiverAccess.revokeMessage', { name: caregiver.name }),
        [
          { text: t('medication.caregiverAccess.cancel'), style: 'cancel' },
          {
            text: t('medication.caregiverAccess.revoke'),
            style: 'destructive',
            onPress: () => {
              setCaregivers((prev) =>
                prev.filter((c) => c.id !== caregiver.id),
              );
            },
          },
        ],
      );
    },
    [t],
  );

  const handleAddCaregiver = useCallback(() => {
    Alert.alert(
      t('medication.caregiverAccess.addTitle'),
      t('medication.caregiverAccess.addMessage'),
    );
  }, [t]);

  const renderCaregiverItem = useCallback(
    ({ item }: ListRenderItemInfo<Caregiver>) => (
      <Card journey="health" elevation="sm" padding="md">
        {/* Caregiver Info */}
        <View style={styles.caregiverHeader}>
          <View style={styles.caregiverInfo}>
            <Text fontWeight="semiBold" fontSize="lg">
              {item.name}
            </Text>
            <Text fontSize="sm" color={colors.gray[50]}>
              {item.email}
            </Text>
            <Text fontSize="xs" color={colors.gray[40]}>
              {t(item.relationship)}
            </Text>
          </View>
          <Badge
            variant="status"
            status={item.accessLevel === 'full_access' ? 'success' : 'info'}
            accessibilityLabel={
              item.accessLevel === 'full_access'
                ? t('medication.caregiverAccess.fullAccess')
                : t('medication.caregiverAccess.viewOnly')
            }
          >
            {item.accessLevel === 'full_access'
              ? t('medication.caregiverAccess.fullAccess')
              : t('medication.caregiverAccess.viewOnly')}
          </Badge>
        </View>

        {/* Access Level Toggle */}
        <View style={styles.accessToggle}>
          <Touchable
            onPress={() => handleToggleAccess(item.id, 'view_only')}
            accessibilityLabel={t('medication.caregiverAccess.viewOnly')}
            accessibilityRole="button"
            testID={`access-view-only-${item.id}`}
            style={[
              styles.toggleOption,
              item.accessLevel === 'view_only' && styles.toggleOptionActive,
            ]}
          >
            <Text
              fontSize="sm"
              fontWeight={item.accessLevel === 'view_only' ? 'semiBold' : 'regular'}
              color={
                item.accessLevel === 'view_only'
                  ? colors.journeys.health.primary
                  : colors.gray[50]
              }
            >
              {t('medication.caregiverAccess.viewOnly')}
            </Text>
          </Touchable>
          <Touchable
            onPress={() => handleToggleAccess(item.id, 'full_access')}
            accessibilityLabel={t('medication.caregiverAccess.fullAccess')}
            accessibilityRole="button"
            testID={`access-full-${item.id}`}
            style={[
              styles.toggleOption,
              item.accessLevel === 'full_access' && styles.toggleOptionActive,
            ]}
          >
            <Text
              fontSize="sm"
              fontWeight={item.accessLevel === 'full_access' ? 'semiBold' : 'regular'}
              color={
                item.accessLevel === 'full_access'
                  ? colors.journeys.health.primary
                  : colors.gray[50]
              }
            >
              {t('medication.caregiverAccess.fullAccess')}
            </Text>
          </Touchable>
        </View>

        {/* Revoke Access */}
        <Touchable
          onPress={() => handleRevokeAccess(item)}
          accessibilityLabel={t('medication.caregiverAccess.revokeAccess')}
          accessibilityRole="button"
          testID={`revoke-access-${item.id}`}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={colors.semantic.error}
            style={styles.revokeText}
          >
            {t('medication.caregiverAccess.revokeAccess')}
          </Text>
        </Touchable>
      </Card>
    ),
    [handleToggleAccess, handleRevokeAccess, t],
  );

  const keyExtractor = useCallback((item: Caregiver) => item.id, []);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text fontSize="xl" color={colors.gray[40]} textAlign="center">
          {t('medication.caregiverAccess.noCaregiversTitle')}
        </Text>
        <Text fontSize="sm" color={colors.gray[40]} textAlign="center">
          {t('medication.caregiverAccess.noCaregiversMessage')}
        </Text>
      </View>
    ),
    [t],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('medication.back')}
          accessibilityRole="button"
          testID="back-button"
        >
          <Text fontSize="lg" color={colors.journeys.health.primary}>
            {t('medication.back')}
          </Text>
        </Touchable>
        <Text variant="heading" journey="health">
          {t('medication.caregiverAccess.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Caregiver List */}
      <FlatList
        data={caregivers}
        renderItem={renderCaregiverItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        testID="caregiver-list"
      />

      {/* Add Caregiver Button */}
      <View style={styles.addButtonContainer}>
        <Button
          journey="health"
          onPress={handleAddCaregiver}
          accessibilityLabel={t('medication.caregiverAccess.addNewCaregiver')}
          testID="add-caregiver-button"
        >
          {t('medication.caregiverAccess.addNewCaregiver')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.journeys.health.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingTop: spacingValues['3xl'],
    paddingBottom: spacingValues.sm,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues['5xl'],
    gap: spacingValues.sm,
  },
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacingValues.sm,
  },
  caregiverInfo: {
    flex: 1,
    marginRight: spacingValues.sm,
    gap: spacingValues['4xs'],
  },
  accessToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[20],
    overflow: 'hidden',
    marginBottom: spacingValues.sm,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacingValues.xs,
    alignItems: 'center',
    backgroundColor: colors.gray[0],
  },
  toggleOptionActive: {
    backgroundColor: colors.journeys.health.background,
    borderColor: colors.journeys.health.primary,
  },
  revokeText: {
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: spacingValues['5xl'],
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  addButtonContainer: {
    paddingHorizontal: spacingValues.md,
    paddingBottom: spacingValues.xl,
    paddingTop: spacingValues.sm,
  },
});

export default MedicationCaregiverAccess;
