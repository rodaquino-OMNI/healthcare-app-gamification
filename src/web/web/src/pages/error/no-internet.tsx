import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

const NoInternetPage: React.FC = () => {
    const { isAuthenticated: _isAuthenticated } = useAuth();

    const handleRetry = (): void => {
        window.location.reload();
    };

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
            <div
                style={{
                    fontSize: '64px',
                    marginBottom: spacing.lg,
                }}
            >
                ⚠️
            </div>
            <h1
                style={{
                    fontSize: typography.fontSize['heading-lg'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral.gray900,
                    marginBottom: spacing.md,
                    textAlign: 'center',
                }}
            >
                Sem Conexão com a Internet
            </h1>
            <p
                style={{
                    fontSize: typography.fontSize['text-md'],
                    color: colors.neutral.gray600,
                    marginBottom: spacing.xl,
                    textAlign: 'center',
                    maxWidth: '400px',
                }}
            >
                Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
            </p>
            <button
                onClick={handleRetry}
                style={{
                    padding: `${spacing.sm} ${spacing.xl}`,
                    backgroundColor: colors.brand.primary,
                    color: colors.neutral.white,
                    borderRadius: borderRadius.md,
                    border: 'none',
                    fontWeight: typography.fontWeight.medium,
                    fontSize: typography.fontSize['text-md'],
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.opacity = '1';
                }}
            >
                Tentar Novamente
            </button>
        </div>
    );
};

export const getServerSideProps = () => ({ props: {} });

export default NoInternetPage;
