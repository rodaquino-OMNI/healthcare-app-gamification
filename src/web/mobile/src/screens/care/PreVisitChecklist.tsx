import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { ProgressBar } from '@austa/design-system/src/components/ProgressBar/ProgressBar';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '@constants/routes';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

interface RouteParams {
  appointmentId: string;
  appointmentType: string;
}

interface ChecklistItem {
  id: string;
  labelKey: string;
  required: boolean;
  telemedicineOnly?: boolean;
  inPersonOnly?: boolean;
}

const MOCK_APPOINTMENT = {
  doctorName: 'Dra. Ana Carolina Silva',
  specialty: 'Cardiologia',
  date: '05 Mar 2026',
  time: '09:00',
};

const DOCUMENTS_ITEMS: ChecklistItem[] = [
  { id: 'doc-id', labelKey: 'consultation.preVisitChecklist.idCard', required: true },
  { id: 'doc-insurance', labelKey: 'consultation.preVisitChecklist.insuranceCard', required: true },
  { id: 'doc-referral', labelKey: 'consultation.preVisitChecklist.referral', required: false },
];

const HEALTH_ITEMS: ChecklistItem[] = [
  { id: 'health-fasting', labelKey: 'consultation.preVisitChecklist.fasting', required: false },
  { id: 'health-meds', labelKey: 'consultation.preVisitChecklist.medications', required: true },
  { id: 'health-exams', labelKey: 'consultation.preVisitChecklist.examResults', required: false },
];

const LOGISTICS_ITEMS: ChecklistItem[] = [
  { id: 'log-transport', labelKey: 'consultation.preVisitChecklist.transportation', required: true, inPersonOnly: true },
  { id: 'log-address', labelKey: 'consultation.preVisitChecklist.address', required: true, inPersonOnly: true },
  { id: 'log-arrive', labelKey: 'consultation.preVisitChecklist.arriveEarly', required: false, inPersonOnly: true },
  { id: 'log-internet', labelKey: 'consultation.preVisitChecklist.internet', required: true, telemedicineOnly: true },
  { id: 'log-camera', labelKey: 'consultation.preVisitChecklist.camera', required: true, telemedicineOnly: true },
  { id: 'log-quiet', labelKey: 'consultation.preVisitChecklist.quietRoom', required: false, telemedicineOnly: true },
];

const filterItems = (items: ChecklistItem[], type: string): ChecklistItem[] =>
  items.filter((item) => {
    if (item.telemedicineOnly && type !== 'telemedicine') return false;
    if (item.inPersonOnly && type === 'telemedicine') return false;
    return true;
  });

export const PreVisitChecklist: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const { appointmentId, appointmentType } = route.params as RouteParams;

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const documents = useMemo(() => filterItems(DOCUMENTS_ITEMS, appointmentType), [appointmentType]);
  const health = useMemo(() => filterItems(HEALTH_ITEMS, appointmentType), [appointmentType]);
  const logistics = useMemo(() => filterItems(LOGISTICS_ITEMS, appointmentType), [appointmentType]);

  const allItems = useMemo(() => [...documents, ...health, ...logistics], [documents, health, logistics]);
  const requiredItems = useMemo(() => allItems.filter((i) => i.required), [allItems]);
  const totalCount = allItems.length;
  const checkedCount = checkedItems.size;
  const allRequiredChecked = requiredItems.every((i) => checkedItems.has(i.id));

  const toggleItem = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleViewAppointment = useCallback(() => {
    navigation.navigate(ROUTES.CARE_APPOINTMENTS, { id: appointmentId });
  }, [navigation, appointmentId]);

  const renderChecklistItem = (item: ChecklistItem) => {
    const isChecked = checkedItems.has(item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.checklistItem}
        onPress={() => toggleItem(item.id)}
        accessibilityLabel={t(item.labelKey)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
        testID={`checklist-${item.id}`}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text fontSize="sm" color={colors.neutral.white}>{'V'}</Text>}
        </View>
        <Text
          fontSize="sm"
          color={isChecked ? colors.neutral.gray500 : colors.journeys.care.text}
          style={isChecked ? styles.textStrikethrough : undefined}
        >
          {t(item.labelKey)}
        </Text>
        {item.required && (
          <Text fontSize="sm" color={colors.journeys.care.primary}>*</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (titleKey: string, items: ChecklistItem[], testId: string) => (
    <View style={styles.section} testID={testId}>
      <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
        {t(titleKey)}
      </Text>
      {items.map(renderChecklistItem)}
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text fontSize="lg">{'<-'}</Text>
        </TouchableOpacity>
        <Text fontSize="lg" fontWeight="bold" color={colors.journeys.care.text}>
          {t('consultation.preVisitChecklist.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Card journey="care" elevation="sm">
          <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.text}>
            {MOCK_APPOINTMENT.doctorName}
          </Text>
          <Text fontSize="sm" color={colors.neutral.gray500}>
            {MOCK_APPOINTMENT.specialty}
          </Text>
          <Text fontSize="sm" color={colors.neutral.gray700}>
            {MOCK_APPOINTMENT.date} - {MOCK_APPOINTMENT.time}
          </Text>
        </Card>

        <View style={styles.progressSection}>
          <Text fontSize="sm" color={colors.journeys.care.text}>
            {t('consultation.preVisitChecklist.progress')}: {checkedCount}/{totalCount}
          </Text>
          <ProgressBar
            value={totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}
            journey="care"
            accessibilityLabel={`${checkedCount} ${t('consultation.preVisitChecklist.progress')} ${totalCount}`}
            testID="progress-bar"
          />
        </View>

        {renderSection('consultation.preVisitChecklist.documents', documents, 'section-documents')}
        {renderSection('consultation.preVisitChecklist.health', health, 'section-health')}
        {renderSection('consultation.preVisitChecklist.logistics', logistics, 'section-logistics')}

        {allRequiredChecked && (
          <View style={styles.successBox}>
            <Text fontSize="md" fontWeight="bold" color={colors.journeys.care.primary} textAlign="center">
              {t('consultation.preVisitChecklist.allSet')}
            </Text>
          </View>
        )}

        <Button
          journey="care"
          variant="primary"
          onPress={handleViewAppointment}
          accessibilityLabel={t('consultation.preVisitChecklist.viewAppointment')}
          testID="view-appointment-button"
        >
          {t('consultation.preVisitChecklist.viewAppointment')}
        </Button>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.journeys.care.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md, paddingTop: spacingValues.lg, paddingBottom: spacingValues.sm,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacingValues.md, paddingBottom: spacingValues['3xl'], gap: spacingValues.md },
  progressSection: { gap: spacingValues.xs },
  section: { gap: spacingValues.xs },
  checklistItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacingValues.sm,
    paddingVertical: spacingValues.xs, paddingHorizontal: spacingValues.sm,
    borderRadius: spacingValues.xs, backgroundColor: theme.colors.background.default,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 2, borderColor: theme.colors.border.default, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.journeys.care.primary, borderColor: colors.journeys.care.primary },
  textStrikethrough: { textDecorationLine: 'line-through' },
  successBox: {
    backgroundColor: colors.journeys.care.primary + '15', borderRadius: spacingValues.xs,
    padding: spacingValues.md,
  },
});

export default PreVisitChecklist;
