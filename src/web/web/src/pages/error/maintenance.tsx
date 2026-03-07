import React from 'react';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';

const MaintenancePage: React.FC = () => {
    const estimatedTime = '2 horas';

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
                🛠️
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
                Sistema em Manutenção
            </h1>
            <p
                style={{
                    fontSize: typography.fontSize['text-md'],
                    color: colors.neutral.gray600,
                    marginBottom: spacing.lg,
                    textAlign: 'center',
                    maxWidth: '400px',
                }}
            >
                Voltamos em breve!
            </p>
            <p
                style={{
                    fontSize: typography.fontSize['text-sm'],
                    color: colors.neutral.gray500,
                    textAlign: 'center',
                    maxWidth: '400px',
                }}
            >
                Tempo estimado: <strong>{estimatedTime}</strong>
            </p>
        </div>
    );
};

export default MaintenancePage;
