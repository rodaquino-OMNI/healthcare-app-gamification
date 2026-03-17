import { borderRadius } from 'design-system/tokens/borderRadius';
import { colors } from 'design-system/tokens/colors';
import { spacing } from 'design-system/tokens/spacing';
import { typography } from 'design-system/tokens/typography';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSearch } from '@/hooks/useSearch';
import { MainLayout } from '@/layouts/MainLayout';

const PageContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: ${spacing.xl} ${spacing.md};
`;

const Title = styled.h1`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.neutral.gray900};
    margin: 0 0 ${spacing.lg} 0;
`;

const FilterBar = styled.div`
    display: flex;
    gap: ${spacing.sm};
    margin-bottom: ${spacing.lg};
    overflow-x: auto;
    padding-bottom: ${spacing.sm};
`;

const FilterButton = styled.button<{ active: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    padding: ${spacing.xs} ${spacing.md};
    border-radius: ${borderRadius.full};
    border: 1px solid ${(props) => (props.active ? colors.journeys.care.primary : colors.neutral.gray300)};
    background-color: ${(props) => (props.active ? colors.journeys.care.primary : colors.neutral.white)};
    color: ${(props) => (props.active ? colors.neutral.white : colors.neutral.gray600)};
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${colors.journeys.care.primary};
    }
`;

const DoctorCard = styled.div`
    background-color: ${colors.neutral.white};
    border: 1px solid ${colors.neutral.gray200};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md};
    margin-bottom: ${spacing.md};
    cursor: pointer;
    transition: box-shadow 0.15s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

const DoctorHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${spacing.sm};
`;

const DoctorName = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray900};
    margin: 0;
`;

const DoctorSpecialty = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.journeys.care.primary};
    font-weight: ${typography.fontWeight.medium};
    margin: 0 0 ${spacing.xs} 0;
`;

const RatingBadge = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.journeys.care.primary};
    background-color: rgba(99, 181, 193, 0.1);
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.sm};
`;

const DoctorInfo = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray600};
    margin: ${spacing.xs} 0;
`;

const ScheduleButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.journeys.care.primary};
    color: ${colors.neutral.white};
    border: none;
    border-radius: ${borderRadius.md};
    cursor: pointer;
    transition: opacity 0.15s ease;
    margin-top: ${spacing.sm};
    width: 100%;

    &:hover {
        opacity: 0.9;
    }
`;

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    availability: string;
}

const mockDoctors: Doctor[] = [
    {
        id: '1',
        name: 'Dr. Carlos Silva',
        specialty: 'Cardiologia',
        rating: 4.8,
        reviews: 245,
        availability: 'Disponível hoje',
    },
    {
        id: '2',
        name: 'Dra. Ana Santos',
        specialty: 'Clinico Geral',
        rating: 4.9,
        reviews: 198,
        availability: 'Disponível amanhã',
    },
    {
        id: '3',
        name: 'Dr. Roberto Oliveira',
        specialty: 'Ortopedia',
        rating: 4.7,
        reviews: 156,
        availability: 'Disponível em 2 dias',
    },
];

export const getServerSideProps = () => ({ props: {} });

export default function DoctorResultsPage(): React.ReactElement {
    const { query } = useSearch();
    const [selectedFilter, setSelectedFilter] = useState('todos');

    return (
        <MainLayout>
            <PageContainer>
                <Title>{query ? `Resultados: Médicos para "${query}"` : 'Resultados: Médicos'}</Title>

                <FilterBar>
                    <FilterButton active={selectedFilter === 'todos'} onClick={() => setSelectedFilter('todos')}>
                        Todos
                    </FilterButton>
                    <FilterButton
                        active={selectedFilter === 'disponivel'}
                        onClick={() => setSelectedFilter('disponivel')}
                    >
                        Disponível Hoje
                    </FilterButton>
                    <FilterButton active={selectedFilter === 'rating'} onClick={() => setSelectedFilter('rating')}>
                        Melhor Avaliação
                    </FilterButton>
                </FilterBar>

                {mockDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id}>
                        <DoctorHeader>
                            <div>
                                <DoctorName>{doctor.name}</DoctorName>
                                <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                            </div>
                            <RatingBadge>⭐ {doctor.rating}</RatingBadge>
                        </DoctorHeader>
                        <DoctorInfo>{doctor.reviews} avaliações</DoctorInfo>
                        <DoctorInfo>{doctor.availability}</DoctorInfo>
                        <ScheduleButton>Agendar Consulta</ScheduleButton>
                    </DoctorCard>
                ))}
            </PageContainer>
        </MainLayout>
    );
}
