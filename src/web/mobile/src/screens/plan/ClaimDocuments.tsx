/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import type { Theme } from '@design-system/themes/base.theme';
import { colors, typography } from '@design-system/tokens';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const { plan } = colors.journeys;
const sp = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32 };

/** Represents a single document attached to a claim */
interface ClaimDocument {
    id?: string;
    type: string;
}

export interface ClaimDocumentsProps {
    /** Array of documents to display */
    documents: ClaimDocument[];
    /** Section title text */
    sectionTitle: string;
    /** Theme instance for dynamic styles */
    theme: Theme;
}

/**
 * Renders a list of claim-attached documents with icons
 * and document type labels.
 */
export const ClaimDocuments: React.FC<ClaimDocumentsProps> = ({ documents, sectionTitle, theme }) => {
    const styles = createStyles(theme);

    if (!documents || documents.length === 0) {
        return null;
    }

    return (
        <>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            {documents.map((doc, idx) => (
                <View key={doc.id || idx} style={styles.documentRow}>
                    <Text style={styles.documentIcon}>{'\u{1F4C4}'}</Text>
                    <Text style={styles.documentName}>{doc.type}</Text>
                </View>
            ))}
        </>
    );
};

const createStyles = (_theme: Theme) =>
    StyleSheet.create({
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600' as const,
            fontFamily: typography.fontFamily.heading,
            color: plan.text,
            marginTop: sp.md,
            marginBottom: sp.md,
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
    });
