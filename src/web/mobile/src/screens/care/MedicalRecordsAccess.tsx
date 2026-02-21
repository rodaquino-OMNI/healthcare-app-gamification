import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Share, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '../../../../constants/routes';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

type MedicalRecordsRouteParams = { appointmentId: string };
type RecordType = 'visit_notes' | 'lab_results' | 'prescriptions' | 'imaging' | 'referral';
type FilterTab = 'all' | RecordType;

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: RecordType;
  size: string;
  description: string;
}

const MOCK_RECORDS: MedicalRecord[] = [
  { id: 'rec-001', title: 'Resumo da Consulta - Cardiologia', date: '21/02/2026', type: 'visit_notes', size: '245 KB', description: 'Notas da consulta com Dra. Ana Carolina Silva. Avaliacao cardiovascular completa.' },
  { id: 'rec-002', title: 'Hemograma Completo', date: '20/02/2026', type: 'lab_results', size: '128 KB', description: 'Resultados do exame de sangue. Todos os valores dentro da normalidade.' },
  { id: 'rec-003', title: 'Receita - Losartana 50mg', date: '21/02/2026', type: 'prescriptions', size: '89 KB', description: 'Prescricao de Losartana 50mg, 1x ao dia, por 30 dias.' },
  { id: 'rec-004', title: 'Ecocardiograma', date: '18/02/2026', type: 'imaging', size: '2.3 MB', description: 'Ecocardiograma transtoracico. Fracao de ejecao 65%, sem alteracoes valvares.' },
  { id: 'rec-005', title: 'Perfil Lipidico', date: '20/02/2026', type: 'lab_results', size: '95 KB', description: 'Colesterol total, HDL, LDL e triglicerides. LDL levemente elevado.' },
  { id: 'rec-006', title: 'Encaminhamento - Nutricionista', date: '21/02/2026', type: 'referral', size: '67 KB', description: 'Encaminhamento para avaliacao nutricional e plano alimentar.' },
];

const RECORD_ICONS: Record<RecordType, string> = {
  visit_notes: '\u{1F4CB}', lab_results: '\u{1F9EA}', prescriptions: '\u{1F48A}',
  imaging: '\u{1F4F7}', referral: '\u{1F4E8}',
};

const TYPE_BADGE_STATUS: Record<RecordType, 'info' | 'success' | 'warning' | 'neutral'> = {
  visit_notes: 'info', lab_results: 'success', prescriptions: 'warning',
  imaging: 'info', referral: 'neutral',
};

/**
 * MedicalRecordsAccess screen displays FHIR-compliant medical
 * records from a visit, with filter tabs, record previews,
 * download/share actions, and bulk operations.
 */
const MedicalRecordsAccess: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: MedicalRecordsRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const { appointmentId } = route.params || { appointmentId: 'appt-001' };

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('journeys.care.medicalRecords.filterAll') },
    { key: 'visit_notes', label: t('journeys.care.medicalRecords.filterVisitNotes') },
    { key: 'lab_results', label: t('journeys.care.medicalRecords.filterLabResults') },
    { key: 'prescriptions', label: t('journeys.care.medicalRecords.filterPrescriptions') },
    { key: 'imaging', label: t('journeys.care.medicalRecords.filterImaging') },
  ];

  const filteredRecords = activeTab === 'all'
    ? MOCK_RECORDS
    : MOCK_RECORDS.filter((r) => r.type === activeTab);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedRecordId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedRecords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleDownload = useCallback((rec: MedicalRecord) => {
    Alert.alert(
      t('journeys.care.medicalRecords.downloadTitle'),
      t('journeys.care.medicalRecords.downloadMessage', { title: rec.title }),
      [{ text: t('journeys.care.medicalRecords.ok') }],
    );
  }, [t]);

  const handleShare = useCallback(async (rec: MedicalRecord) => {
    try {
      await Share.share({
        title: rec.title,
        message: t('journeys.care.medicalRecords.shareMessage', { title: rec.title, date: rec.date }),
      });
    } catch { /* User cancelled */ }
  }, [t]);

  const handleSendToDoctor = useCallback((rec: MedicalRecord) => {
    Alert.alert(
      t('journeys.care.medicalRecords.sendToDoctorTitle'),
      t('journeys.care.medicalRecords.sendToDoctorMessage', { title: rec.title }),
      [{ text: t('journeys.care.medicalRecords.cancel'), style: 'cancel' }, { text: t('journeys.care.medicalRecords.send') }],
    );
  }, [t]);

  const handleDownloadAll = useCallback(() => {
    Alert.alert(
      t('journeys.care.medicalRecords.downloadAllTitle'),
      t('journeys.care.medicalRecords.downloadAllMessage', { count: filteredRecords.length }),
      [{ text: t('journeys.care.medicalRecords.ok') }],
    );
  }, [t, filteredRecords]);

  const handleShareSelected = useCallback(async () => {
    if (selectedRecords.size === 0) {
      Alert.alert(t('journeys.care.medicalRecords.noSelectionTitle'), t('journeys.care.medicalRecords.noSelectionMessage'), [{ text: t('journeys.care.medicalRecords.ok') }]);
      return;
    }
    try {
      const titles = MOCK_RECORDS.filter((r) => selectedRecords.has(r.id)).map((r) => r.title).join(', ');
      await Share.share({ title: t('journeys.care.medicalRecords.shareSelectedTitle'), message: t('journeys.care.medicalRecords.shareSelectedMessage', { titles }) });
    } catch { /* User cancelled */ }
  }, [selectedRecords, t]);

  const handleRequestRecords = useCallback(() => {
    Alert.alert(t('journeys.care.medicalRecords.requestTitle'), t('journeys.care.medicalRecords.requestMessage'), [{ text: t('journeys.care.medicalRecords.ok') }]);
  }, [t]);

  const renderRecord = useCallback(({ item }: { item: MedicalRecord }) => {
    const isExpanded = expandedRecordId === item.id;
    const isSelected = selectedRecords.has(item.id);

    return (
      <Card journey="care" elevation="sm">
        <TouchableOpacity
          onPress={() => handleToggleExpand(item.id)}
          style={styles.recordHeader}
          testID={`record-${item.id}`}
          accessibilityLabel={`${item.title}, ${item.date}, ${item.size}`}
          accessibilityRole="button"
        >
          <TouchableOpacity
            onPress={() => handleToggleSelect(item.id)}
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            testID={`select-${item.id}`}
            accessibilityLabel={t('journeys.care.medicalRecords.selectRecord', { title: item.title })}
            accessibilityRole="checkbox"
          >
            {isSelected && (
              <Text fontSize="text-sm" color={colors.neutral.white}>{'\u2713'}</Text>
            )}
          </TouchableOpacity>
          <Text fontSize="md" style={styles.recordIcon}>{RECORD_ICONS[item.type]}</Text>
          <View style={styles.recordInfo}>
            <Text fontSize="text-sm" fontWeight="semiBold" journey="care" numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.recordMeta}>
              <Text fontSize="text-sm" color={colors.neutral.gray600}>{item.date}</Text>
              <Badge variant="status" status={TYPE_BADGE_STATUS[item.type]} testID={`type-badge-${item.id}`}>
                {t(`journeys.care.medicalRecords.type_${item.type}`)}
              </Badge>
              <Text fontSize="text-sm" color={colors.neutral.gray500}>{item.size}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text fontSize="text-sm" color={colors.neutral.gray600} testID={`description-${item.id}`}>
              {item.description}
            </Text>
            <View style={styles.recordActions}>
              <TouchableOpacity onPress={() => handleDownload(item)} style={styles.actionButton} testID={`download-${item.id}`} accessibilityLabel={t('journeys.care.medicalRecords.download')} accessibilityRole="button">
                <Text fontSize="text-sm" fontWeight="semiBold" color={colors.journeys.care.primary}>{t('journeys.care.medicalRecords.download')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionButton} testID={`share-${item.id}`} accessibilityLabel={t('journeys.care.medicalRecords.share')} accessibilityRole="button">
                <Text fontSize="text-sm" fontWeight="semiBold" color={colors.journeys.care.primary}>{t('journeys.care.medicalRecords.share')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSendToDoctor(item)} style={styles.actionButton} testID={`send-doctor-${item.id}`} accessibilityLabel={t('journeys.care.medicalRecords.sendToDoctor')} accessibilityRole="button">
                <Text fontSize="text-sm" fontWeight="semiBold" color={colors.journeys.care.primary}>{t('journeys.care.medicalRecords.sendToDoctor')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Card>
    );
  }, [expandedRecordId, selectedRecords, handleToggleExpand, handleToggleSelect, handleDownload, handleShare, handleSendToDoctor, t]);

  const keyExtractor = useCallback((item: MedicalRecord) => item.id, []);

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text variant="heading" journey="care" testID="records-title">
          {t('journeys.care.medicalRecords.title')}
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView} contentContainerStyle={styles.tabsContent}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            testID={`filter-tab-${tab.key}`}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
          >
            <Text
              fontSize="text-sm"
              fontWeight={activeTab === tab.key ? 'semiBold' : 'regular'}
              color={activeTab === tab.key ? colors.journeys.care.primary : colors.neutral.gray600}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bulk Actions */}
      <View style={styles.bulkActions}>
        <TouchableOpacity onPress={handleDownloadAll} testID="download-all-button" accessibilityLabel={t('journeys.care.medicalRecords.downloadAll')} accessibilityRole="button">
          <Text fontSize="text-sm" fontWeight="semiBold" color={colors.journeys.care.primary}>
            {t('journeys.care.medicalRecords.downloadAll')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareSelected} testID="share-selected-button" accessibilityLabel={t('journeys.care.medicalRecords.shareSelected', { count: selectedRecords.size })} accessibilityRole="button">
          <Text fontSize="text-sm" fontWeight="semiBold" color={colors.journeys.care.primary}>
            {t('journeys.care.medicalRecords.shareSelected', { count: selectedRecords.size })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Records List */}
      <FlatList
        data={filteredRecords}
        renderItem={renderRecord}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        testID="records-list"
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text fontSize="text-sm" color={colors.neutral.gray500} textAlign="center" testID="fhir-notice">
          {t('journeys.care.medicalRecords.fhirNotice')}
        </Text>
        <Button onPress={handleRequestRecords} journey="care" variant="secondary" testID="request-records-button" accessibilityLabel={t('journeys.care.medicalRecords.requestRecords')}>
          {t('journeys.care.medicalRecords.requestRecords')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  titleContainer: {
    padding: spacingValues.md,
    paddingBottom: spacingValues.xs,
  },
  tabsScrollView: {
    maxHeight: 44,
  },
  tabsContent: {
    paddingHorizontal: spacingValues.md,
    gap: spacingValues.xs,
  },
  tab: {
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    borderRadius: spacingValues.lg,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  tabActive: {
    backgroundColor: colors.journeys.care.background,
    borderColor: colors.journeys.care.primary,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
  },
  list: { flex: 1 },
  listContent: {
    padding: spacingValues.md,
    paddingTop: 0,
    gap: spacingValues.sm,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: spacingValues['3xs'],
    borderWidth: 2,
    borderColor: colors.neutral.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.journeys.care.primary,
    borderColor: colors.journeys.care.primary,
  },
  recordIcon: { width: 28, textAlign: 'center' },
  recordInfo: { flex: 1, gap: spacingValues['4xs'] },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.xs,
  },
  expandedContent: {
    marginTop: spacingValues.sm,
    paddingTop: spacingValues.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
    gap: spacingValues.sm,
  },
  recordActions: { flexDirection: 'row', gap: spacingValues.md },
  actionButton: { paddingVertical: spacingValues['3xs'] },
  bottomSection: {
    padding: spacingValues.md,
    gap: spacingValues.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
});

export { MedicalRecordsAccess };
export default MedicalRecordsAccess;
