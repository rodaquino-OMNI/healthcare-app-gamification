import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useSettings } from '@/hooks/useSettings';

/**
 * Address list management page.
 * Shows saved addresses with options to edit or remove.
 */
const AddressesPage: NextPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { addresses, isLoading: loading, error: hookError, removeAddress } = useSettings();
    const [error, setError] = useState('');

    const handleRemove = async (id: string): Promise<void> => {
        setError('');
        try {
            await removeAddress(id);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : (hookError ?? 'Erro ao remover endereco.'));
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Meus Enderecos</h1>
            <p style={subtitleStyle}>Gerencie seus enderecos cadastrados.</p>

            {error && <div style={errorStyle}>{error}</div>}

            {loading && (
                <p
                    style={{
                        color: colors.gray[50],
                        fontFamily: typography.fontFamily.body,
                        fontSize: typography.fontSize['text-sm'],
                    }}
                >
                    {t('common.loading')}
                </p>
            )}

            {!loading &&
                addresses.map((addr) => (
                    <div key={addr.id} style={{ ...cardStyle, marginBottom: spacing.md }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: spacing.sm,
                            }}
                        >
                            <h3 style={addrLabelStyle}>{addr.label}</h3>
                            {addr.isPrimary && <span style={primaryBadgeStyle}>Principal</span>}
                        </div>
                        <p style={addrLineStyle}>
                            {addr.street}, {addr.number}
                        </p>
                        {addr.complement && <p style={addrLineStyle}>{addr.complement}</p>}
                        <p style={addrLineStyle}>
                            {addr.neighborhood} - {addr.city}/{addr.state}
                        </p>
                        <p style={addrLineStyle}>CEP: {addr.cep}</p>

                        <div style={{ display: 'flex', gap: spacing.xs, marginTop: spacing.md }}>
                            <button style={editBtnStyle}>Editar</button>
                            <button onClick={() => void handleRemove(addr.id)} style={removeBtnStyle}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}

            <button onClick={() => void router.push('/settings/add-address')} style={addBtnStyle}>
                + Adicionar Endereco
            </button>
        </div>
    );
};

const errorStyle: React.CSSProperties = {
    backgroundColor: colors.semantic.errorBg,
    border: `1px solid ${colors.semantic.error}`,
    borderRadius: 6,
    color: colors.semantic.error,
    fontSize: 14,
    padding: '10px 14px',
    marginBottom: 16,
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
    padding: spacing.lg,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const addrLabelStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    margin: 0,
    fontFamily: typography.fontFamily.body,
};
const primaryBadgeStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    fontWeight: typography.fontWeight.medium,
    color: colors.brand.primary,
    backgroundColor: colors.brandPalette[50],
    padding: `${spacing['3xs']} ${spacing.xs}`,
    borderRadius: borderRadius.full,
};
const addrLineStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    margin: `${spacing['3xs']} 0`,
    fontFamily: typography.fontFamily.body,
};
const editBtnStyle: React.CSSProperties = {
    flex: 1,
    padding: spacing.xs,
    backgroundColor: colors.gray[10],
    color: colors.gray[60],
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontFamily: typography.fontFamily.body,
};
const removeBtnStyle: React.CSSProperties = {
    padding: `${spacing.xs} ${spacing.md}`,
    backgroundColor: 'transparent',
    color: colors.semantic.error,
    border: `1px solid ${colors.semantic.error}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontFamily: typography.fontFamily.body,
};
const addBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: colors.gray[0],
    color: colors.brand.primary,
    border: `2px dashed ${colors.brand.primary}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.md,
};

export const getServerSideProps = () => ({ props: {} });

export default AddressesPage;
