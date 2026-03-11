import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { logout as apiLogout } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';

/**
 * Logout confirmation page.
 * Asks users to confirm before signing out.
 */
const LogoutPage: NextPage = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async (): Promise<void> => {
        setLoading(true);
        try {
            await logout();
        } catch {
            // If hook logout fails, fall back to direct API call
            try {
                await apiLogout();
            } catch {
                // Continue with local cleanup even if API fails
            }
        }
        localStorage.clear();
        document.cookie.split(';').forEach((c) => {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        void router.push('/auth/login');
    };

    return (
        <div
            style={{
                padding: spacing.xl,
                maxWidth: '400px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '60vh',
                justifyContent: 'center',
            }}
        >
            <div style={cardStyle}>
                <div style={{ textAlign: 'center' as const, marginBottom: spacing.xl }}>
                    <div style={iconStyle}>?</div>
                    <h1 style={titleStyle}>Sair da Conta</h1>
                    <p style={descStyle}>
                        Tem certeza que deseja sair? Voce precisara fazer login novamente para acessar o app.
                    </p>
                </div>

                <button
                    onClick={() => void handleLogout()}
                    disabled={loading}
                    style={{ ...logoutBtnStyle, opacity: loading ? 0.6 : 1 }}
                >
                    {loading ? 'Saindo...' : 'Sim, Sair'}
                </button>
                <button onClick={() => router.back()} style={cancelBtnStyle}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing['2xl'],
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    width: '100%',
};
const iconStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: colors.semantic.warningBg,
    color: colors.semantic.warning,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.bold,
    margin: '0 auto',
    marginBottom: spacing.md,
};
const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-lg'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const descStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    lineHeight: typography.lineHeight.base,
    fontFamily: typography.fontFamily.body,
};
const logoutBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: colors.semantic.error,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
};
const cancelBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: 'transparent',
    color: colors.gray[50],
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.xs,
};

export default LogoutPage;
