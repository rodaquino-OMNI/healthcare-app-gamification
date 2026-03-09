import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { savePersonalInfo } from '../../api/settings';

/**
 * Personal information settings page.
 * Allows users to view and edit their personal details.
 */
const PersonalInfoPage: NextPage = () => {
    const router = useRouter();
    const [name, setName] = useState('Maria Silva');
    const [dob, setDob] = useState('1990-03-15');
    const [gender, setGender] = useState('feminino');
    const [bloodType, setBloodType] = useState('O+');
    const [cpf, setCpf] = useState('123.456.789-00');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (): Promise<void> => {
        setLoading(true);
        setError('');
        try {
            await savePersonalInfo({ name, dob, gender, bloodType });
            void router.push('/settings');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar dados pessoais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Informacoes Pessoais</h1>
            <p style={subtitleStyle}>Mantenha seus dados atualizados para melhor atendimento.</p>

            <div style={cardStyle}>
                <div style={fieldGroup}>
                    <label htmlFor="pi-name" style={labelStyle}>
                        Nome Completo
                    </label>
                    <input
                        id="pi-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="pi-dob" style={labelStyle}>
                        Data de Nascimento
                    </label>
                    <input
                        id="pi-dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="pi-gender" style={labelStyle}>
                        Genero
                    </label>
                    <select
                        id="pi-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="outro">Outro</option>
                        <option value="prefiro-nao-dizer">Prefiro nao dizer</option>
                    </select>
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="pi-bloodtype" style={labelStyle}>
                        Tipo Sanguineo
                    </label>
                    <select
                        id="pi-bloodtype"
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        style={selectStyle}
                    >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={fieldGroup}>
                    <label htmlFor="pi-cpf" style={labelStyle}>
                        CPF
                    </label>
                    <input
                        id="pi-cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        style={inputStyle}
                        disabled
                    />
                    <span style={hintStyle}>O CPF nao pode ser alterado.</span>
                </div>

                {error && (
                    <p
                        style={{
                            color: 'red',
                            marginTop: spacing.sm,
                            fontSize: typography.fontSize['text-sm'],
                            fontFamily: typography.fontFamily.body,
                        }}
                    >
                        {error}
                    </p>
                )}
                <button onClick={() => void handleSave()} disabled={loading} style={primaryButtonStyle}>
                    {loading ? 'Salvando...' : 'Salvar Alteracoes'}
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

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: colors.gray[0],
};

const hintStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    marginTop: spacing['3xs'],
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
    marginTop: spacing.md,
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

export default PersonalInfoPage;
