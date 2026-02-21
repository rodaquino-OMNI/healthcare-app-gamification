import React from 'react';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';

const ForceUpdatePage: React.FC = () => {
  const currentVersion = '1.0.0';
  const requiredVersion = '1.1.0';

  const handleUpdate = () => {
    window.location.reload();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: spacing['2xl'],
      fontFamily: typography.fontFamily.body,
      backgroundColor: colors.neutral.white,
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: spacing.lg,
      }}>
        📱
      </div>
      <h1 style={{
        fontSize: typography.fontSize['heading-lg'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral.gray900,
        marginBottom: spacing.md,
        textAlign: 'center',
      }}>
        Atualização Necessária
      </h1>
      <p style={{
        fontSize: typography.fontSize['text-md'],
        color: colors.neutral.gray600,
        marginBottom: spacing.lg,
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        Uma nova versão do aplicativo está disponível. Por favor, atualize para continuar.
      </p>
      <div style={{
        backgroundColor: colors.neutral.gray100,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.xl,
        width: '100%',
        maxWidth: '300px',
      }}>
        <p style={{
          fontSize: typography.fontSize['text-sm'],
          color: colors.neutral.gray600,
          margin: `0 0 ${spacing.xs} 0`,
        }}>
          Versão atual: <strong>{currentVersion}</strong>
        </p>
        <p style={{
          fontSize: typography.fontSize['text-sm'],
          color: colors.neutral.gray600,
          margin: 0,
        }}>
          Versão necessária: <strong>{requiredVersion}</strong>
        </p>
      </div>
      <button
        onClick={handleUpdate}
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
        Atualizar Agora
      </button>
    </div>
  );
};

export default ForceUpdatePage;
