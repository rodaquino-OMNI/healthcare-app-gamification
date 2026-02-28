import React, { useState, useEffect, useContext } from 'react'; // react latest
import { useRouter } from 'next/navigation'; // next/navigation latest

import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';
import ProfileForm from 'src/web/web/src/components/forms/ProfileForm.tsx';
import JourneyHeader from 'src/web/web/src/components/shared/JourneyHeader.tsx';
import { AuthContext } from 'src/web/web/src/context/AuthContext.tsx';
import { ConfirmationModal } from 'src/web/web/src/components/modals/ConfirmationModal.tsx';
import { ErrorState } from 'src/web/web/src/components/shared/ErrorState.tsx';
import { LoadingIndicator } from 'src/web/web/src/components/shared/LoadingIndicator.tsx';
import { EmptyState } from 'src/web/web/src/components/shared/EmptyState.tsx';
import MainLayout from 'src/web/web/src/layouts/MainLayout.tsx';
import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes.ts';
import { restClient } from 'src/web/web/src/api/client';

/**
 * A page component that displays and allows users to edit their profile information.
 * @returns The rendered profile page.
 */
const ProfilePage: React.FC = () => {
  // LD1: Uses the useAuth hook to get the authentication status and user data.
  const { isLoading, isAuthenticated, error, session } = useAuth();

  // LD1: Uses the useRouter hook to handle navigation.
  const router = useRouter();

  // LD1: Defines a state variable for managing the confirmation modal visibility.
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LD1: If the authentication status is loading, renders a loading indicator.
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingIndicator text="Carregando perfil..." />
      </MainLayout>
    );
  }

  // LD1: If there is an error fetching user data, renders an error state component.
  if (error) {
    return (
      <MainLayout>
        <ErrorState message="Falha ao carregar perfil." onRetry={() => router.refresh()} />
      </MainLayout>
    );
  }

  // LD1: If there is no user data, renders an empty state component.
  if (!isAuthenticated || !session) {
    return (
      <MainLayout>
        <EmptyState title="Nenhum perfil encontrado" description="Por favor, faça login para visualizar seu perfil." />
      </MainLayout>
    );
  }

  // LD1: If there is user data, renders the main layout with the profile form and a confirmation modal for account deletion.
  return (
    <MainLayout>
      <JourneyHeader title="Perfil" />
      <ProfileForm />

      {/* LD1: Confirmation modal for account deletion */}
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={async () => {
          setLoading(true);
          try {
            await restClient.delete('/auth/account');
            window.location.href = '/login';
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir conta');
          } finally {
            setLoading(false);
          }
          setIsModalVisible(false);
        }}
        onCancel={() => setIsModalVisible(false)}
        title="Excluir Conta"
        message="Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        journey="health"
      />
    </MainLayout>
  );
};

export default ProfilePage;