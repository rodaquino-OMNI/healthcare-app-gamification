import { useRouter } from 'next/navigation'; // next/navigation latest
import React, { useState } from 'react'; // react latest

import { restClient } from '@/api/client';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { MainLayout } from '@/layouts/MainLayout';

/**
 * A page component that displays and allows users to edit their profile information.
 * @returns The rendered profile page.
 */
const ProfilePage: React.FC = () => {
    // LD1: Uses the useAuth hook to get the authentication status and user data.
    const { isLoading: authLoading, isAuthenticated, error: authError, session } = useAuth();
    // LD1: Uses the useProfile hook to load profile data.
    const { profile: _profile, isLoading: profileLoading } = useProfile();
    const isLoading = authLoading || profileLoading;

    // LD1: Uses the useRouter hook to handle navigation.
    const router = useRouter();

    // LD1: Defines a state variable for managing the confirmation modal visibility.
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [_loading, setLoading] = useState(false);
    const [, setDeleteError] = useState<string | null>(null);

    // LD1: If the authentication status is loading, renders a loading indicator.
    if (isLoading) {
        return (
            <MainLayout>
                <LoadingIndicator text="Carregando perfil..." />
            </MainLayout>
        );
    }

    // LD1: If there is an error fetching user data, renders an error state component.
    if (authError) {
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
                <EmptyState
                    title="Nenhum perfil encontrado"
                    description="Por favor, faça login para visualizar seu perfil."
                />
            </MainLayout>
        );
    }

    // LD1: If there is user data, renders the main layout with the profile form
    // and a confirmation modal for account deletion.
    return (
        <MainLayout>
            <JourneyHeader title="Perfil" />
            <ProfileForm />

            {/* LD1: Confirmation modal for account deletion */}
            <ConfirmationModal
                visible={isModalVisible}
                onConfirm={() => {
                    setLoading(true);
                    restClient
                        .delete('/auth/account')
                        .then(() => {
                            window.location.href = '/login';
                        })
                        .catch((err: unknown) => {
                            setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir conta');
                        })
                        .finally(() => {
                            setLoading(false);
                            setIsModalVisible(false);
                        });
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
