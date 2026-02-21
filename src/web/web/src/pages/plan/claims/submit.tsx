import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClaimType } from 'src/web/shared/types/plan.types';
import { claimValidationSchema } from 'src/web/shared/utils/validation';
import { useClaims } from 'src/web/web/src/hooks/useClaims';
import { useJourneyContext } from 'src/web/web/src/context/JourneyContext';
import { MOBILE_PLAN_ROUTES } from 'src/web/shared/constants/routes';
import { FileUploader } from 'src/web/web/src/components/shared/FileUploader';
import { Button } from 'src/web/design-system/src/components/Button/Button';
import Input from 'src/web/design-system/src/components/Input/Input';
import { Select } from 'src/web/design-system/src/components/Select/Select';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

const { plan } = colors.journeys;

const STEPS = ['Tipo', 'Detalhes', 'Documentos', 'Revisar'];

/**
 * A React component that renders a multi-step form for submitting insurance claims.
 */
export const ClaimForm: React.FC = () => {
  const { currentJourney } = useJourneyContext();
  const [currentStep, setCurrentStep] = useState(0);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: yupResolver(claimValidationSchema),
    defaultValues: {
      procedureType: '',
      date: '',
      provider: '',
      amount: 0,
    },
  });

  const { submitClaim, submitting, submitError } = useClaims();
  const router = useRouter();
  const formValues = watch();

  const procedureTypeOptions = [
    { label: 'Medico', value: 'medical' },
    { label: 'Odontologico', value: 'dental' },
    { label: 'Oftalmologico', value: 'vision' },
    { label: 'Receita', value: 'prescription' },
    { label: 'Outro', value: 'other' },
  ];

  const onSubmit = async (data: any) => {
    try {
      await submitClaim({
        planId: 'plan-001',
        type: data.procedureType,
        procedureCode: 'procedure_code',
        providerName: data.provider,
        serviceDate: data.date,
        amount: parseFloat(data.amount),
        documents: [],
      });
      router.push(MOBILE_PLAN_ROUTES.CLAIMS);
    } catch (error) {
      console.error('Claim submission failed', error);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return !!formValues.procedureType;
      case 1: return !!formValues.provider && !!formValues.date && formValues.amount > 0;
      case 2: return true;
      case 3: return isValid;
      default: return false;
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: spacing.xl }}>
      {/* Step Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xl,
      }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: i <= currentStep ? plan.primary : colors.gray[20],
              color: i <= currentStep ? '#ffffff' : colors.gray[50],
              fontSize: typography.fontSize['text-sm'],
              fontWeight: typography.fontWeight.semiBold,
              fontFamily: typography.fontFamily.body,
            }}>
              {i < currentStep ? '\u2713' : i + 1}
            </div>
            <span style={{
              fontSize: typography.fontSize['text-xs'],
              color: i <= currentStep ? plan.primary : colors.gray[50],
              fontFamily: typography.fontFamily.body,
            }}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{
                width: spacing.lg,
                height: '2px',
                backgroundColor: i < currentStep ? plan.primary : colors.gray[20],
              }} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Type */}
        {currentStep === 0 && (
          <div>
            <h2 style={{
              fontSize: typography.fontSize['heading-lg'],
              fontWeight: typography.fontWeight.semiBold,
              color: plan.text,
              marginBottom: spacing.md,
              fontFamily: typography.fontFamily.heading,
            }}>
              Tipo de Procedimento
            </h2>
            <label htmlFor="procedureType" style={{
              fontSize: typography.fontSize['text-sm'],
              color: colors.gray[60],
              fontFamily: typography.fontFamily.body,
              marginBottom: spacing.xs,
              display: 'block',
            }}>
              Selecione o tipo
            </label>
            <Select
              id="procedureType"
              options={procedureTypeOptions}
              {...register('procedureType')}
            />
            {errors.procedureType && (
              <span style={{ color: colors.semantic.error, fontSize: typography.fontSize['text-xs'] }}>
                {errors.procedureType.message}
              </span>
            )}
          </div>
        )}

        {/* Step 1: Details */}
        {currentStep === 1 && (
          <div>
            <h2 style={{
              fontSize: typography.fontSize['heading-lg'],
              fontWeight: typography.fontWeight.semiBold,
              color: plan.text,
              marginBottom: spacing.md,
              fontFamily: typography.fontFamily.heading,
            }}>
              Detalhes do Atendimento
            </h2>

            <div style={{ marginBottom: spacing.md }}>
              <label htmlFor="date" style={labelStyle}>Data do Atendimento *</label>
              <Input type="date" id="date" {...register('date')} />
              {errors.date && (
                <span style={errorStyle}>{errors.date.message}</span>
              )}
            </div>

            <div style={{ marginBottom: spacing.md }}>
              <label htmlFor="provider" style={labelStyle}>Profissional / Clinica *</label>
              <Input type="text" id="provider" {...register('provider')} />
              {errors.provider && (
                <span style={errorStyle}>{errors.provider.message}</span>
              )}
            </div>

            <div style={{ marginBottom: spacing.md }}>
              <label htmlFor="amount" style={labelStyle}>Valor (R$) *</label>
              <Input type="number" id="amount" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && (
                <span style={errorStyle}>{errors.amount.message}</span>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <div>
            <h2 style={{
              fontSize: typography.fontSize['heading-lg'],
              fontWeight: typography.fontWeight.semiBold,
              color: plan.text,
              marginBottom: spacing.md,
              fontFamily: typography.fontFamily.heading,
            }}>
              Documentos
            </h2>
            <p style={{
              fontSize: typography.fontSize['text-md'],
              color: colors.gray[50],
              marginBottom: spacing.md,
              fontFamily: typography.fontFamily.body,
            }}>
              Anexe recibos, notas fiscais ou laudos medicos.
            </p>
            <FileUploader claimId="new_claim" />
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div>
            <h2 style={{
              fontSize: typography.fontSize['heading-lg'],
              fontWeight: typography.fontWeight.semiBold,
              color: plan.text,
              marginBottom: spacing.md,
              fontFamily: typography.fontFamily.heading,
            }}>
              Revisar Solicitacao
            </h2>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              border: `1px solid ${colors.gray[20]}`,
            }}>
              {[
                { label: 'Tipo', value: procedureTypeOptions.find((o) => o.value === formValues.procedureType)?.label || '-' },
                { label: 'Data', value: formValues.date || '-' },
                { label: 'Profissional', value: formValues.provider || '-' },
                { label: 'Valor', value: `R$ ${(formValues.amount || 0).toFixed(2)}` },
              ].map((row) => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: `${spacing.xs} 0`,
                  borderBottom: `1px solid ${colors.gray[10]}`,
                }}>
                  <span style={{
                    color: colors.gray[50],
                    fontSize: typography.fontSize['text-sm'],
                    fontFamily: typography.fontFamily.body,
                  }}>
                    {row.label}
                  </span>
                  <span style={{
                    color: plan.text,
                    fontSize: typography.fontSize['text-sm'],
                    fontWeight: typography.fontWeight.medium,
                    fontFamily: typography.fontFamily.body,
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {submitError && (
              <p style={{
                color: colors.semantic.error,
                fontSize: typography.fontSize['text-sm'],
                marginTop: spacing.sm,
              }}>
                Erro ao enviar solicitacao. Tente novamente.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: spacing.xl,
          gap: spacing.md,
        }}>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              style={{
                flex: 1,
                padding: spacing.sm,
                backgroundColor: colors.gray[10],
                border: 'none',
                borderRadius: borderRadius.md,
                cursor: 'pointer',
                fontSize: typography.fontSize['text-md'],
                fontWeight: typography.fontWeight.medium,
                color: colors.gray[60],
                fontFamily: typography.fontFamily.body,
              }}
            >
              Voltar
            </button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
              style={{
                flex: 2,
                padding: spacing.sm,
                backgroundColor: canProceed() ? plan.primary : colors.gray[30],
                color: '#ffffff',
                border: 'none',
                borderRadius: borderRadius.md,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                fontSize: typography.fontSize['text-md'],
                fontWeight: typography.fontWeight.semiBold,
                fontFamily: typography.fontFamily.body,
              }}
            >
              Proximo
            </button>
          ) : (
            <Button type="submit" disabled={!isValid || submitting}>
              Enviar Solicitacao
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'],
  color: colors.gray[60],
  fontFamily: typography.fontFamily.body,
  marginBottom: spacing.xs,
  display: 'block',
};

const errorStyle: React.CSSProperties = {
  color: colors.semantic.error,
  fontSize: typography.fontSize['text-xs'],
  fontFamily: typography.fontFamily.body,
};
