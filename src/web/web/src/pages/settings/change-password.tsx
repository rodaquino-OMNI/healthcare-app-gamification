import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';
import { changePassword } from '@web/web/src/api/auth';

/**
 * Change password page.
 * Allows users to update their account password.
 */
const ChangePasswordPage: NextPage = () => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setSuccess(false);
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Preencha todos os campos.');
            return;
        }
        if (newPassword.length < 8) {
            setError('A nova senha deve ter pelo menos 8 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas nao coincidem.');
            return;
        }
        setLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setSuccess(true);
            setTimeout(() => router.push('/settings'), 1500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao alterar senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '480px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Alterar Senha</h1>
            <p style={subtitleStyle}>Para sua seguranca, escolha uma senha forte.</p>

            <div style={cardStyle}>
                {error && <div style={errorStyle}>{error}</div>}
                {success && (
                    <div
                        style={{
                            backgroundColor: colors.semantic.successBg,
                            color: colors.semantic.success,
                            padding: spacing.sm,
                            borderRadius: borderRadius.sm,
                            marginBottom: spacing.md,
                            fontSize: typography.fontSize['text-sm'],
                            fontFamily: typography.fontFamily.body,
                        }}
                    >
                        Senha alterada com sucesso! Redirecionando...
                    </div>
                )}

                <div style={fieldGroup}>
                    <label style={labelStyle}>Senha Atual</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Digite sua senha atual"
                    />
                </div>

                <div style={fieldGroup}>
                    <label style={labelStyle}>Nova Senha</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Minimo 8 caracteres"
                    />
                </div>

                <div style={fieldGroup}>
                    <label style={labelStyle}>Confirmar Nova Senha</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Repita a nova senha"
                    />
                </div>

                <ul style={rulesStyle}>
                    <li>Minimo 8 caracteres</li>
                    <li>Ao menos uma letra maiuscula</li>
                    <li>Ao menos um numero</li>
                    <li>Ao menos um caractere especial</li>
                </ul>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ ...primaryButtonStyle, opacity: loading ? 0.6 : 1 }}
                >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                </button>
                <button onClick={() => router.back()} style={secondaryButtonStyle}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.body,
};
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const fieldGroup: React.CSSProperties = { marginBottom: spacing.lg };
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[60],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.body,
};
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: colors.gray[70],
    boxSizing: 'border-box',
};
const errorStyle: React.CSSProperties = {
    backgroundColor: colors.semantic.errorBg,
    color: colors.semantic.error,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    fontSize: typography.fontSize['text-sm'],
    fontFamily: typography.fontFamily.body,
};
const rulesStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    paddingLeft: spacing.lg,
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.body,
};
const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
};
const secondaryButtonStyle: React.CSSProperties = {
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

export default ChangePasswordPage;
