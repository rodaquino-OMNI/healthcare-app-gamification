import React from 'react';
import { PlanLayout } from 'src/web/web/src/layouts/PlanLayout.tsx';
import { ClaimsWidget } from 'src/web/web/src/components/dashboard/ClaimsWidget.tsx';
import { Text, Button } from 'src/web/design-system/src/primitives';
import { WEB_PLAN_ROUTES } from 'src/web/shared/constants/routes.ts';

/**
 * The main dashboard component for the 'My Plan & Benefits' journey.
 * @returns {JSX.Element} The rendered dashboard with widgets and navigation.
 */
const PlanDashboard: React.FC = () => {
  // LD1: Renders the PlanLayout component to provide the basic layout.
  return (
    <PlanLayout>
      {/* LD1: Displays a heading for the Plan Dashboard. */}
      <Text fontSize="2xl" fontWeight="medium">
        Meu Plano & Benefícios
      </Text>

      {/* LD1: Includes the ClaimsWidget to show recent claims. */}
      <ClaimsWidget />

      {/* LD1: Includes a button to navigate to the coverage details page. */}
      <Button
        variant="primary"
        onPress={() => {
          window.location.href = WEB_PLAN_ROUTES.COVERAGE;
        }}
      >
        Ver detalhes da cobertura
      </Button>
    </PlanLayout>
  );
};

export default PlanDashboard;