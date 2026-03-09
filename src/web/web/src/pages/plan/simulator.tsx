import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';

import PlanLayout from '../../layouts/PlanLayout';

const { plan } = colors.journeys;

interface SimulationResult {
    baseCost: number;
    coveragePercent: number;
    planCoverage: number;
    outOfPocket: number;
}

const PROCEDURE_OPTIONS = [
    { value: 'consultation', label: 'Consulta Medica', baseCost: 150 },
    { value: 'labTest', label: 'Exame Laboratorial', baseCost: 200 },
    { value: 'imaging', label: 'Exame de Imagem', baseCost: 500 },
    { value: 'surgery', label: 'Cirurgia', baseCost: 3000 },
    { value: 'physicalTherapy', label: 'Fisioterapia', baseCost: 100 },
    { value: 'dental', label: 'Odontologico', baseCost: 250 },
    { value: 'mental', label: 'Saude Mental', baseCost: 180 },
];

const PROVIDER_OPTIONS = [
    { value: 'in-network', label: 'Rede Credenciada', coverageBonus: 0 },
    { value: 'out-network', label: 'Fora da Rede', coverageBonus: -20 },
    { value: 'reference', label: 'Centro de Referencia', coverageBonus: 5 },
];

/**
 * Cost Simulator page allowing users to estimate healthcare costs
 * based on procedure type and provider network.
 */
const CostSimulatorPage: NextPage = () => {
    const [procedureType, setProcedureType] = useState('');
    const [providerType, setProviderType] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [result, setResult] = useState<SimulationResult | null>(null);

    const handleSimulate = (): void => {
        const procedure = PROCEDURE_OPTIONS.find((p) => p.value === procedureType);
        const provider = PROVIDER_OPTIONS.find((p) => p.value === providerType);
        if (!procedure || !provider) {
            return;
        }

        const baseCost = customAmount ? parseFloat(customAmount) : procedure.baseCost;
        if (isNaN(baseCost) || baseCost <= 0) {
            return;
        }

        const coveragePercent = Math.min(100, Math.max(0, 80 + provider.coverageBonus));
        const planCoverage = baseCost * (coveragePercent / 100);
        const outOfPocket = baseCost - planCoverage;

        setResult({
            baseCost,
            coveragePercent,
            planCoverage,
            outOfPocket,
        });
    };

    const formatCurrency = (value: number): string => `R$ ${value.toFixed(2).replace('.', ',')}`;

    return (
        <PlanLayout>
            <div style={{ padding: spacing.xl, maxWidth: '720px', margin: '0 auto' }}>
                <h1
                    style={{
                        fontSize: typography.fontSize['heading-xl'],
                        fontWeight: typography.fontWeight.semiBold,
                        color: plan.text,
                        marginBottom: spacing.xs,
                        fontFamily: typography.fontFamily.heading,
                    }}
                >
                    Simulador de Custos
                </h1>
                <p
                    style={{
                        fontSize: typography.fontSize['text-md'],
                        color: colors.gray[50],
                        marginBottom: spacing.xl,
                        fontFamily: typography.fontFamily.body,
                    }}
                >
                    Simule o custo estimado de procedimentos com base na sua cobertura
                </p>

                {/* Form */}
                <div
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: borderRadius.md,
                        padding: spacing.xl,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        marginBottom: spacing.xl,
                    }}
                >
                    {/* Procedure Type */}
                    <div style={{ marginBottom: spacing.lg }}>
                        <label htmlFor="procedureType" style={labelStyle}>
                            Tipo de Procedimento
                        </label>
                        <select
                            id="procedureType"
                            value={procedureType}
                            onChange={(e) => setProcedureType(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="">Selecione...</option>
                            {PROCEDURE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Provider Type */}
                    <div style={{ marginBottom: spacing.lg }}>
                        <label htmlFor="providerType" style={labelStyle}>
                            Tipo de Prestador
                        </label>
                        <select
                            id="providerType"
                            value={providerType}
                            onChange={(e) => setProviderType(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="">Selecione...</option>
                            {PROVIDER_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Custom Amount */}
                    <div style={{ marginBottom: spacing.lg }}>
                        <label htmlFor="customAmount" style={labelStyle}>
                            Valor Customizado (opcional)
                        </label>
                        <input
                            id="customAmount"
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Deixe em branco para usar valor padrao"
                            style={inputStyle}
                        />
                    </div>

                    {/* Simulate Button */}
                    <button
                        onClick={handleSimulate}
                        disabled={!procedureType || !providerType}
                        style={{
                            width: '100%',
                            padding: spacing.sm,
                            backgroundColor: procedureType && providerType ? plan.primary : colors.gray[30],
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: borderRadius.md,
                            cursor: procedureType && providerType ? 'pointer' : 'not-allowed',
                            fontSize: typography.fontSize['text-md'],
                            fontWeight: typography.fontWeight.semiBold,
                            fontFamily: typography.fontFamily.body,
                        }}
                    >
                        Simular Custo
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: borderRadius.md,
                            padding: spacing.xl,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            borderLeft: `4px solid ${plan.primary}`,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: typography.fontSize['heading-lg'],
                                fontWeight: typography.fontWeight.semiBold,
                                color: plan.text,
                                marginBottom: spacing.md,
                                fontFamily: typography.fontFamily.heading,
                            }}
                        >
                            Resultado da Simulacao
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            <div style={resultRowStyle}>
                                <span style={resultLabelStyle}>Custo Base</span>
                                <span style={resultValueStyle}>{formatCurrency(result.baseCost)}</span>
                            </div>
                            <div style={resultRowStyle}>
                                <span style={resultLabelStyle}>Cobertura do Plano</span>
                                <span style={{ ...resultValueStyle, color: colors.semantic.success }}>
                                    {result.coveragePercent}%
                                </span>
                            </div>
                            <div style={resultRowStyle}>
                                <span style={resultLabelStyle}>Valor Coberto</span>
                                <span style={{ ...resultValueStyle, color: colors.semantic.success }}>
                                    -{formatCurrency(result.planCoverage)}
                                </span>
                            </div>
                            <div
                                style={{
                                    ...resultRowStyle,
                                    borderTop: `2px solid ${plan.primary}`,
                                    paddingTop: spacing.md,
                                    marginTop: spacing.xs,
                                }}
                            >
                                <span
                                    style={{
                                        ...resultLabelStyle,
                                        fontWeight: typography.fontWeight.bold,
                                        fontSize: typography.fontSize['text-lg'],
                                    }}
                                >
                                    Seu Custo Estimado
                                </span>
                                <span
                                    style={{
                                        fontSize: typography.fontSize['heading-xl'],
                                        fontWeight: typography.fontWeight.bold,
                                        color: plan.primary,
                                        fontFamily: typography.fontFamily.heading,
                                    }}
                                >
                                    {formatCurrency(result.outOfPocket)}
                                </span>
                            </div>
                        </div>

                        <p
                            style={{
                                fontSize: typography.fontSize['text-xs'],
                                color: colors.gray[40],
                                marginTop: spacing.md,
                                fontFamily: typography.fontFamily.body,
                            }}
                        >
                            * Valores estimados. O custo final pode variar conforme o prestador e procedimento
                            realizado.
                        </p>
                    </div>
                )}
            </div>
        </PlanLayout>
    );
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
    color: plan.text,
    backgroundColor: '#ffffff',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: plan.text,
    boxSizing: 'border-box',
};

const resultRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.xs} 0`,
};

const resultLabelStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    color: colors.gray[50],
    fontFamily: typography.fontFamily.body,
};

const resultValueStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-lg'],
    fontWeight: typography.fontWeight.semiBold,
    color: plan.text,
    fontFamily: typography.fontFamily.body,
};

export default CostSimulatorPage;
