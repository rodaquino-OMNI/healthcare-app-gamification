import React, { useState, useEffect } from 'react';
import { NextPage } from 'next'; // next@^13.0.0
import { Head } from 'next/head'; // next/head@^13.0.0
import { useQuery } from '@tanstack/react-query'; // @tanstack/react-query@^4.0.0
import PlanLayout from '../../layouts/PlanLayout';
import { InsuranceCard } from 'src/web/design-system/src/plan/InsuranceCard';
import { useAuth } from '../../hooks/useAuth';
import { getDigitalCard } from '../../api/plan';
import { Plan } from 'src/web/shared/types/plan.types';

/**
 * A Next.js page component that displays the digital insurance card for the user's health plan
 */
const DigitalCardPage: NextPage = () => {
  // LD1: Get the user's authentication state using the useAuth hook
  const { session, status, isAuthenticated, isLoading: authIsLoading } = useAuth();

  // LD1: Use the useQuery hook to fetch the digital card data for the user's plan
  const { isLoading, error, data: digitalCardData } = useQuery(
    ['digitalCard', session?.accessToken],
    () => getDigitalCard(session?.accessToken, session?.accessToken),
    {
      enabled: isAuthenticated && !!session?.accessToken, // Only run the query if the user is authenticated and has a token
    }
  );

  // LD1: Handle loading and error states
  if (status === 'loading' || isLoading || authIsLoading) {
    return (
      <PlanLayout>
        <div>Loading digital card...</div>
      </PlanLayout>
    );
  }

  if (error) {
    return (
      <PlanLayout>
        <div>Error loading digital card: {error.message}</div>
      </PlanLayout>
    );
  }

  // LD1: Render the InsuranceCard component with the fetched plan and user data
  return (
    <PlanLayout>
      <Head>
        <title>Meu Cartão Digital - AUSTA</title>
        <meta name="description" content="Visualize e compartilhe seu cartão digital do plano de saúde AUSTA." />
      </Head>
      {digitalCardData && session?.accessToken && (
        <InsuranceCard
          plan={digitalCardData.plan as Plan}
          user={{
            id: session.accessToken,
            name: session.accessToken,
            cpf: session.accessToken,
          }}
          onShare={() => shareCard()}
        />
      )}
    </PlanLayout>
  );
};

/**
 * Function to share the digital insurance card
 */
const shareCard = () => {
  // LD1: Check if the Web Share API is available in the browser
  if (navigator.share) {
    // LD1: If available, use the navigator.share API to share the card
    navigator.share({
      title: 'Meu Cartão Digital AUSTA',
      text: 'Confira meu cartão digital do plano de saúde AUSTA!',
      url: window.location.href,
    })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    // LD1: If not available, provide a fallback mechanism (e.g., copy to clipboard)
    alert('Web Share API is not supported in this browser. Please copy the URL to share.');
  }
};

export default DigitalCardPage;