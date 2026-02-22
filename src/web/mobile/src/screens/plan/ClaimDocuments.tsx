import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  colors,
  typography,
} from '@web/design-system/src/tokens';
import type { Theme } from '@web/design-system/src/themes/base.theme';

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
export const ClaimDocuments: React.FC<ClaimDocumentsProps> = ({
  documents,
  sectionTitle,
  theme,
}) => {
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
      fontWeight: typography.fontWeight.semiBold as any,
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
