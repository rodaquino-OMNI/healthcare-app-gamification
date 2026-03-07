import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { borderRadius } from 'design-system/tokens/borderRadius';
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
    border: 1px solid ${(props) => (props.active ? colors.journeys.health.primary : colors.neutral.gray300)};
    background-color: ${(props) => (props.active ? colors.journeys.health.primary : colors.neutral.white)};
    color: ${(props) => (props.active ? colors.neutral.white : colors.neutral.gray600)};
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${colors.journeys.health.primary};
    }
`;

const MedicationCard = styled.div`
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

const MedicationHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${spacing.sm};
`;

const MedicationName = styled.h3`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.gray900};
    margin: 0;
`;

const GenericBadge = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.semiBold};
    background-color: rgba(34, 197, 94, 0.1);
    color: rgb(34, 197, 94);
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.sm};
`;

const MedicationDosage = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray600};
    margin: 0 0 ${spacing.xs} 0;
`;

const MedicationDescription = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.neutral.gray500};
    margin: 0;
    line-height: ${typography.lineHeight.base};
`;

const DetailButton = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.semiBold};
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.journeys.health.primary};
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

interface Medication {
    id: string;
    name: string;
    dosage: string;
    description: string;
    isGeneric: boolean;
}

const mockMedications: Medication[] = [
    {
        id: '1',
        name: 'Dipirona Sódica',
        dosage: '500mg',
        description: 'Analgésico e antitérmico para alívio de dor e febre',
        isGeneric: true,
    },
    {
        id: '2',
        name: 'Losartana Potássica',
        dosage: '50mg',
        description: 'Anti-hipertensivo para controle da pressão arterial',
        isGeneric: true,
    },
    {
        id: '3',
        name: 'Sinvastatina',
        dosage: '20mg',
        description: 'Hipolipemiante para redução do colesterol',
        isGeneric: true,
    },
];

export default function MedicationResultsPage() {
    const [selectedFilter, setSelectedFilter] = useState('todos');

    return (
        <MainLayout>
            <PageContainer>
                <Title>Resultados: Medicamentos</Title>

                <FilterBar>
                    <FilterButton active={selectedFilter === 'todos'} onClick={() => setSelectedFilter('todos')}>
                        Todos
                    </FilterButton>
                    <FilterButton active={selectedFilter === 'generico'} onClick={() => setSelectedFilter('generico')}>
                        Genéricos
                    </FilterButton>
                    <FilterButton active={selectedFilter === 'marca'} onClick={() => setSelectedFilter('marca')}>
                        Marca
                    </FilterButton>
                </FilterBar>

                {mockMedications.map((medication) => (
                    <MedicationCard key={medication.id}>
                        <MedicationHeader>
                            <MedicationName>{medication.name}</MedicationName>
                            {medication.isGeneric && <GenericBadge>GENÉRICO</GenericBadge>}
                        </MedicationHeader>
                        <MedicationDosage>{medication.dosage}</MedicationDosage>
                        <MedicationDescription>{medication.description}</MedicationDescription>
                        <DetailButton>Ver Detalhes</DetailButton>
                    </MedicationCard>
                ))}
            </PageContainer>
        </MainLayout>
    );
}
