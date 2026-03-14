import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth } from '@/hooks/useAuth';

const ServerErrorPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated: _isAuthenticated } = useAuth();

    const handleRetry = (): void => {
        window.location.reload();
    };

    const handleHome = (): void => {
        void router.push('/');
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
                🔧
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
                Erro no Servidor
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
                Estamos trabalhando para resolver o problema. Por favor, tente novamente mais tarde.
            </p>
            <div
                style={{
                    display: 'flex',
                    gap: spacing.md,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
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
                <button
                    onClick={handleHome}
                    style={{
                        padding: `${spacing.sm} ${spacing.xl}`,
                        backgroundColor: colors.neutral.white,
                        color: colors.brand.primary,
                        borderRadius: borderRadius.md,
                        border: `1px solid ${colors.brand.primary}`,
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
                    Voltar ao Início
                </button>
            </div>
        </div>
    );
};

export const getStaticProps: GetStaticProps = () => ({ props: {} });

export default ServerErrorPage;
