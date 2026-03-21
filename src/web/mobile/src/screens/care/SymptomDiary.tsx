import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { Touchable } from '@austa/design-system/src/primitives/Touchable/Touchable';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, FlatList, TextInput, Alert } from 'react-native';

interface DiaryEntry {
    id: string;
    date: string;
    symptoms: string;
    severity: number;
    notes: string;
}

const MOCK_DIARY_ENTRIES: DiaryEntry[] = [
    { id: 'd1', date: '2026-02-21', symptoms: 'Mild headache, fatigue', severity: 3, notes: 'After long screen time' },
    { id: 'd2', date: '2026-02-20', symptoms: 'Headache, neck stiffness', severity: 5, notes: 'Worse in the morning' },
    {
        id: 'd3',
        date: '2026-02-19',
        symptoms: 'Headache, light sensitivity',
        severity: 6,
        notes: 'Took ibuprofen, improved after 2h',
    },
    {
        id: 'd4',
        date: '2026-02-18',
        symptoms: 'Severe headache, nausea',
        severity: 7,
        notes: 'Had to rest in dark room',
    },
    { id: 'd5', date: '2026-02-17', symptoms: 'Moderate headache', severity: 5, notes: 'Started after lunch' },
    { id: 'd6', date: '2026-02-16', symptoms: 'Mild headache', severity: 3, notes: 'Resolved with hydration' },
    { id: 'd7', date: '2026-02-15', symptoms: 'No symptoms', severity: 1, notes: 'Good day, slept well' },
];

const getSeverityBadgeStatus = (severity: number): 'success' | 'warning' | 'error' => {
    if (severity <= 3) {
        return 'success';
    }
    if (severity <= 6) {
        return 'warning';
    }
    return 'error';
};

const getTrendLabel = (entries: DiaryEntry[]): { label: string; status: 'success' | 'warning' | 'error' } => {
    if (entries.length < 2) {
        return { label: 'Insufficient Data', status: 'warning' };
    }
    const recent = entries.slice(0, 3).reduce((sum, e) => sum + e.severity, 0) / Math.min(entries.length, 3);
    const older = entries.slice(3).reduce((sum, e) => sum + e.severity, 0) / Math.max(entries.length - 3, 1);

    if (recent < older - 0.5) {
        return { label: 'Improving', status: 'success' };
    }
    if (recent > older + 0.5) {
        return { label: 'Worsening', status: 'error' };
    }
    return { label: 'Stable', status: 'warning' };
};

/**
 * Ongoing symptom diary/log.
 * Allows users to track daily symptom entries with severity and notes.
 */
const SymptomDiary: React.FC = () => {
    const { t } = useTranslation();

    const [entries, setEntries] = useState<DiaryEntry[]>(MOCK_DIARY_ENTRIES);
    const [showForm, setShowForm] = useState(false);
    const [newSymptoms, setNewSymptoms] = useState('');
    const [newSeverity, setNewSeverity] = useState(5);
    const [newNotes, setNewNotes] = useState('');

    const trend = getTrendLabel(entries);

    const handleAddEntry = (): void => {
        if (!newSymptoms.trim()) {
            Alert.alert(
                t('journeys.care.symptomChecker.diary.requiredTitle'),
                t('journeys.care.symptomChecker.diary.requiredMessage')
            );
            return;
        }

        const newEntry: DiaryEntry = {
            id: `d-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            symptoms: newSymptoms.trim(),
            severity: newSeverity,
            notes: newNotes.trim(),
        };

        setEntries((prev) => [newEntry, ...prev]);
        setNewSymptoms('');
        setNewSeverity(5);
        setNewNotes('');
        setShowForm(false);
    };

    const renderSeveritySelector = (): React.ReactElement | null => (
        <View style={styles.severitySelector}>
            <Text fontSize="text-sm" color={colors.neutral.gray600}>
                {t('journeys.care.symptomChecker.diary.severity')}: {newSeverity}/10
            </Text>
            <View style={styles.severityButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Touchable
                        key={num}
                        onPress={() => setNewSeverity(num)}
                        accessibilityLabel={`${t('journeys.care.symptomChecker.diary.severity')} ${num}`}
                        accessibilityRole="button"
                        testID={`severity-btn-${num}`}
                    >
                        <View style={[styles.severityButton, newSeverity === num && styles.severityButtonActive]}>
                            <Text
                                fontSize="text-xs"
                                fontWeight={newSeverity === num ? 'bold' : 'regular'}
                                color={newSeverity === num ? colors.neutral.white : colors.neutral.gray600}
                            >
                                {num}
                            </Text>
                        </View>
                    </Touchable>
                ))}
            </View>
        </View>
    );

    const renderAddForm = (): React.ReactElement | null => (
        <Card journey="care" elevation="md">
            <Text variant="body" fontWeight="semiBold" journey="care">
                {t('journeys.care.symptomChecker.diary.newEntry')}
            </Text>

            <Text fontSize="text-sm" color={colors.neutral.gray600} style={styles.fieldLabel}>
                {t('journeys.care.symptomChecker.diary.symptomsLabel')}
            </Text>
            <TextInput
                style={styles.textInput}
                value={newSymptoms}
                onChangeText={setNewSymptoms}
                placeholder={t('journeys.care.symptomChecker.diary.symptomsPlaceholder')}
                placeholderTextColor={colors.neutral.gray500}
                accessibilityLabel={t('journeys.care.symptomChecker.diary.symptomsLabel')}
                testID="new-symptoms-input"
            />

            {renderSeveritySelector()}

            <Text fontSize="text-sm" color={colors.neutral.gray600} style={styles.fieldLabel}>
                {t('journeys.care.symptomChecker.diary.notesLabel')}
            </Text>
            <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={newNotes}
                onChangeText={setNewNotes}
                placeholder={t('journeys.care.symptomChecker.diary.notesPlaceholder')}
                placeholderTextColor={colors.neutral.gray500}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                accessibilityLabel={t('journeys.care.symptomChecker.diary.notesLabel')}
                testID="new-notes-input"
            />

            <View style={styles.formActions}>
                <Button
                    variant="secondary"
                    onPress={() => setShowForm(false)}
                    journey="care"
                    accessibilityLabel={t('journeys.care.symptomChecker.diary.cancel')}
                    testID="cancel-entry-button"
                >
                    {t('journeys.care.symptomChecker.diary.cancel')}
                </Button>
                <Button
                    onPress={handleAddEntry}
                    journey="care"
                    accessibilityLabel={t('journeys.care.symptomChecker.diary.saveEntry')}
                    testID="save-entry-button"
                >
                    {t('journeys.care.symptomChecker.diary.saveEntry')}
                </Button>
            </View>
        </Card>
    );

    const renderEntryItem = ({ item, index }: { item: DiaryEntry; index: number }): React.ReactElement | null => (
        <Card journey="care" elevation="sm">
            <View style={styles.entryHeader}>
                <Text fontSize="text-sm" color={colors.neutral.gray600} testID={`entry-date-${index}`}>
                    {item.date}
                </Text>
                <Badge
                    variant="status"
                    status={getSeverityBadgeStatus(item.severity)}
                    testID={`entry-severity-${index}`}
                    accessibilityLabel={`${t('journeys.care.symptomChecker.diary.severity')}: ${item.severity}/10`}
                >
                    {item.severity}/10
                </Badge>
            </View>

            <Text variant="body" fontWeight="semiBold" journey="care" testID={`entry-symptoms-${index}`}>
                {item.symptoms}
            </Text>

            {item.notes ? (
                <Text fontSize="text-sm" color={colors.neutral.gray600} testID={`entry-notes-${index}`}>
                    {item.notes}
                </Text>
            ) : null}
        </Card>
    );

    const renderHeader = (): React.ReactElement | null => (
        <View>
            <Text variant="heading" journey="care" testID="diary-title" style={styles.title}>
                {t('journeys.care.symptomChecker.diary.title')}
            </Text>

            {/* Trend card */}
            <Card journey="care" elevation="md" style={styles.trendCard}>
                <View style={styles.trendRow}>
                    <Text variant="body" fontWeight="semiBold" journey="care">
                        {t('journeys.care.symptomChecker.diary.trend')}
                    </Text>
                    <Badge
                        variant="status"
                        status={trend.status}
                        testID="trend-badge"
                        accessibilityLabel={`${t('journeys.care.symptomChecker.diary.trend')}: ${trend.label}`}
                    >
                        {trend.label}
                    </Badge>
                </View>
                <Text fontSize="text-sm" color={colors.neutral.gray600}>
                    {entries.length} {t('journeys.care.symptomChecker.diary.entriesRecorded')}
                </Text>
            </Card>

            {showForm && renderAddForm()}
        </View>
    );

    return (
        <View style={styles.root}>
            <FlatList
                data={entries}
                renderItem={renderEntryItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                testID="diary-list"
            />

            {/* Floating add button */}
            {!showForm && (
                <Touchable
                    onPress={() => setShowForm(true)}
                    accessibilityLabel={t('journeys.care.symptomChecker.diary.addEntry')}
                    accessibilityRole="button"
                    testID="add-entry-fab"
                >
                    <View style={styles.fab}>
                        <Text fontSize="heading-md" color={colors.neutral.white} fontWeight="bold">
                            +
                        </Text>
                    </View>
                </Touchable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.journeys.care.background,
    },
    title: {
        marginBottom: spacingValues.sm,
    },
    listContent: {
        padding: spacingValues.md,
        paddingBottom: spacingValues['6xl'],
        gap: spacingValues.sm,
    },
    trendCard: {
        marginBottom: spacingValues.sm,
    },
    trendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues['3xs'],
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingValues['3xs'],
    },
    fieldLabel: {
        marginTop: spacingValues.sm,
        marginBottom: spacingValues['3xs'],
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        borderRadius: spacingValues.xs,
        padding: spacingValues.sm,
        fontSize: 14,
        color: colors.journeys.care.text,
    },
    notesInput: {
        minHeight: 80,
    },
    severitySelector: {
        marginTop: spacingValues.sm,
        gap: spacingValues['3xs'],
    },
    severityButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacingValues['3xs'],
    },
    severityButton: {
        width: spacingValues['2xl'],
        height: spacingValues['2xl'],
        borderRadius: spacingValues['3xs'],
        borderWidth: 1,
        borderColor: colors.neutral.gray300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    severityButtonActive: {
        backgroundColor: colors.journeys.care.primary,
        borderColor: colors.journeys.care.primary,
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacingValues.md,
        gap: spacingValues.sm,
    },
    fab: {
        position: 'absolute',
        bottom: spacingValues['2xl'],
        right: spacingValues.md,
        width: spacingValues['4xl'],
        height: spacingValues['4xl'],
        borderRadius: spacingValues.xl,
        backgroundColor: colors.journeys.care.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});

export { SymptomDiary };
export default SymptomDiary;
