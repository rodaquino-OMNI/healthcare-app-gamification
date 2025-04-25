import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { MedicalEvent } from 'src/web/shared/types/health.types';
import { WEB_HEALTH_ROUTES } from 'src/web/shared/constants/routes';
import { formatRelativeDate } from 'src/web/shared/utils/date';
import { truncateText } from 'src/web/shared/utils/format';
import { GET_MEDICAL_HISTORY } from 'src/web/shared/graphql/queries/health.queries';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import HealthLayout from 'src/web/web/src/layouts/HealthLayout';
import styled from 'styled-components';
import { useAuth } from 'src/web/web/src/hooks/useAuth';

// Styled components for the Medical History Timeline page
const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.journeys.health.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.journeys.health.primary};
    opacity: 0.3;
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral.gray700};
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.neutral.gray300};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  color: ${({ theme }) => theme.colors.neutral.gray800};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.journeys.health.primary};
  }
`;

const EventCard = styled(Card)`
  position: relative;
  margin-left: ${({ theme }) => theme.spacing.xl};
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: -28px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.journeys.health.primary};
  }
`;

const NoEvents = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral.gray600};
  margin-left: ${({ theme }) => theme.spacing.xl};
`;

const EventDate = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.journeys.health.primary};
`;

const EventType = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral.gray700};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const EventProvider = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral.gray600};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const EventDescription = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.neutral.gray800};
`;

const DocumentList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DocumentLink = styled.a`
  color: ${({ theme }) => theme.colors.journeys.health.secondary};
  text-decoration: underline;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.journeys.health.primary};
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.neutral.gray600};
`;

const Error = styled.div`
  color: ${({ theme }) => theme.colors.semantic.error};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  margin-left: ${({ theme }) => theme.spacing.xl};
`;

// Event type options for filtering
const EVENT_TYPE_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'CONSULTATION', label: 'Consulta' },
  { value: 'EXAM', label: 'Exame' },
  { value: 'PROCEDURE', label: 'Procedimento' },
  { value: 'HOSPITALIZATION', label: 'Internação' },
  { value: 'VACCINATION', label: 'Vacinação' },
  { value: 'MEDICATION', label: 'Medicação' },
];

// Time period options for filtering
const TIME_PERIOD_OPTIONS = [
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 3 meses' },
  { value: '180', label: 'Últimos 6 meses' },
  { value: '365', label: 'Último ano' },
  { value: 'all', label: 'Todo o histórico' },
];

/**
 * Medical History Timeline page component
 * Displays the user's medical history in a chronological timeline
 */
const HistoryPage: React.FC = () => {
  // Get the authenticated user
  const { session } = useAuth();
  const userId = session?.userId || '';
  
  // State for filter options
  const [eventType, setEventType] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');

  // Calculate date range based on selected time period
  const getDateRange = () => {
    if (timePeriod === 'all') {
      return {
        startDate: undefined,
        endDate: undefined
      };
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timePeriod));
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  // Prepare query variables
  const queryVariables = {
    userId,
    types: eventType ? [eventType] : undefined,
    ...getDateRange()
  };

  // Query for medical history data
  const { loading, error, data } = useQuery(GET_MEDICAL_HISTORY, {
    variables: queryVariables,
    skip: !userId, // Skip the query if we don't have a userId
    fetchPolicy: 'cache-and-network',
  });

  // Function to handle clicking on an event card
  const handleEventClick = (event: MedicalEvent) => {
    // This could navigate to a detailed view of the event
    console.log(`Viewing details for event: ${event.id}`);
    // Navigation could be implemented here, e.g.:
    // router.push(`${WEB_HEALTH_ROUTES.HISTORY}/${event.id}`);
  };

  // Function to handle clicking on a document
  const handleDocumentClick = (documentId: string, eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    console.log(`Opening document ${documentId} from event ${eventId}`);
    // Implement document viewing logic here
    // For example, open a modal with the document preview
  };

  return (
    <HealthLayout>
      <TimelineHeader>
        <PageTitle>Histórico Médico</PageTitle>
        <FilterContainer>
          <FilterLabel htmlFor="event-type">Tipo:</FilterLabel>
          <FilterSelect 
            id="event-type" 
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {EVENT_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
          
          <FilterLabel htmlFor="time-period">Período:</FilterLabel>
          <FilterSelect 
            id="time-period" 
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            {TIME_PERIOD_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>
      </TimelineHeader>

      {loading && <Loading aria-live="polite">Carregando histórico médico...</Loading>}
      
      {error && (
        <Error role="alert">
          Erro ao carregar histórico médico. Por favor, tente novamente.
        </Error>
      )}
      
      {!loading && !error && data && (
        <Timeline>
          {data.getMedicalHistory.length === 0 ? (
            <NoEvents>Nenhum evento médico encontrado.</NoEvents>
          ) : (
            data.getMedicalHistory.map((event: MedicalEvent) => (
              <EventCard 
                key={event.id}
                journey="health"
                onPress={() => handleEventClick(event)}
                interactive
                elevation="sm"
                accessibilityLabel={`Evento médico: ${event.type}, ${formatRelativeDate(event.date)}`}
              >
                <EventDate>{formatRelativeDate(event.date)}</EventDate>
                <EventType>{event.type}</EventType>
                <EventProvider>{event.provider}</EventProvider>
                <EventDescription>{truncateText(event.description, 150)}</EventDescription>
                
                {event.documents && event.documents.length > 0 && (
                  <DocumentList>
                    {event.documents.map((doc, index) => (
                      <DocumentLink 
                        key={index}
                        onClick={(e) => handleDocumentClick(doc, event.id, e)}
                        aria-label={`Ver documento ${index + 1} do evento ${event.type}`}
                      >
                        Documento {index + 1}
                      </DocumentLink>
                    ))}
                  </DocumentList>
                )}
              </EventCard>
            ))
          )}
        </Timeline>
      )}
    </HealthLayout>
  );
};

export default HistoryPage;