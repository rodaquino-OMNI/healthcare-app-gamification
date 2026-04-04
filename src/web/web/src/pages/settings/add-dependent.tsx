import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter';
import { useSettings } from '@/hooks/useSettings';

/**
 * Add dependent form page.
 * Allows users to register a new dependent on their health plan.
 */
const AddDependentPage: NextPage = () => {
    const { t: _t } = useTranslation();
    const router = useRouter();
    const { addDependent } = useSettings();
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [dob, setDob] = useState('');
    const [relationship, setRelationship] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (): Promise<void> => {
        if (!name || !cpf || !dob || !relationship) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            await addDependent({ name, cpf, dob, relationship, gender });
            void router.push('/settings/dependents');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao adicionar dependente.');
        } finally {
            setLoading(false);
        }
    };

    const isValid = name && cpf && dob && relationship;

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Adicionar Dependente</h1>
            <p style={subtitleStyle}>Preencha os dados do novo dependente.</p>

            <div style={cardStyle}>
                <div style={fieldGroup}>
                    <label htmlFor="dep-name" style={labelStyle}>
                        Nome Completo *
                    </label>
                    <input
                        id="dep-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        placeholder="Nome do dependente"
                    />
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="dep-cpf" style={labelStyle}>
                        CPF *
                    </label>
                    <input
                        id="dep-cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        style={inputStyle}
                        placeholder="000.000.000-00"
                    />
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="dep-dob" style={labelStyle}>
                        Data de Nascimento *
                    </label>
                    <input
                        id="dep-dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="dep-relationship" style={labelStyle}>
                        Parentesco *
                    </label>
                    <select
                        id="dep-relationship"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Selecione...</option>
                        <option value="conjuge">Conjuge</option>
                        <option value="filho">Filho(a)</option>
                        <option value="pai">Pai</option>
                        <option value="mae">Mae</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="dep-gender" style={labelStyle}>
                        Genero
                    </label>
                    <select
                        id="dep-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Selecione...</option>
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                {error ? <p style={errorStyle}>{error}</p> : null}

                <button
                    onClick={() => void handleSubmit()}
                    disabled={!isValid || loading}
                    style={{
                        ...primaryButtonStyle,
                        backgroundColor: isValid && !loading ? colors.brand.primary : colors.gray[30],
                        cursor: isValid && !loading ? 'pointer' : 'not-allowed',
                    }}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar Dependente'}
                </button>
                <button onClick={() => router.back()} style={secondaryButtonStyle} disabled={loading}>
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
const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: colors.gray[0],
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
const errorStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.semantic.error,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.body,
};

export const getServerSideProps = () => ({ props: {} });

export default AddDependentPage;
