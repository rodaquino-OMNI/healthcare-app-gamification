import React, { useState, useRef } from 'react';
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

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${spacing.xl};
`;

const AvatarCircle = styled.div<{ hasImage: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.hasImage ? 'transparent' : colors.gray[10]};
  border: 3px solid ${colors.brand.primary};
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  margin-bottom: ${spacing.md};

  &:hover {
    box-shadow: 0 0 0 4px ${colors.brand.primary}20;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing['3xs']};
`;

const PlaceholderIcon = styled.span`
  font-size: 32px;
  color: ${colors.gray[40]};
`;

const PlaceholderText = styled.span`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[40]};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ChangePhotoButton = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
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

const SkipLink = styled.button`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[40]};
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  margin: ${spacing.md} auto 0;

  &:hover {
    color: ${colors.gray[60]};
    text-decoration: underline;
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
 * Profile Photo page - allows users to upload and preview a profile photo.
 * Displays a circular avatar preview with upload functionality.
 */
export default function ProfilePhotoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(WEB_PROFILE_ROUTES.CONFIRMATION);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push(WEB_PROFILE_ROUTES.CONFIRMATION);
  };

  return (
    <AuthLayout>
      <Title>Foto de Perfil</Title>
      <Subtitle>Adicione uma foto para personalizar seu perfil.</Subtitle>

      <AvatarContainer>
        <AvatarCircle
          hasImage={!!previewUrl}
          onClick={handleAvatarClick}
          role="button"
          aria-label="Selecionar foto de perfil"
        >
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Preview da foto de perfil" />
          ) : (
            <AvatarPlaceholder>
              <PlaceholderIcon>{'\u{1F4F7}'}</PlaceholderIcon>
              <PlaceholderText>Adicionar foto</PlaceholderText>
            </AvatarPlaceholder>
          )}
        </AvatarCircle>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload de foto"
        />

        {previewUrl && (
          <ChangePhotoButton onClick={handleAvatarClick}>
            Alterar foto
          </ChangePhotoButton>
        )}
      </AvatarContainer>

      <SubmitButton
        onClick={handleSubmit}
        disabled={isSubmitting || !previewUrl}
      >
        {isSubmitting ? 'Salvando...' : 'Continuar'}
      </SubmitButton>

      <SkipLink onClick={handleSkip}>
        Pular esta etapa
      </SkipLink>

      <StepIndicator>Passo 4 de 5</StepIndicator>
    </AuthLayout>
  );
}
