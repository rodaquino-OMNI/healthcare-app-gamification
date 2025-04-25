import React from 'react';
import { useRouter } from 'next/router'; // next/router 13.0+

import {
  JourneyCard,
  useAuth,
  useHealthMetrics,
  useAppointments,
  useClaims,
  useGamification,
  useJourney,
  MainLayout,
  MetricsWidget,
  AppointmentsWidget,
  ClaimsWidget,
  RecentActivityWidget,
  AchievementsWidget,
} from 'src/web/web/src/components/index';

/**
 * Renders the home page with journey cards and summary widgets.
 * @returns {JSX.Element} The rendered home page.
 */
const Home: React.FC = () => {
  // Call the useAuth hook to get the authentication status and user information.
  const { isAuthenticated } = useAuth();

  // Call the useHealthMetrics hook to get the health metrics data.
  const { metrics } = useHealthMetrics('user-123', []);

  // Call the useAppointments hook to get the appointments data.
  const { appointments } = useAppointments();

  // Call the useClaims hook to get the claims data.
  const { claims } = useClaims();

  // Call the useGamification hook to get the gamification data.
  const { gameProfile } = useGamification('user-123');

  // Call the useJourney hook to get the journey theming.
  const { journey } = useJourney();

  // Render the MainLayout component.
  return (
    <MainLayout>
      {/* Render the JourneyCard components for each journey. */}
      <JourneyCard journey="health" title="Minha Saúde">
        {/* Add content for the Health Journey card here */}
      </JourneyCard>
      <JourneyCard journey="care" title="Cuidar-me Agora">
        {/* Add content for the Care Now Journey card here */}
      </JourneyCard>
      <JourneyCard journey="plan" title="Meu Plano & Benefícios">
        {/* Add content for the My Plan & Benefits Journey card here */}
      </JourneyCard>

      {/* Render the MetricsWidget component to display summarized health metrics. */}
      <MetricsWidget metrics={metrics} />

      {/* Render the AppointmentsWidget component to display upcoming appointments. */}
      <AppointmentsWidget appointments={appointments} />

      {/* Render the ClaimsWidget component to display recent claims. */}
      <ClaimsWidget claims={claims} />

      {/* Render the RecentActivityWidget component to display recent user activity. */}
      <RecentActivityWidget />

      {/* Render the AchievementsWidget component to display recent achievements. */}
      <AchievementsWidget achievements={gameProfile?.achievements} />
    </MainLayout>
  );
};

export default Home;