import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'design-system/tokens/colors';
import { typography } from 'design-system/tokens/typography';
import { spacing } from 'design-system/tokens/spacing';
import { FileUpload } from 'design-system/components/FileUpload/FileUpload';
import AuthLayout from '@/layouts/AuthLayout';
import { WEB_PROFILE_ROUTES } from 'shared/constants/routes';

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

const FieldGroup = styled.div`
    margin-bottom: ${spacing.md};
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

    &:focus {
        border-color: ${colors.brand.primary};
        box-shadow: 0 0 0 3px ${colors.brand.primary}20;
    }
`;

const UploadSection = styled.div`
    margin-bottom: ${spacing.md};
`;

const UploadLabel = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.gray[60]};
    margin: 0 0 ${spacing.xs} 0;
`;

const FileInfo = styled.p`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    color: ${colors.semantic.success};
    margin: ${spacing.xs} 0 0;
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

/**
 * Profile Documents page - collects CPF/RG and allows document upload.
 */
export default function ProfileDocumentsPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [docType, setDocType] = useState('cpf');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setUploadedFile(files[0]);
        }
    };

    const formatCpf = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const isValid = cpf.replace(/\D/g, '').length === 11 && rg.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            router.push(WEB_PROFILE_ROUTES.PHOTO);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <Title>Documentos</Title>
            <Subtitle>Informe seus documentos de identificacao.</Subtitle>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Label htmlFor="cpf">CPF</Label>
                    <StyledInput
                        id="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(formatCpf(e.target.value))}
                        maxLength={14}
                        aria-label="CPF"
                    />
                </FieldGroup>

                <FieldGroup>
                    <Label htmlFor="rg">RG</Label>
                    <StyledInput
                        id="rg"
                        type="text"
                        placeholder="Numero do RG"
                        value={rg}
                        onChange={(e) => setRg(e.target.value)}
                        aria-label="RG"
                    />
                </FieldGroup>

                <FieldGroup>
                    <Label htmlFor="docType">Tipo de Documento (upload)</Label>
                    <StyledSelect
                        id="docType"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        aria-label="Tipo de documento"
                    >
                        <option value="cpf">CPF</option>
                        <option value="rg">RG</option>
                        <option value="cnh">CNH</option>
                        <option value="passport">Passaporte</option>
                    </StyledSelect>
                </FieldGroup>

                <UploadSection>
                    <UploadLabel>Upload do Documento (opcional)</UploadLabel>
                    <FileUpload
                        onFilesSelected={handleFilesSelected}
                        accept="image/*,.pdf"
                        maxSize={5 * 1024 * 1024}
                        journey="health"
                        accessibilityLabel="Upload de documento"
                    />
                    {uploadedFile && <FileInfo>{uploadedFile.name} selecionado</FileInfo>}
                </UploadSection>

                <SubmitButton type="submit" disabled={isSubmitting || !isValid}>
                    {isSubmitting ? 'Salvando...' : 'Continuar'}
                </SubmitButton>
            </form>

            <StepIndicator>Passo 3 de 5</StepIndicator>
        </AuthLayout>
    );
}
