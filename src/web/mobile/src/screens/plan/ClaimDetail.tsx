import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Claim, ClaimStatus } from 'src/web/shared/types/plan.types';
import { useClaims } from 'src/web/mobile/src/hooks/useClaims';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import { formatDate } from 'src/web/shared/utils/format';
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '@web/design-system/src/tokens';

const { plan } = colors.journeys;
const sp = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32 };

const STATUS_CONFIG: Record<ClaimStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendente', bg: colors.semantic.warningBg, text: colors.semantic.warning },
  approved: { label: 'Aprovado', bg: colors.semantic.successBg, text: colors.semantic.success },
  denied: { label: 'Negado', bg: colors.semantic.errorBg, text: colors.semantic.error },
  additional_info_required: { label: 'Info Adicional', bg: colors.semantic.warningBg, text: colors.semantic.warning },
};

const TYPE_LABELS: Record<string, string> = {
  medical: 'Medico',
  dental: 'Odontologico',
  vision: 'Oftalmologico',
  prescription: 'Receita',
  other: 'Outro',
};

// Timeline step definitions
const TIMELINE_STEPS = [
  { key: 'submitted', label: 'Enviado' },
  { key: 'under_review', label: 'Em Analise' },
  { key: 'approved', label: 'Aprovado' },
  { key: 'paid', label: 'Pago' },
];

function getTimelineProgress(status: ClaimStatus): number {
  switch (status) {
    case 'pending':
      return 1; // Submitted only
    case 'additional_info_required':
      return 1;
    case 'approved':
      return 3; // Submitted + Under Review + Approved
    case 'denied':
      return 2; // Submitted + Under Review (denied at review)
    default:
      return 0;
  }
}

/**
 * Renders the Claim Detail screen displaying information about a specific claim.
 */
export const ClaimDetail: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const claimId = route.params?.claimId;
  const planId = route.params?.planId || '';

  const { claims, isLoading, error } = useClaims(planId);
  const claim = claims?.find((c: Claim) => c.id === claimId);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={plan.primary} />
        <Text style={styles.loadingText}>Carregando detalhes da solicitacao...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro ao carregar detalhes da solicitacao.</Text>
      </View>
    );
  }

  if (!claim) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyIcon}>{'\u{1F50D}'}</Text>
        <Text style={styles.errorText}>Solicitacao nao encontrada.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIMS)}
        >
          <Text style={styles.backButtonText}>Voltar ao Historico</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[claim.status];
  const timelineProgress = getTimelineProgress(claim.status);
  const formattedDate = formatDate(claim.submittedAt, 'dd/MM/yyyy');
  const isDenied = claim.status === 'denied';

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.typeLabel}>{TYPE_LABELS[claim.type] || claim.type}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
        <Text style={styles.amountValue}>
          R$ {claim.amount.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.dateText}>Enviado em {formattedDate}</Text>
      </View>

      {/* Progress Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Andamento</Text>
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < timelineProgress;
          const isCurrent = index === timelineProgress - 1;
          const isDeniedStep = isDenied && index === 1;
          const isLast = index === TIMELINE_STEPS.length - 1;

          let circleColor = colors.gray[30];
          if (isCompleted) circleColor = plan.primary;
          if (isDeniedStep) circleColor = colors.semantic.error;

          return (
            <View key={step.key} style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineCircle,
                    { backgroundColor: circleColor },
                    isCurrent && styles.timelineCircleCurrent,
                  ]}
                >
                  {isCompleted && (
                    <Text style={styles.timelineCheck}>{'\u2713'}</Text>
                  )}
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      { backgroundColor: isCompleted && index < timelineProgress - 1 ? plan.primary : colors.gray[20] },
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelCompleted,
                    isDeniedStep && styles.timelineLabelDenied,
                  ]}
                >
                  {isDeniedStep ? 'Negado' : step.label}
                </Text>
                {isCompleted && (
                  <Text style={styles.timelineDate}>{formattedDate}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Details Section */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Detalhes</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tipo</Text>
          <Text style={styles.detailValue}>{TYPE_LABELS[claim.type] || claim.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Valor</Text>
          <Text style={styles.detailValue}>R$ {claim.amount.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data de Envio</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Plano</Text>
          <Text style={styles.detailValue}>{claim.planId}</Text>
        </View>

        {/* Documents */}
        {claim.documents && claim.documents.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: sp.md }]}>Documentos</Text>
            {claim.documents.map((doc, idx) => (
              <View key={doc.id || idx} style={styles.documentRow}>
                <Text style={styles.documentIcon}>{'\u{1F4C4}'}</Text>
                <Text style={styles.documentName}>{doc.type}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {isDenied && (
          <TouchableOpacity
            style={styles.appealButton}
            onPress={() => {
              // Appeal action placeholder
            }}
            accessibilityRole="button"
            accessibilityLabel="Recorrer desta solicitacao"
          >
            <Text style={styles.appealButtonText}>Recorrer</Text>
          </TouchableOpacity>
        )}
        {claim.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              // Cancel claim action placeholder
            }}
            accessibilityRole="button"
            accessibilityLabel="Cancelar solicitacao"
          >
            <Text style={styles.cancelButtonText}>Cancelar Solicitacao</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate(MOBILE_PLAN_ROUTES.CLAIMS)}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao historico de solicitacoes"
        >
          <Text style={styles.backButtonText}>Voltar ao Historico</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: plan.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: plan.background,
    padding: sp.xl,
  },
  loadingText: {
    marginTop: sp.md,
    fontSize: 16,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  errorText: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.heading,
    color: colors.semantic.error,
    textAlign: 'center',
    marginBottom: sp.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: sp.md,
  },
  // Header card
  headerCard: {
    backgroundColor: colors.neutral.white,
    margin: sp.md,
    borderRadius: 8,
    padding: sp.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sp.sm,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  statusBadge: {
    paddingHorizontal: sp.sm,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[40],
  },
  // Timeline
  timelineCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: sp.md,
    marginBottom: sp.md,
    borderRadius: 8,
    padding: sp.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.heading,
    color: plan.text,
    marginBottom: sp.md,
  },
  timelineStep: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
    marginRight: sp.sm,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleCurrent: {
    borderWidth: 3,
    borderColor: plan.secondary,
  },
  timelineCheck: {
    fontSize: 12,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.bold as any,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: sp.md,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[40],
  },
  timelineLabelCompleted: {
    color: plan.text,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  timelineLabelDenied: {
    color: colors.semantic.error,
  },
  timelineDate: {
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[40],
    marginTop: 2,
  },
  // Details
  detailsCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: sp.md,
    marginBottom: sp.md,
    borderRadius: 8,
    padding: sp.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sp.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[10],
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[50],
  },
  detailValue: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: plan.text,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sp.xs,
  },
  documentIcon: {
    fontSize: 16,
    marginRight: sp.xs,
  },
  documentName: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
    color: plan.primary,
  },
  // Actions
  actionContainer: {
    paddingHorizontal: sp.md,
    gap: sp.sm,
  },
  appealButton: {
    borderWidth: 2,
    borderColor: plan.primary,
    borderRadius: 8,
    paddingVertical: sp.sm,
    alignItems: 'center',
  },
  appealButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
    color: plan.primary,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: colors.semantic.error,
    borderRadius: 8,
    paddingVertical: sp.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semiBold as any,
    fontFamily: typography.fontFamily.body,
    color: colors.semantic.error,
  },
  backButton: {
    backgroundColor: colors.gray[10],
    borderRadius: 8,
    paddingVertical: sp.sm,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.medium as any,
    fontFamily: typography.fontFamily.body,
    color: colors.gray[60],
  },
  bottomSpacer: { height: sp['2xl'] },
});
