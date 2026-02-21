import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import PlanLayout from '../../layouts/PlanLayout';
import { InsuranceCard } from 'src/web/design-system/src/plan/InsuranceCard';
import { useAuth } from '../../hooks/useAuth';
import { getDigitalCard } from '../../api/plan';
import { Plan } from 'src/web/shared/types/plan.types';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

const { plan } = colors.journeys;

/**
 * A Next.js page component that displays the digital insurance card
 * for the user's health plan with share and download actions.
 */
const DigitalCardPage: NextPage = () => {
  const { session, status, isAuthenticated, isLoading: authIsLoading } = useAuth();

  const { isLoading, error, data: digitalCardData } = useQuery(
    ['digitalCard', session?.accessToken],
    () => getDigitalCard(session?.accessToken, session?.accessToken),
    {
      enabled: isAuthenticated && !!session?.accessToken,
    }
  );

  if (status === 'loading' || isLoading || authIsLoading) {
    return (
      <PlanLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing['3xl'],
          color: colors.gray[50],
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize['text-md'],
        }}>
          Carregando cartao digital...
        </div>
      </PlanLayout>
    );
  }

  if (error) {
    return (
      <PlanLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing['3xl'],
          color: colors.semantic.error,
          fontFamily: typography.fontFamily.body,
          fontSize: typography.fontSize['text-md'],
        }}>
          Erro ao carregar cartao digital: {(error as Error).message}
        </div>
      </PlanLayout>
    );
  }

  return (
    <PlanLayout>
      <Head>
        <title>Meu Cartao Digital - AUSTA</title>
        <meta name="description" content="Visualize e compartilhe seu cartao digital do plano de saude AUSTA." />
      </Head>
      <div style={{ padding: spacing.xl, maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: typography.fontSize['heading-xl'],
          fontWeight: typography.fontWeight.semiBold,
          color: plan.text,
          marginBottom: spacing.xs,
          fontFamily: typography.fontFamily.heading,
        }}>
          Cartao Digital
        </h1>
        <p style={{
          fontSize: typography.fontSize['text-md'],
          color: colors.gray[50],
          marginBottom: spacing.xl,
          fontFamily: typography.fontFamily.body,
        }}>
          Seu cartao de saude digital para uso em consultas e atendimentos
        </p>

        {/* Insurance Card */}
        {digitalCardData && session?.accessToken && (
          <div style={{ marginBottom: spacing.xl }}>
            <InsuranceCard
              plan={digitalCardData.plan as Plan}
              user={{
                id: session.accessToken,
                name: session.accessToken,
                cpf: session.accessToken,
              }}
              onShare={() => shareCard()}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: spacing.md,
        }}>
          <button
            onClick={() => shareCard()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              padding: spacing.sm,
              backgroundColor: plan.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              fontSize: typography.fontSize['text-md'],
              fontWeight: typography.fontWeight.semiBold,
              fontFamily: typography.fontFamily.body,
            }}
          >
            Compartilhar
          </button>
          <button
            onClick={() => downloadCard()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              padding: spacing.sm,
              backgroundColor: '#ffffff',
              color: plan.primary,
              border: `2px solid ${plan.primary}`,
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              fontSize: typography.fontSize['text-md'],
              fontWeight: typography.fontWeight.semiBold,
              fontFamily: typography.fontFamily.body,
            }}
          >
            Baixar PDF
          </button>
        </div>

        {/* Info Note */}
        <p style={{
          fontSize: typography.fontSize['text-xs'],
          color: colors.gray[40],
          marginTop: spacing.lg,
          textAlign: 'center',
          fontFamily: typography.fontFamily.body,
        }}>
          Apresente este cartao digital em consultas e atendimentos.
          Ele possui a mesma validade do cartao fisico.
        </p>
      </div>
    </PlanLayout>
  );
};

/**
 * Function to share the digital insurance card via Web Share API.
 */
const shareCard = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Meu Cartao Digital AUSTA',
      text: 'Confira meu cartao digital do plano de saude AUSTA!',
      url: window.location.href,
    })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copiado para a area de transferencia!'))
      .catch(() => alert('Nao foi possivel copiar o link.'));
  }
};

/**
 * Function to trigger PDF download of the digital card.
 */
const downloadCard = () => {
  // In a real implementation, this would call an API to generate a PDF
  window.print();
};

export default DigitalCardPage;
