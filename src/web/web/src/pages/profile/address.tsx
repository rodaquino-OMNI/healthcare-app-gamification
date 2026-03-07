import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import AuthLayout from 'src/web/web/src/layouts/AuthLayout';
import { WEB_PROFILE_ROUTES } from 'src/web/shared/constants/routes';

const Title = styled.h2`
    font-family: ${typography.fontFamily.heading};
    font-size: ${typography.fontSize['heading-lg']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[70]};
    text-align: center;
    margin: 0 0 ${spacing.xs} 0;
`;

const Subtitle = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    color: ${colors.gray[50]};
    text-align: center;
    margin: 0 0 ${spacing.xl} 0;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${spacing.md};
    margin-bottom: ${spacing.md};

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const FieldGroup = styled.div<{ fullWidth?: boolean }>`
    ${(props) => props.fullWidth && `grid-column: 1 / -1;`}
`;

const Label = styled.label`
    display: block;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[60]};
    margin-bottom: ${spacing['3xs']};
`;

const StyledInput = styled.input`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
    padding: ${spacing.sm} ${spacing.md};
    border: 1px solid ${colors.gray[20]};
    border-radius: 10px;
    outline: none;
    transition: border-color 0.15s ease;
    box-sizing: border-box;

    &:focus {
        border-color: ${colors.brand.primary};
        box-shadow: 0 0 0 3px ${colors.brand.primary}20;
    }

    &::placeholder {
        color: ${colors.gray[40]};
    }
`;

const StyledSelect = styled.select`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    color: ${colors.gray[70]};
    padding: ${spacing.sm} ${spacing.md};
    border: 1px solid ${colors.gray[20]};
    border-radius: 10px;
    outline: none;
    background-color: ${colors.neutral.white};
    transition: border-color 0.15s ease;
    box-sizing: border-box;
    appearance: auto;

    &:focus {
        border-color: ${colors.brand.primary};
        box-shadow: 0 0 0 3px ${colors.brand.primary}20;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-md']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${colors.neutral.white};
    background-color: ${colors.brand.primary};
    border: none;
    border-radius: 10px;
    padding: ${spacing.sm} ${spacing.xl};
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover:not(:disabled) {
        background-color: ${colors.brandPalette[400]};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const StepIndicator = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.gray[40]};
    text-align: center;
    margin: ${spacing.md} 0 0;
`;

const LoadingHint = styled.span`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.brand.primary};
    margin-top: ${spacing['3xs']};
    display: block;
`;

const BR_STATES = [
    'AC',
    'AL',
    'AM',
    'AP',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MG',
    'MS',
    'MT',
    'PA',
    'PB',
    'PE',
    'PI',
    'PR',
    'RJ',
    'RN',
    'RO',
    'RR',
    'RS',
    'SC',
    'SE',
    'SP',
    'TO',
];

interface AddressFormData {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
}

/**
 * Profile Address page - collects Brazilian address with CEP auto-fill.
 */
export default function ProfileAddressPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [form, setForm] = useState<AddressFormData>({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });

    const handleChange =
        (field: keyof AddressFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleCepBlur = async () => {
        const cleanCep = form.cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setIsLoadingCep(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                setForm((prev) => ({
                    ...prev,
                    street: data.logradouro || prev.street,
                    neighborhood: data.bairro || prev.neighborhood,
                    city: data.localidade || prev.city,
                    state: data.uf || prev.state,
                }));
            }
        } catch {
            // CEP lookup failed silently, user can fill manually
        } finally {
            setIsLoadingCep(false);
        }
    };

    const isValid =
        form.cep.trim() &&
        form.street.trim() &&
        form.number.trim() &&
        form.neighborhood.trim() &&
        form.city.trim() &&
        form.state.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            router.push(WEB_PROFILE_ROUTES.DOCUMENTS);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <Title>Endereco</Title>
            <Subtitle>Informe seu endereco de correspondencia.</Subtitle>

            <form onSubmit={handleSubmit}>
                <FormGrid>
                    <FieldGroup>
                        <Label htmlFor="cep">CEP</Label>
                        <StyledInput
                            id="cep"
                            type="text"
                            placeholder="00000-000"
                            value={form.cep}
                            onChange={handleChange('cep')}
                            onBlur={handleCepBlur}
                            maxLength={9}
                            aria-label="CEP"
                        />
                        {isLoadingCep && <LoadingHint>Buscando endereco...</LoadingHint>}
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="state">Estado</Label>
                        <StyledSelect
                            id="state"
                            value={form.state}
                            onChange={handleChange('state')}
                            aria-label="Estado"
                        >
                            <option value="">Selecione</option>
                            {BR_STATES.map((uf) => (
                                <option key={uf} value={uf}>
                                    {uf}
                                </option>
                            ))}
                        </StyledSelect>
                    </FieldGroup>

                    <FieldGroup fullWidth>
                        <Label htmlFor="street">Rua</Label>
                        <StyledInput
                            id="street"
                            type="text"
                            placeholder="Nome da rua"
                            value={form.street}
                            onChange={handleChange('street')}
                            aria-label="Rua"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="number">Numero</Label>
                        <StyledInput
                            id="number"
                            type="text"
                            placeholder="123"
                            value={form.number}
                            onChange={handleChange('number')}
                            aria-label="Numero"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="complement">Complemento</Label>
                        <StyledInput
                            id="complement"
                            type="text"
                            placeholder="Apto, bloco, etc."
                            value={form.complement}
                            onChange={handleChange('complement')}
                            aria-label="Complemento"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <StyledInput
                            id="neighborhood"
                            type="text"
                            placeholder="Bairro"
                            value={form.neighborhood}
                            onChange={handleChange('neighborhood')}
                            aria-label="Bairro"
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label htmlFor="city">Cidade</Label>
                        <StyledInput
                            id="city"
                            type="text"
                            placeholder="Cidade"
                            value={form.city}
                            onChange={handleChange('city')}
                            aria-label="Cidade"
                        />
                    </FieldGroup>
                </FormGrid>

                <SubmitButton type="submit" disabled={isSubmitting || !isValid}>
                    {isSubmitting ? 'Salvando...' : 'Continuar'}
                </SubmitButton>
            </form>

            <StepIndicator>Passo 2 de 5</StepIndicator>
        </AuthLayout>
    );
}
