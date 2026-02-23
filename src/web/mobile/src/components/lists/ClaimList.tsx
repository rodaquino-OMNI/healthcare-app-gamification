import React from 'react'; // React, v18.0+
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native, ^6.0.0
import { Claim } from '@shared/types/plan.types'; // Defines the structure of claim data.
import { useClaims } from '@hooks/useClaims'; // Fetches claims data for the current user.
import EmptyState from '@components/shared/EmptyState'; // Displays a message when there are no claims to show.
import { Card } from '@design-system/components/Card/Card'; // Provides a styled container for claim information.

/**
 * Renders a list of claims or an empty state message if no claims are available.
 * @returns A list of ClaimCard components or an EmptyState component.
 */
export const ClaimList: React.FC = () => {
  // Fetches claims data using the `useClaims` hook.
  const { claims, isLoading, error } = useClaims('your_plan_id'); // Replace 'your_plan_id' with the actual plan ID

  // Access the navigation object
  const navigation = useNavigation();

  // If loading, display a loading indicator.
  if (isLoading) {
    return <p>Loading claims...</p>; // Replace with a proper loading component
  }

  // If there is an error, display an error message.
  if (error) {
    return <p>Error: {error.message}</p>; // Replace with a proper error component
  }

  // If there are no claims, display an EmptyState component.
  if (!claims || claims.length === 0) {
    return (
      <EmptyState
        icon="document"
        title="No claims found"
        description="Submit a new claim to get started."
        actionLabel="Submit Claim"
        onAction={() => (navigation as any).navigate('ClaimSubmission')}
        journey="plan"
      />
    );
  }

  // If there are claims, render a list of ClaimCard components.
  return (
    <ul>
      {claims.map((claim: Claim) => (
        <li key={claim.id}>
          <Card>
            {/* Implement ClaimCard component here to display claim details */}
            {/* Example: */}
            <p>Claim ID: {claim.id}</p>
            <p>Type: {claim.type}</p>
            <p>Amount: {claim.amount}</p>
            <p>Status: {claim.status}</p>
            <p>Submitted At: {claim.submittedAt}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
};