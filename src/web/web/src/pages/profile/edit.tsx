import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { MainLayout } from 'src/web/web/src/layouts/MainLayout';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.md};
`;

const Title = styled.h1`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[70]};
  margin: 0 0 ${spacing.xs} 0;
`;

const Subtitle = styled.p`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.gray[50]};
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

  &:disabled {
    background-color: ${colors.gray[10]};
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-top: ${spacing.xl};
`;

const PrimaryButton = styled.button`
  flex: 1;
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

const SecondaryButton = styled.button`
  flex: 1;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[60]};
  background-color: transparent;
  border: 1px solid ${colors.gray[20]};
  border-radius: 10px;
  padding: ${spacing.sm} ${spacing.xl};
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${colors.gray[40]};
  }
`;

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  dob: string;
}

/**
 * Profile edit page - allows users to update their personal information.
 * Mirrors the mobile SettingsEdit screen.
 */
export default function ProfileEditPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    dob: '',
  });

  useEffect(() => {
    // TODO: Fetch actual profile data from API
    setForm({
      name: 'Maria Silva',
      email: 'maria@example.com',
      phone: '(11) 99999-9999',
      cpf: '***.***.***-00',
      dob: '1990-01-15',
    });
  }, []);

  const handleChange = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Call API to save profile changes
      await new Promise(resolve => setTimeout(resolve, 500));
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <PageContainer>
        <Title>Editar Perfil</Title>
        <Subtitle>Atualize suas informacoes pessoais.</Subtitle>

        <form onSubmit={handleSave}>
          <FieldGroup>
            <Label htmlFor="name">Nome Completo</Label>
            <StyledInput
              id="name"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={handleChange('name')}
              aria-label="Nome completo"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="email">E-mail</Label>
            <StyledInput
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange('email')}
              aria-label="E-mail"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="phone">Telefone</Label>
            <StyledInput
              id="phone"
              type="tel"
              placeholder="(11) 99999-0000"
              value={form.phone}
              onChange={handleChange('phone')}
              aria-label="Telefone"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="cpf">CPF</Label>
            <StyledInput
              id="cpf"
              type="text"
              value={form.cpf}
              disabled
              aria-label="CPF"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="dob">Data de Nascimento</Label>
            <StyledInput
              id="dob"
              type="date"
              value={form.dob}
              onChange={handleChange('dob')}
              aria-label="Data de nascimento"
            />
          </FieldGroup>

          <ButtonRow>
            <SecondaryButton type="button" onClick={() => router.back()}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </PrimaryButton>
          </ButtonRow>
        </form>
      </PageContainer>
    </MainLayout>
  );
}
