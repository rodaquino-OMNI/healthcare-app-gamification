import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { deleteAccount } from '@/api/auth';

/**
 * Account deletion page.
 * Shows consequences and requires confirmation before deleting.
 */
const DeleteAccountPage: NextPage = () => {
    const router = useRouter();
    const [confirmed, setConfirmed] = useState(false);
    const [password, setPassword] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const consequences = [
        'Todos os seus dados pessoais serao removidos permanentemente',
        'Historico de consultas e exames sera apagado',
        'Conquistas e recompensas de gamificacao serao perdidas',
        'Dados do plano de saude serao desvinculados',
        'Esta acao nao pode ser desfeita',
    ];

    const handleDelete = async (): Promise<void> => {
        if (!confirmed || !password) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            await deleteAccount(password, reason || undefined);
            localStorage.clear();
            void router.push('/auth/login');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Excluir Conta</h1>
            <p style={subtitleStyle}>Leia atentamente antes de prosseguir. Esta acao e irreversivel.</p>

            {/* Consequences */}
            <div style={dangerCardStyle}>
                <h2 style={{ ...sectionTitleStyle, color: colors.semantic.error }}>Consequencias</h2>
                <ul style={{ paddingLeft: spacing.lg, margin: 0 }}>
                    {consequences.map((c, i) => (
                        <li key={i} style={consequenceStyle}>
                            {c}
                        </li>
                    ))}
                </ul>
            </div>

            {error && (
                <div
                    style={{
                        backgroundColor: colors.semantic.errorBg,
                        color: colors.semantic.error,
                        padding: spacing.sm,
                        borderRadius: borderRadius.sm,
                        marginTop: spacing.md,
                        fontSize: typography.fontSize['text-sm'],
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Reason */}
            <div style={{ ...cardStyle, marginTop: spacing.md }}>
                <label htmlFor="delete-reason" style={labelStyle}>
                    Motivo (opcional)
                </label>
                <select
                    id="delete-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Selecione um motivo...</option>
                    <option value="privacy">Preocupacoes com privacidade</option>
                    <option value="not-using">Nao uso mais o app</option>
                    <option value="other-plan">Mudei de plano de saude</option>
                    <option value="experience">Experiencia insatisfatoria</option>
                    <option value="other">Outro</option>
                </select>
            </div>

            {/* Confirmation */}
            <div style={{ ...cardStyle, marginTop: spacing.md }}>
                <label htmlFor="delete-password" style={labelStyle}>
                    Confirme sua senha
                </label>
                <input
                    id="delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    style={inputStyle}
                />

                <label style={checkLabelStyle}>
                    <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        style={{ marginRight: spacing.xs, accentColor: colors.semantic.error }}
                    />
                    Entendo que esta acao e permanente e irreversivel
                </label>

                <button
                    onClick={() => void handleDelete()}
                    disabled={!confirmed || !password}
                    style={{
                        ...dangerButtonStyle,
                        opacity: confirmed && password ? 1 : 0.5,
                        cursor: confirmed && password ? 'pointer' : 'not-allowed',
                    }}
                >
                    {loading ? 'Excluindo...' : 'Excluir Minha Conta'}
                </button>
                <button onClick={() => router.back()} style={cancelButtonStyle}>
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
const dangerCardStyle: React.CSSProperties = {
    ...cardStyle,
    borderLeft: `4px solid ${colors.semantic.error}`,
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const consequenceStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[60],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.body,
    lineHeight: typography.lineHeight.base,
};
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[60],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.body,
};
const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: colors.gray[70],
    backgroundColor: colors.gray[0],
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
const checkLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing.lg,
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[60],
    fontFamily: typography.fontFamily.body,
    cursor: 'pointer',
};
const dangerButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: colors.semantic.error,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.xl,
};
const cancelButtonStyle: React.CSSProperties = {
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

export default DeleteAccountPage;
