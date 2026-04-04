import { Button } from 'design-system/components/Button/Button';
import { Input } from 'design-system/components/Input/Input';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_AUTH_ROUTES } from 'shared/constants/routes';

import { JourneyHeader } from '@/components/shared/JourneyHeader';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSafeRouter as useRouter } from '@/hooks/useSafeRouter'; // next/router v13.0+

/**
 * Renders the user profile settings page.
 * @returns The rendered settings page.
 */
const Settings: React.FC = () => {
    const { t: _t } = useTranslation();
    // LD1: Uses the useRouter hook to get the router object.
    const router = useRouter();

    // LD1: Uses the useAuth hook to get the logout function.
    const { logout } = useAuth();

    // LD1: Uses the useProfile hook to load real profile data.
    const { profile, isLoading: loading } = useProfile();

    // LD1: Defines state variables for managing form inputs.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // LD1: Populates the form fields when profile data is loaded.
    useEffect(() => {
        if (profile) {
            setName((profile.name as string) || '');
            setEmail((profile.email as string) || '');
            setPhone((profile.phone as string) || '');
        }
    }, [profile]);

    // LD1: Renders a JourneyHeader with the title 'Configurações'.
    return (
        <div>
            <JourneyHeader title="Configurações" />

            {/* LD1: Renders input fields for the user's name, email, and phone number. */}
            <Input
                label="Nome"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                disabled={loading}
                aria-label="Nome"
            />
            <Input
                label="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={loading}
                aria-label="Email"
            />
            <Input
                label="Telefone"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                disabled={loading}
                aria-label="Telefone"
            />

            {/* LD1: Renders a button to save the profile changes. */}
            <Button onPress={() => {}} disabled={loading}>
                Salvar
            </Button>

            {/* LD1: Renders a button to change the password. */}
            <Button onPress={() => {}} disabled={loading}>
                Alterar Senha
            </Button>

            {/* LD1: Renders a button to manage notification preferences. */}
            <Button onPress={() => {}} disabled={loading}>
                Gerenciar Notificações
            </Button>

            {/* LD1: Renders a button to log out the user.
                On click, calls the logout function and redirects to the login page. */}
            <Button
                onPress={() => {
                    void logout().then(() => router.push(WEB_AUTH_ROUTES.LOGIN));
                }}
                disabled={loading}
            >
                Sair
            </Button>
        </div>
    );
};

// LD1: Exports the Settings component for use in the application.

export const getServerSideProps = () => ({ props: {} });

export default Settings;
