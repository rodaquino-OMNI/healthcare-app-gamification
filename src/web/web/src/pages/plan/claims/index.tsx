import React from 'react';
import type { NextPage } from 'next'; // next 13.0+
import { useRouter } from 'next/router'; // next/router 13.0+

import { ClaimCard } from 'src/web/design-system/src/plan/ClaimCard';
import { useClaims } from 'src/web/web/src/hooks/useClaims';
import { useJourney } from 'src/web/web/src/hooks/useJourney';

/**
 * Claims component: Displays a list of claims for the user.
 */
const Claims: NextPage = () => {
  // Fetch claims data using the useClaims hook
  const { claims, loading, error } = useClaims();

  // Access journey-specific theming and translations
  const { journey, t } = useJourney();

  // Get the router instance for navigation
  const router = useRouter();

  // Handle navigation to claim details page
  const handleViewClaimDetails = (claimId: string) => {
    router.push(`/plan/claims/${claimId}`);
  };

  // Handle navigation to claim submission page
  const handleAddClaim = () => {
    router.push('/plan/claims/submit');
  };

  // Render loading state
  if (loading) {
    return <div>{t('loading')}...</div>;
  }

  // Render error state
  if (error) {
    return <div>{t('error.claims')}</div>;
  }

  // Render claims list
  return (
    <div>
      <h1>{t('plan.claims.title')}</h1>
      {claims && claims.length > 0 ? (
        <ul>
          {claims.map((claim) => (
            <li key={claim.id}>
              <ClaimCard
                claim={claim}
                onViewDetails={() => handleViewClaimDetails(claim.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('plan.claims.noClaims')}</p>
      )}
      <button onClick={handleAddClaim}>{t('plan.claims.addClaim')}</button>
    </div>
  );
};

export default Claims;