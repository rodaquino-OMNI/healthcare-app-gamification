/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { typography, fontSizeValues } from '@design-system/tokens/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Interface para resultado de medico
 */
export interface DoctorResult {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    availableDate: string;
}

/**
 * Interface para resultado de medicamento
 */
export interface MedicationResult {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    category: string;
}

/**
 * Interface para resultado de artigo
 */
export interface ArticleResult {
    id: string;
    title: string;
    summary: string;
    readTime: string;
    category: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

/**
 * Dados mock de medicos
 */
export const MOCK_DOCTORS: DoctorResult[] = [
    {
        id: 'd1',
        name: 'Dra. Ana Silva',
        specialty: 'Cardiologista',
        rating: 4.8,
        reviewCount: 127,
        availableDate: 'Disponivel amanha',
    },
    {
        id: 'd2',
        name: 'Dr. Carlos Mendes',
        specialty: 'Clinico Geral',
        rating: 4.6,
        reviewCount: 89,
        availableDate: 'Disponivel hoje',
    },
    {
        id: 'd3',
        name: 'Dra. Maria Santos',
        specialty: 'Dermatologista',
        rating: 4.9,
        reviewCount: 203,
        availableDate: 'Disponivel em 3 dias',
    },
    {
        id: 'd4',
        name: 'Dr. Paulo Oliveira',
        specialty: 'Pediatra',
        rating: 4.7,
        reviewCount: 156,
        availableDate: 'Disponivel amanha',
    },
];

/**
 * Dados mock de medicamentos
 */
export const MOCK_MEDICATIONS: MedicationResult[] = [
    { id: 'm1', name: 'Paracetamol', dosage: '500mg', frequency: 'A cada 6 horas', category: 'Analgesico' },
    { id: 'm2', name: 'Ibuprofeno', dosage: '400mg', frequency: 'A cada 8 horas', category: 'Anti-inflamatorio' },
    { id: 'm3', name: 'Losartana', dosage: '50mg', frequency: '1x ao dia', category: 'Anti-hipertensivo' },
    { id: 'm4', name: 'Metformina', dosage: '850mg', frequency: '2x ao dia', category: 'Antidiabetico' },
];

/**
 * Dados mock de artigos
 */
export const MOCK_ARTICLES: ArticleResult[] = [
    {
        id: 'a1',
        title: 'Como controlar a pressao arterial',
        summary: 'Dicas praticas para manter sua pressao arterial em niveis saudaveis no dia a dia.',
        readTime: '5 min',
        category: 'Saude',
    },
    {
        id: 'a2',
        title: 'Alimentacao para diabeticos',
        summary: 'Guia completo sobre alimentacao adequada para quem convive com diabetes.',
        readTime: '8 min',
        category: 'Nutricao',
    },
    {
        id: 'a3',
        title: 'Importancia das vacinas',
        summary: 'Entenda por que manter o calendario vacinal em dia e essencial para sua saude.',
        readTime: '4 min',
        category: 'Prevencao',
    },
    {
        id: 'a4',
        title: 'Exercicios para o coracao',
        summary: 'Os melhores exercicios fisicos para manter a saude cardiovascular.',
        readTime: '6 min',
        category: 'Exercicio',
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renderiza estrelas de avaliacao
 */
export const renderStars = (rating: number): string => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '\u2605';
    }
    if (halfStar) {
        stars += '\u00BD';
    }
    return stars;
};

// ---------------------------------------------------------------------------
// Card components
// ---------------------------------------------------------------------------

interface DoctorCardProps {
    doctor: DoctorResult;
    onPress: () => void;
}

/**
 * Renders a single doctor search result card.
 */
export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    return (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${doctor.name}, ${doctor.specialty}`}
        >
            <View style={styles.doctorRow}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.journeys.care.background }]}>
                    <Text style={[styles.avatarText, { color: colors.journeys.care.primary }]}>
                        {doctor.name.charAt(0)}
                    </Text>
                </View>
                <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingStars}>{renderStars(doctor.rating)}</Text>
                        <Text style={styles.ratingText}>
                            {doctor.rating} ({doctor.reviewCount} avaliacoes)
                        </Text>
                    </View>
                    <Text style={styles.availableText}>{doctor.availableDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

interface MedicationCardProps {
    medication: MedicationResult;
    onPress: () => void;
}

/**
 * Renders a single medication search result card.
 */
export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onPress }) => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    return (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${medication.name}, ${medication.dosage}`}
        >
            <View style={styles.medicationRow}>
                <View style={[styles.medicationIcon, { backgroundColor: colors.journeys.health.background }]}>
                    <Text style={styles.medicationIconText}>{'\uD83D\uDC8A'}</Text>
                </View>
                <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName}>{medication.name}</Text>
                    <Text style={styles.medicationDosage}>{medication.dosage}</Text>
                    <Text style={styles.medicationFrequency}>{medication.frequency}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.journeys.health.background }]}>
                        <Text style={[styles.categoryBadgeText, { color: colors.journeys.health.primary }]}>
                            {medication.category}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

interface ArticleCardProps {
    article: ArticleResult;
}

/**
 * Renders a single article search result card.
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const { t } = useTranslation();
    return (
        <TouchableOpacity style={styles.resultCard} accessibilityRole="button" accessibilityLabel={article.title}>
            <View style={styles.articleContent}>
                <View style={styles.articleImagePlaceholder}>
                    <Text style={styles.articleImageText}>{'\uD83D\uDCF0'}</Text>
                </View>
                <View style={styles.articleInfo}>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.journeys.plan.background }]}>
                        <Text style={[styles.categoryBadgeText, { color: colors.journeys.plan.primary }]}>
                            {article.category}
                        </Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                        {article.title}
                    </Text>
                    <Text style={styles.articleSummary} numberOfLines={2}>
                        {article.summary}
                    </Text>
                    <Text style={styles.readTime}>{t('searchScreens.readTime', { time: article.readTime })}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        resultCard: {
            backgroundColor: theme.colors.background.default,
            borderRadius: borderRadiusValues.md,
            padding: spacingValues.md,
            marginBottom: spacingValues.sm,
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 1,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
        },
        // Doctor card styles
        doctorRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        avatarPlaceholder: {
            width: 48,
            height: 48,
            borderRadius: borderRadiusValues.md,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacingValues.sm,
        },
        avatarText: {
            fontSize: fontSizeValues.lg,
            fontWeight: String(typography.fontWeight.bold) as '700',
        },
        doctorInfo: {
            flex: 1,
        },
        doctorName: {
            fontSize: fontSizeValues.md,
            fontWeight: String(typography.fontWeight.semiBold) as '600',
            color: theme.colors.text.default,
            marginBottom: spacingValues['4xs'],
        },
        doctorSpecialty: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.muted,
            marginBottom: spacingValues['3xs'],
        },
        ratingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacingValues['3xs'],
        },
        ratingStars: {
            fontSize: fontSizeValues.sm,
            color: colors.semantic.warning,
            marginRight: spacingValues['3xs'],
        },
        ratingText: {
            fontSize: fontSizeValues.xs,
            color: theme.colors.text.subtle,
        },
        availableText: {
            fontSize: fontSizeValues.xs,
            color: colors.journeys.care.primary,
            fontWeight: String(typography.fontWeight.medium) as '500',
        },
        // Medication card styles
        medicationRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        medicationIcon: {
            width: 48,
            height: 48,
            borderRadius: borderRadiusValues.md,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacingValues.sm,
        },
        medicationIconText: {
            fontSize: 22,
        },
        medicationInfo: {
            flex: 1,
        },
        medicationName: {
            fontSize: fontSizeValues.md,
            fontWeight: String(typography.fontWeight.semiBold) as '600',
            color: theme.colors.text.default,
            marginBottom: spacingValues['4xs'],
        },
        medicationDosage: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.default,
            marginBottom: spacingValues['4xs'],
        },
        medicationFrequency: {
            fontSize: fontSizeValues.xs,
            color: theme.colors.text.subtle,
            marginBottom: spacingValues['3xs'],
        },
        categoryBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: spacingValues.xs,
            paddingVertical: spacingValues['4xs'],
            borderRadius: borderRadiusValues.xs,
        },
        categoryBadgeText: {
            fontSize: fontSizeValues.xs,
            fontWeight: String(typography.fontWeight.medium) as '500',
        },
        // Article card styles
        articleContent: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        articleImagePlaceholder: {
            width: 72,
            height: 72,
            borderRadius: borderRadiusValues.md,
            backgroundColor: theme.colors.background.subtle,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacingValues.sm,
        },
        articleImageText: {
            fontSize: 28,
        },
        articleInfo: {
            flex: 1,
        },
        articleTitle: {
            fontSize: fontSizeValues.md,
            fontWeight: String(typography.fontWeight.semiBold) as '600',
            color: theme.colors.text.default,
            marginTop: spacingValues['3xs'],
            marginBottom: spacingValues['3xs'],
        },
        articleSummary: {
            fontSize: fontSizeValues.sm,
            color: theme.colors.text.muted,
            lineHeight: fontSizeValues.sm * typography.lineHeight.base,
            marginBottom: spacingValues['3xs'],
        },
        readTime: {
            fontSize: fontSizeValues.xs,
            color: theme.colors.text.subtle,
        },
    });
