import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'; // next/router v13.0+
import { format } from 'date-fns'; // date-fns v2.30+
import { ptBR } from 'date-fns/locale'; // date-fns/locale v2.30+

import { WEB_AUTH_ROUTES } from 'src/web/shared/constants/routes.ts';
import { useAuth } from 'src/web/web/src/hooks/useAuth.ts';
import { AuthContext } from 'src/web/web/src/context/AuthContext.tsx';
import { Button, ButtonProps } from 'src/web/design-system/src/components/Button/Button.tsx';
import { Input, InputProps } from 'src/web/design-system/src/components/Input/Input.tsx';
import { JourneyHeader, JourneyHeaderProps } from 'src/web/web/src/components/shared/JourneyHeader.tsx';

/**
 * Renders the user profile settings page.
 * @returns The rendered settings page.
 */
const Settings: React.FC = () => {
    // LD1: Uses the useRouter hook to get the router object.
    const router = useRouter();

    // LD1: Uses the useAuth hook to get the logout function.
    const { logout } = useAuth();

    // LD1: Uses the AuthContext to access the current user's information.
    const { session } = useContext(AuthContext);

    // LD1: Defines state variables for managing form inputs and loading states.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    // LD1: Uses useEffect to fetch the user profile data when the component mounts.
    useEffect(() => {
        // Simulate fetching user profile data
        if (session?.accessToken) {
            setLoading(true);
            // Replace this with actual API call to fetch user profile
            setTimeout(() => {
                setName('Maria Silva');
                setEmail('maria@example.com');
                setPhone('(11) 99999-9999');
                setLoading(false);
            }, 500);
        }
    }, [session]);

    // LD1: Renders a JourneyHeader with the title 'Configurações'.
    return (
        <div>
            <JourneyHeader title="Configurações" />

            {/* LD1: Renders input fields for the user's name, email, and phone number. */}
            <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                aria-label="Nome"
            />
            <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-label="Email"
            />
            <Input
                label="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            {/* LD1: Renders a button to log out the user. On click, calls the logout function and redirects to the login page. */}
            <Button
                onPress={async () => {
                    await logout();
                    router.push(WEB_AUTH_ROUTES.LOGIN);
                }}
                disabled={loading}
            >
                Sair
            </Button>
        </div>
    );
};

// LD1: Exports the Settings component for use in the application.
export default Settings;
