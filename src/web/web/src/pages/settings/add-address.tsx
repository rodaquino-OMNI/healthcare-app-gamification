import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { lookupCep, saveAddress } from '../../api/settings';

/**
 * Add address form page with CEP lookup.
 * Allows users to register a new address.
 */
const AddAddressPage: NextPage = () => {
    const router = useRouter();
    const [label, setLabel] = useState('');
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCepLookup = async (): Promise<void> => {
        if (!cep || cep.length < 8) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await lookupCep(cep);
            setStreet(data.logradouro || '');
            setNeighborhood(data.bairro || '');
            setCity(data.localidade || '');
            setState(data.uf || '');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao buscar CEP.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (): Promise<void> => {
        if (!label || !cep || !street || !number || !city || !state) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            await saveAddress({ label, cep, street, number, complement, neighborhood, city, state });
            void router.push('/settings/addresses');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    const isValid = label && cep && street && number && city && state;

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Adicionar Endereco</h1>
            <p style={subtitleStyle}>Preencha o CEP para buscar o endereco automaticamente.</p>

            {error && <div style={errorStyle}>{error}</div>}

            <div style={cardStyle}>
                <div style={fieldGroup}>
                    <label htmlFor="addr-label" style={labelStyle}>
                        Apelido do Endereco *
                    </label>
                    <input
                        id="addr-label"
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        style={inputStyle}
                        placeholder="Ex: Casa, Trabalho"
                    />
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="addr-cep" style={labelStyle}>
                        CEP *
                    </label>
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                        <input
                            id="addr-cep"
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            style={{ ...inputStyle, flex: 1 }}
                            placeholder="00000-000"
                            maxLength={9}
                        />
                        <button onClick={() => void handleCepLookup()} disabled={loading} style={lookupBtnStyle}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="addr-street" style={labelStyle}>
                        Rua *
                    </label>
                    <input
                        id="addr-street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.lg }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="addr-number" style={labelStyle}>
                            Numero *
                        </label>
                        <input
                            id="addr-number"
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ flex: 2 }}>
                        <label htmlFor="addr-complement" style={labelStyle}>
                            Complemento
                        </label>
                        <input
                            id="addr-complement"
                            type="text"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            style={inputStyle}
                            placeholder="Apto, Bloco, etc."
                        />
                    </div>
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="addr-neighborhood" style={labelStyle}>
                        Bairro
                    </label>
                    <input
                        id="addr-neighborhood"
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.lg }}>
                    <div style={{ flex: 3 }}>
                        <label htmlFor="addr-city" style={labelStyle}>
                            Cidade *
                        </label>
                        <input
                            id="addr-city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="addr-uf" style={labelStyle}>
                            UF *
                        </label>
                        <input
                            id="addr-uf"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={inputStyle}
                            maxLength={2}
                        />
                    </div>
                </div>

                <button
                    onClick={() => void handleSubmit()}
                    disabled={!isValid || loading}
                    style={{
                        ...primaryButtonStyle,
                        backgroundColor: isValid && !loading ? colors.brand.primary : colors.gray[30],
                        cursor: isValid && !loading ? 'pointer' : 'not-allowed',
                    }}
                >
                    {loading ? 'Salvando...' : 'Salvar Endereco'}
                </button>
                <button onClick={() => router.back()} style={secondaryButtonStyle}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

const errorStyle: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    color: '#b91c1c',
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
const lookupBtnStyle: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
    whiteSpace: 'nowrap',
};
const primaryButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
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

export default AddAddressPage;
