import React, { useState, useEffect } from 'react'; // react@^18.0.0
import type { NextPage } from 'next'; // next@^13.0.0
import { useRouter } from 'next/router'; // next/router@^13.0.0
import PlanLayout from '../../layouts/PlanLayout';
import BenefitCard from '@austa/design-system/plan/BenefitCard'; // @austa/design-system/plan/BenefitCard
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorState from '../../components/shared/ErrorState';
import { useAuth } from '../../hooks/useAuth';
import { useJourney } from '../../hooks/useJourney';
import { Benefit } from '@austa/shared/types/plan.types'; // @austa/shared/types/plan.types

/**
 * The main component that renders the Benefits page within the Plan journey.
 * @returns {JSX.Element} The rendered Benefits page.
 */
const BenefitsPage: NextPage = () => {
  // LD1: Initialize state for benefits using useState hook
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  // LD1: Initialize state for loading status using useState hook
  const [loading, setLoading] = useState<boolean>(true);

  // LD1: Initialize state for error status using useState hook
  const [error, setError] = useState<string | null>(null);

  // LD1: Get the user information using the useAuth hook
  const { session } = useAuth();

  // LD1: Get the current journey using the useJourney hook
  const { journey } = useJourney();

  // LD1: Use useEffect to fetch benefits when the component mounts or when the user changes
  useEffect(() => {
    // Define an async function to fetch the benefits
    const loadBenefits = async () => {
      // LD1: Handle loading state while benefits are being fetched
      setLoading(true);
      setError(null);

      try {
        // Check if the user is authenticated and has a session
        if (session?.accessToken) {
          // Call the fetchBenefits function to retrieve the benefits
          const fetchedBenefits = await fetchBenefits(session.accessToken);

          // Update the benefits state with the fetched data
          setBenefits(fetchedBenefits);
        } else {
          // If the user is not authenticated, set an error message
          setError('User not authenticated');
        }
      } catch (err: any) {
        // LD1: Handle error state if benefits cannot be loaded
        setError(err.message || 'Failed to load benefits');
      } finally {
        // Set loading to false once the fetch operation is complete
        setLoading(false);
      }
    };

    // Call the loadBenefits function when the component mounts or when the user changes
    loadBenefits();
  }, [session]);

  // LD1: Render the benefits list using BenefitCard components
  let content;
  if (loading) {
    content = <LoadingIndicator text="Carregando seus benef\u00edcios..." />;
  } else if (error) {
    content = (
      <ErrorState
        message={`Erro ao carregar seus benef\u00edcios: ${error}`}
        onRetry={() => {
          setLoading(true);
          setError(null);
          fetchBenefits(session?.accessToken || '');
        }} // LD1: Provide a retry function to reload benefits if there was an error
      />
    );
  } else {
    content = (
      <div>
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
    );
  }

  return (
    <PlanLayout>
      {content}
    </PlanLayout>
  );
};

/**
 * Fetches the benefits associated with the user's active insurance plan.
 * @param {string} userId - The ID of the user whose benefits to fetch.
 * @returns {Promise<Benefit[]>} A promise that resolves to an array of benefits.
 */
async function fetchBenefits(userId: string): Promise<Benefit[]> {
  // LD1: Make an API call to fetch benefits for the specified user
  const apiUrl = `/api/plan/benefits?userId=${userId}`;

  try {
    // Make an API call to fetch benefits for the specified user
    const response = await fetch(apiUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch benefits: ${response.status}`);
    }

    // LD1: Transform the API response into Benefit objects
    const data = await response.json();
    return data as Benefit[];
  } catch (error: any) {
    // LD1: Handle any errors that occur during the fetch operation
    console.error('There was an error fetching the benefits:', error);
    throw new Error(`Failed to fetch benefits: ${error.message}`);
  }
}

// LD1: Exports the BenefitsPage component as the default export for this page.
export default BenefitsPage;