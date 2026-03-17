import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import SymptomBodyMapPage from '../../../../pages/care/symptom-checker/body-map';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care/symptom-checker/body-map',
        asPath: '/care/symptom-checker/body-map',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('SymptomBodyMapPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<SymptomBodyMapPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<SymptomBodyMapPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
