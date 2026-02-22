import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ClaimType } from 'src/web/shared/types/plan.types';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '@web/design-system/src/tokens';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@web/design-system/src/themes/base.theme';

const { plan } = colors.journeys;
const sp = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32 };

const TOTAL_STEPS = 5;

interface FormData {
  claimType: ClaimType | '';
  providerName: string;
  serviceDate: string;
  amount: string;
  description: string;
  documents: string[];
}

const CLAIM_TYPE_OPTIONS: { value: ClaimType; label: string; icon: string }[] = [
  { value: 'medical', label: 'Medico', icon: '\u2695' },
  { value: 'dental', label: 'Odontologico', icon: '\u{1F9B7}' },
  { value: 'vision', label: 'Oftalmologico', icon: '\u{1F441}' },
  { value: 'prescription', label: 'Receita', icon: '\u{1F48A}' },
  { value: 'other', label: 'Outro', icon: '\u{1F4C4}' },
];

/**
 * Multi-step claim submission form with type selection, details, documents,
 * review, and success confirmation screens.
 */
const ClaimSubmissionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    claimType: '',
    providerName: '',
    serviceDate: '',
    amount: '',
    description: '',
    documents: [],
  });

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return formData.claimType !== '';
      case 1:
        return (
          formData.providerName.trim() !== '' &&
          formData.serviceDate.trim() !== '' &&
          formData.amount.trim() !== '' &&
          parseFloat(formData.amount) > 0
        );
      case 2:
        return true; // Documents are optional
      case 3:
        return true; // Review step, always valid
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 2) {
      setCurrentStep((s) => s + 1);
    } else if (currentStep === TOTAL_STEPS - 2) {
      // Submit
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    // In a real app, call API here
    setCurrentStep(TOTAL_STEPS - 1); // Go to success screen
  };

  const formatCurrency = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'R$ 0,00';
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  // Step indicator
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
        <View key={i} style={styles.stepDotRow}>
          <View
            style={[
              styles.stepDot,
              i <= currentStep ? styles.stepDotActive : styles.stepDotInactive,
              i === currentStep && styles.stepDotCurrent,
            ]}
          />
          {i < TOTAL_STEPS - 2 && (
            <View
              style={[
                styles.stepLine,
                i < currentStep ? styles.stepLineActive : styles.stepLineInactive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  // Step 0: Claim Type
  const renderTypeStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('journeys.plan.claims.submission.typeTitle')}</Text>
      <Text style={styles.stepSubtitle}>{t('journeys.plan.claims.submission.typeSubtitle')}</Text>
      {CLAIM_TYPE_OPTIONS.map((option) => {
        const isSelected = formData.claimType === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.typeCard, isSelected && styles.typeCardSelected]}
            onPress={() => updateField('claimType', option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={styles.typeIcon}>{option.icon}</Text>
            <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
              {option.label}
            </Text>
            <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Step 1: Details
  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('journeys.plan.claims.submission.detailsTitle')}</Text>
      <Text style={styles.stepSubtitle}>{t('journeys.plan.claims.submission.detailsSubtitle')}</Text>

      <Text style={styles.fieldLabel}>{t('journeys.plan.claims.submission.providerName')} *</Text>
      <TextInput
        style={styles.input}
        value={formData.providerName}
        onChangeText={(t) => updateField('providerName', t)}
        placeholder={t('journeys.plan.claims.submission.providerPlaceholder')}
        placeholderTextColor={colors.gray[40]}
      />

      <Text style={styles.fieldLabel}>{t('journeys.plan.claims.submission.serviceDate')} *</Text>
      <TextInput
        style={styles.input}
        value={formData.serviceDate}
        onChangeText={(t) => updateField('serviceDate', t)}
        placeholder="DD/MM/AAAA"
        placeholderTextColor={colors.gray[40]}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.fieldLabel}>{t('journeys.plan.claims.submission.amount')} *</Text>
      <TextInput
        style={styles.input}
        value={formData.amount}
        onChangeText={(t) => updateField('amount', t.replace(/[^0-9.]/g, ''))}
        placeholder="0.00"
        placeholderTextColor={colors.gray[40]}
        keyboardType="decimal-pad"
      />

      <Text style={styles.fieldLabel}>{t('journeys.plan.claims.submission.description')}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.description}
        onChangeText={(t) => updateField('description', t)}
        placeholder={t('journeys.plan.claims.submission.descriptionPlaceholder')}
        placeholderTextColor={colors.gray[40]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );

  // Step 2: Documents
  const renderDocumentsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{t('journeys.plan.claims.submission.documentsTitle')}</Text>
      <Text style={styles.stepSubtitle}>{t('journeys.plan.claims.submission.documentsSubtitle')}</Text>

      <TouchableOpacity
        style={styles.uploadArea}
        onPress={() => {
          Alert.alert(t('journeys.plan.claims.submission.upload'), t('journeys.plan.claims.submission.uploadComingSoon'));
        }}
        accessibilityRole="button"
        accessibilityLabel={t('journeys.plan.claims.submission.uploadAccessibility')}
      >
        <Text style={styles.uploadIcon}>{'\u{1F4CE}'}</Text>
        <Text style={styles.uploadText}>{t('journeys.plan.claims.submission.uploadText')}</Text>
        <Text style={styles.uploadHint}>{t('journeys.plan.claims.submission.uploadHint')}</Text>
      </TouchableOpacity>

      {formData.documents.length > 0 && (
        <View style={styles.documentList}>
          {formData.documents.map((doc, idx) => (
            <View key={idx} style={styles.documentItem}>
              <Text style={styles.documentItemIcon}>{'\u{1F4C4}'}</Text>
              <Text style={styles.documentItemName}>{doc}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // Step 3: Review
  const renderReviewStep = () => {
    const typeOption = CLAIM_TYPE_OPTIONS.find((o) => o.value === formData.claimType);
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{t('journeys.plan.claims.submission.reviewTitle')}</Text>
        <Text style={styles.stepSubtitle}>{t('journeys.plan.claims.submission.reviewSubtitle')}</Text>

        <View style={styles.reviewCard}>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{t('journeys.plan.claims.type')}</Text>
            <Text style={styles.reviewValue}>{typeOption?.label || '-'}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{t('journeys.plan.claims.submission.providerName')}</Text>
            <Text style={styles.reviewValue}>{formData.providerName || '-'}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{t('journeys.plan.claims.submission.serviceDate')}</Text>
            <Text style={styles.reviewValue}>{formData.serviceDate || '-'}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{t('journeys.plan.claims.amount')}</Text>
            <Text style={styles.reviewValueHighlight}>{formatCurrency(formData.amount)}</Text>
          </View>
          {formData.description !== '' && (
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>{t('journeys.plan.claims.submission.description')}</Text>
              <Text style={styles.reviewValue}>{formData.description}</Text>
            </View>
          )}
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{t('journeys.plan.claims.documents')}</Text>
            <Text style={styles.reviewValue}>
              {formData.documents.length > 0
                ? t('journeys.plan.claims.submission.filesCount', { count: formData.documents.length })
                : t('journeys.plan.claims.submission.noDocuments')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Step 4: Success
  const renderSuccessStep = () => (
    <View style={styles.successContainer}>
      <View style={styles.successCircle}>
        <Text style={styles.successCheck}>{'\u2713'}</Text>
      </View>
      <Text style={styles.successTitle}>{t('journeys.plan.claims.submission.successTitle')}</Text>
      <Text style={styles.successSubtitle}>
        {t('journeys.plan.claims.submission.successSubtitle')}
      </Text>
      <Text style={styles.successClaimId}>
        ID: CLM-{Date.now().toString().slice(-8)}
      </Text>
      <TouchableOpacity
        style={styles.successButton}
        onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIMS)}
        accessibilityRole="button"
      >
        <Text style={styles.successButtonText}>{t('journeys.plan.claims.submission.viewClaims')}</Text>
      </TouchableOpacity>
    </View>
  );

  const stepRenderers = [
    renderTypeStep,
    renderDetailsStep,
    renderDocumentsStep,
    renderReviewStep,
    renderSuccessStep,
  ];

  const isSuccess = currentStep === TOTAL_STEPS - 1;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!isSuccess && renderStepIndicator()}
        {stepRenderers[currentStep]()}
      </ScrollView>

      {/* Navigation Buttons */}
      {!isSuccess && (
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={styles.navBackButton}
            onPress={handleBack}
            accessibilityRole="button"
          >
            <Text style={styles.navBackText}>{t('common.buttons.back')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navNextButton, !isStepValid() && styles.navNextButtonDisabled]}
            onPress={handleNext}
            disabled={!isStepValid()}
            accessibilityRole="button"
          >
            <Text style={styles.navNextText}>
              {currentStep === TOTAL_STEPS - 2 ? t('common.buttons.submit') : t('common.buttons.next')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const font = typography.fontFamily.body;
const headFont = typography.fontFamily.heading;
const fw = typography.fontWeight;

const createStyles = (theme: Theme) => StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: plan.background },
  scrollContent: { paddingBottom: 100 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: sp.md, paddingHorizontal: sp['2xl'] },
  stepDotRow: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 12, height: 12, borderRadius: 6 },
  stepDotActive: { backgroundColor: plan.primary },
  stepDotInactive: { backgroundColor: colors.gray[30] },
  stepDotCurrent: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: plan.secondary },
  stepLine: { width: 32, height: 2, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: plan.primary },
  stepLineInactive: { backgroundColor: colors.gray[30] },
  stepContent: { paddingHorizontal: sp.md },
  stepTitle: { fontSize: 22, fontWeight: fw.bold as any, fontFamily: headFont, color: plan.text, marginBottom: 4 },
  stepSubtitle: { fontSize: 14, fontFamily: font, color: colors.gray[50], marginBottom: sp.xl },
  typeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background.default, borderRadius: 8, padding: sp.md, marginBottom: sp.sm, borderWidth: 2, borderColor: theme.colors.border.default },
  typeCardSelected: { borderColor: plan.primary, backgroundColor: plan.background },
  typeIcon: { fontSize: 24, marginRight: sp.sm },
  typeLabel: { flex: 1, fontSize: 16, fontWeight: fw.medium as any, fontFamily: font, color: plan.text },
  typeLabelSelected: { color: plan.primary, fontWeight: fw.semiBold as any },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.gray[30], justifyContent: 'center', alignItems: 'center' },
  radioCircleSelected: { borderColor: plan.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: plan.primary },
  fieldLabel: { fontSize: 14, fontWeight: fw.medium as any, fontFamily: font, color: plan.text, marginBottom: sp.xs },
  input: { backgroundColor: theme.colors.background.default, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border.default, paddingHorizontal: sp.md, paddingVertical: sp.sm, fontSize: 16, fontFamily: font, color: plan.text, marginBottom: sp.md },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderColor: plan.primary, borderRadius: 8, paddingVertical: sp['2xl'], alignItems: 'center', backgroundColor: theme.colors.background.default },
  uploadIcon: { fontSize: 32, marginBottom: sp.xs },
  uploadText: { fontSize: 16, fontWeight: fw.medium as any, fontFamily: font, color: plan.primary, marginBottom: 4 },
  uploadHint: { fontSize: 12, fontFamily: font, color: colors.gray[40] },
  documentList: { marginTop: sp.md },
  documentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: sp.xs },
  documentItemIcon: { fontSize: 16, marginRight: sp.xs },
  documentItemName: { fontSize: 14, fontFamily: font, color: plan.text },
  reviewCard: { backgroundColor: theme.colors.background.default, borderRadius: 8, padding: sp.md, shadowColor: colors.neutral.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: sp.xs, borderBottomWidth: 1, borderBottomColor: theme.colors.border.default },
  reviewLabel: { fontSize: 14, fontFamily: font, color: colors.gray[50] },
  reviewValue: { fontSize: 14, fontWeight: fw.medium as any, fontFamily: font, color: plan.text, maxWidth: '60%', textAlign: 'right' },
  reviewValueHighlight: { fontSize: 16, fontWeight: fw.bold as any, fontFamily: font, color: plan.primary },
  successContainer: { alignItems: 'center', paddingTop: sp['2xl'] * 2, paddingHorizontal: sp.xl },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.semantic.success, justifyContent: 'center', alignItems: 'center', marginBottom: sp.xl },
  successCheck: { fontSize: 36, color: colors.neutral.white, fontWeight: fw.bold as any },
  successTitle: { fontSize: 24, fontWeight: fw.bold as any, fontFamily: headFont, color: plan.text, marginBottom: sp.xs },
  successSubtitle: { fontSize: 16, fontFamily: font, color: colors.gray[50], textAlign: 'center', marginBottom: sp.md },
  successClaimId: { fontSize: 14, fontFamily: typography.fontFamily.mono, color: colors.gray[40], marginBottom: sp['2xl'] },
  successButton: { backgroundColor: plan.primary, borderRadius: 8, paddingVertical: sp.sm, paddingHorizontal: sp['2xl'] },
  successButtonText: { fontSize: 16, fontWeight: fw.semiBold as any, fontFamily: font, color: colors.neutral.white },
  navButtons: { flexDirection: 'row', paddingHorizontal: sp.md, paddingVertical: sp.sm, backgroundColor: theme.colors.background.default, borderTopWidth: 1, borderTopColor: theme.colors.border.default, gap: sp.sm },
  navBackButton: { flex: 1, backgroundColor: theme.colors.background.subtle, borderRadius: 8, paddingVertical: sp.sm, alignItems: 'center' },
  navBackText: { fontSize: 16, fontWeight: fw.medium as any, fontFamily: font, color: colors.gray[60] },
  navNextButton: { flex: 2, backgroundColor: plan.primary, borderRadius: 8, paddingVertical: sp.sm, alignItems: 'center' },
  navNextButtonDisabled: { backgroundColor: colors.gray[30] },
  navNextText: { fontSize: 16, fontWeight: fw.semiBold as any, fontFamily: font, color: colors.neutral.white },
});

export { ClaimSubmissionScreen };
