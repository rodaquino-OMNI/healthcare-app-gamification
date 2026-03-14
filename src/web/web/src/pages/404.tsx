import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import type { GetStaticProps } from 'next';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

const NotFoundPage: React.FC = () => {
    const { isAuthenticated: _isAuthenticated } = useAuth();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: spacing['2xl'],
                fontFamily: typography.fontFamily.body,
                backgroundColor: colors.neutral.white,
            }}
        >
            <h1
                style={{
                    fontSize: typography.fontSize['display-sm'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral.gray900,
                    marginBottom: spacing.md,
                }}
            >
                404
            </h1>
            <p
                style={{
                    fontSize: typography.fontSize['text-lg'],
                    color: colors.neutral.gray600,
                    marginBottom: spacing.xl,
                    textAlign: 'center',
                }}
            >
                Pagina nao encontrada
            </p>
            <a
                href="/"
                style={{
                    padding: `${spacing.sm} ${spacing.xl}`,
                    backgroundColor: colors.brand.primary,
                    color: colors.neutral.white,
                    borderRadius: borderRadius.md,
                    textDecoration: 'none',
                    fontWeight: typography.fontWeight.medium,
                    fontSize: typography.fontSize['text-md'],
                }}
            >
                Voltar ao inicio
            </a>
        </div>
    );
};

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default NotFoundPage;
