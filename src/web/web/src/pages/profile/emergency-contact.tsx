import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { borderRadius } from 'design-system/tokens/borderRadius';
import AuthLayout from '@/layouts/AuthLayout';

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const BackLink = styled.button`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    background: none;
    border: none;
    cursor: pointer;
    margin-bottom: ${spacing.xl};
    text-align: left;

    &:hover {
        color: ${colors.gray[60]};
    }
`;

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    margin: 0 0 ${spacing.xs} 0;
`;

const StepText = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[40]};
    margin: 0 0 ${spacing['2xl']} 0;
`;

const FormGroup = styled.div`
    margin-bottom: ${spacing.lg};
`;

const Label = styled.label`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[70]};
    margin-bottom: ${spacing.xs};
`;

const Input = styled.input`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
    background-color: ${colors.gray[5]};
    border: 1px solid ${colors.gray[20]};
    border-radius: ${borderRadius.md};
    padding: ${spacing.sm} ${spacing.md};
    box-sizing: border-box;

    &::placeholder {
        color: ${colors.gray[40]};
    }

    &:focus {
        outline: none;
        border-color: ${colors.brand.primary};
    }
`;

const ChipsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing.sm};
`;

const Chip = styled.button<{ $selected: boolean }>`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${(props) => (props.$selected ? colors.neutral.white : colors.gray[70])};
    background-color: ${(props) => (props.$selected ? colors.brand.primary : colors.neutral.white)};
    border: 1px solid ${(props) => (props.$selected ? colors.brand.primary : colors.gray[30])};
    border-radius: 100px;
    padding: ${spacing.xs} ${spacing.lg};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        border-color: ${colors.brand.primary};
    }
`;

const ToggleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing.md} 0;
    border-top: 1px solid ${colors.gray[10]};
    margin-top: ${spacing.md};
    margin-bottom: ${spacing['2xl']};
`;

const ToggleLabel = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
`;

const ToggleSwitch = styled.button<{ $active: boolean }>`
    width: 44px;
    height: 24px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    position: relative;
    background-color: ${(props) => (props.$active ? colors.brand.primary : colors.gray[30])};
    transition: background-color 0.15s ease;

    &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: ${(props) => (props.$active ? '22px' : '2px')};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${colors.neutral.white};
        transition: left 0.15s ease;
    }
`;

const SaveButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background: linear-gradient(135deg, ${colors.brand.primary}, ${colors.brand.secondary});
    border: none;
    border-radius: 10px;
    padding: ${spacing.md} ${spacing.xl};
    cursor: pointer;
    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }
`;

const RELATIONSHIPS = [
    { id: 'spouse', label: 'Conjuge' },
    { id: 'parent', label: 'Pai/Mae' },
    { id: 'sibling', label: 'Irmao(a)' },
    { id: 'child', label: 'Filho(a)' },
    { id: 'friend', label: 'Amigo(a)' },
    { id: 'other', label: 'Outro' },
];

/**
 * Emergency Contact page - form to add an emergency contact
 * during the profile onboarding flow.
 */
export default function EmergencyContactPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState<string | null>(null);
    const [isPrimary, setIsPrimary] = useState(true);

    const handleSave = () => {
        router.push('/profile/confirmation');
    };

    return (
        <AuthLayout>
            <ContentContainer>
                <BackLink onClick={() => router.back()}>{'\u2190'} Voltar</BackLink>

                <Title>Contato de Emergencia</Title>
                <StepText>Passo 4 de 7</StepText>

                <FormGroup>
                    <Label htmlFor="contact-name">Nome do Contato</Label>
                    <Input
                        id="contact-name"
                        type="text"
                        placeholder="Nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="contact-phone">Telefone</Label>
                    <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+55 (11) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Relacionamento</Label>
                    <ChipsContainer>
                        {RELATIONSHIPS.map((rel) => (
                            <Chip
                                key={rel.id}
                                $selected={relationship === rel.id}
                                onClick={() => setRelationship(rel.id)}
                            >
                                {rel.label}
                            </Chip>
                        ))}
                    </ChipsContainer>
                </FormGroup>

                <ToggleRow>
                    <ToggleLabel>Contato Principal</ToggleLabel>
                    <ToggleSwitch
                        $active={isPrimary}
                        onClick={() => setIsPrimary(!isPrimary)}
                        aria-label="Contato principal"
                        role="switch"
                        aria-checked={isPrimary}
                    />
                </ToggleRow>

                <SaveButton onClick={handleSave}>Salvar Contato</SaveButton>
            </ContentContainer>
        </AuthLayout>
    );
}
