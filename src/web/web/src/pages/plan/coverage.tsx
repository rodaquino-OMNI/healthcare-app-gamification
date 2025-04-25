import React from 'react';
import { NextSeo } from 'next-seo'; // next-seo@^5.0.0
import PlanLayout from '../../layouts/PlanLayout';
import CoverageInfoCard from 'src/web/design-system/src/plan/CoverageInfoCard';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorState from '../../components/shared/ErrorState';
import { useCoverage } from '../../hooks/useCoverage';
import { useAuth } from '../../hooks/useAuth';
import { Box, Text } from 'src/web/design-system/src/primitives';
import { Coverage } from 'src/web/shared/types/plan.types';

/**
 * The main component for the coverage page that displays insurance coverage information.
 * @returns {JSX.Element} The rendered coverage page
 */
const CoveragePage: React.FC = () => {
  // LD1: Use the useAuth hook to get the current user and authentication state
  const { session } = useAuth();

  // LD1: Get the user's active plan ID from the user object
  const planId = session?.accessToken;

  // LD1: Use the useCoverage hook to fetch coverage data for the active plan
  const { data: coverageData, isLoading, isError, refetch } = useCoverage(planId);

  // LD1: Handle loading state by displaying a LoadingIndicator
  if (isLoading) {
    return (
      <PlanLayout>
        <LoadingIndicator text="Carregando informa\u00e7\u00f5es de cobertura..." />
      </PlanLayout>
    );
  }

  // LD1: Handle error state by displaying an ErrorState with retry functionality
  if (isError) {
    return (
      <PlanLayout>
        <ErrorState message="Erro ao carregar informa\u00e7\u00f5es de cobertura. Tente novamente." onRetry={() => refetch()} />
      </PlanLayout>
    );
  }

  // LD1: Render the page title and description
  return (
    <PlanLayout>
      <NextSeo
        title="Cobertura do Plano - AUSTA"
        description="Visualize os detalhes da sua cobertura do plano de sa\u00fade."
      />
      <Box padding="md">
        <Text as="h1" fontSize="2xl" fontWeight="medium" marginBottom="md">
          Informa\u00e7\u00f5es de Cobertura
        </Text>
        <Text>
          Visualize os detalhes da sua cobertura do plano de sa\u00fade.
        </Text>

        {/* LD1: Group coverage items by type for better organization */}
        {coverageData && Object.entries(groupCoverageByType(coverageData)).map(([type, coverages]) => (
          <Box key={type} marginTop="lg">
            <Text as="h2" fontSize="xl" fontWeight="medium" marginBottom="sm">
              {type}
            </Text>
            {/* LD1: Map through the coverage data and render CoverageInfoCard components for each item */}
            {coverages.map((coverage) => (
              <CoverageInfoCard key={coverage.id} coverage={coverage} />
            ))}
          </Box>
        ))}
      </Box>
    </PlanLayout>
  );
};

/**
 * Next.js server-side function to handle authentication and redirect if needed.
 * @param {object} context
 * @returns {Promise<object>} Props or redirect object
 */
export async function getServerSideProps(context: any): Promise<object> {
  // LD1: Check if the user is authenticated by verifying the session
  const { req, res } = context;
  const session = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];

  // LD1: If not authenticated, redirect to the login page
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  // LD1: Return an empty props object if authentication is successful
  return {
    props: {},
  };
}

/**
 * Helper function to group coverage items by their type for better organization.
 * @param {Coverage[]} coverages
 * @returns {Record<string, Coverage[]>} Coverage items grouped by type
 */
function groupCoverageByType(coverages: Coverage[]): Record<string, Coverage[]> {
  // LD1: Initialize an empty object to store grouped coverage items
  const groupedCoverages: Record<string, Coverage[]> = {};

  // LD1: Iterate through the coverage array
  coverages.forEach((coverage) => {
    // LD1: Group items by their type property
    if (!groupedCoverages[coverage.type]) {
      groupedCoverages[coverage.type] = [];
    }
    groupedCoverages[coverage.type].push(coverage);
  });

  // LD1: Return the grouped object
  return groupedCoverages;
}

export default CoveragePage;