import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Settings from '../../../pages/profile/settings';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/profile/settings',
        asPath: '/profile/settings',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ logout: jest.fn().mockResolvedValue(undefined) }),
}));

jest.mock('@/context/AuthContext', () => {
    const React = require('react');
    return {
        AuthContext: React.createContext({ session: { accessToken: 'test-token' } }),
    };
});

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

describe('Settings', () => {
    it('renders without crashing', () => {
        const { container } = render(<Settings />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<Settings />);
        expect(container.firstChild).toBeTruthy();
    });
});
