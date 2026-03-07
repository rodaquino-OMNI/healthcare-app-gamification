import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/hooks/useClaims', () => ({
    useClaims: () => ({
        submitClaim: jest.fn().mockResolvedValue({}),
        submitting: false,
        submitError: null,
    }),
}));

jest.mock('@/context/JourneyContext', () => ({
    useJourneyContext: () => ({ currentJourney: 'plan' }),
}));

jest.mock('@/components/shared/FileUploader', () => ({
    FileUploader: ({ claimId }: any) => <div data-testid="file-uploader" data-claim-id={claimId} />,
}));

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, type, disabled }: any) => (
        <button type={type} disabled={disabled}>
            {children}
        </button>
    ),
}));

jest.mock('design-system/components/Input/Input', () => ({
    default: ({ type, id, ...rest }: any) => <input type={type} id={id} {...rest} />,
}));

jest.mock('design-system/components/Select/Select', () => ({
    Select: ({ id, options, ...rest }: any) => (
        <select id={id} {...rest}>
            {(options || []).map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    ),
}));

jest.mock('design-system/tokens', () => ({
    colors: {
        journeys: { plan: { primary: '#7c4dff', text: '#2d1b69' } },
        semantic: { error: '#ef4444' },
        gray: { 10: '#f9fafb', 20: '#e5e7eb', 30: '#d1d5db', 50: '#888', 60: '#555' },
    },
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: { 'heading-lg': '1.5rem', 'text-md': '1rem', 'text-sm': '0.875rem', 'text-xs': '0.75rem' },
        fontWeight: { semiBold: 600, medium: 500 },
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    borderRadius: { md: '8px' },
}));

jest.mock('shared/constants/routes', () => ({
    MOBILE_PLAN_ROUTES: { CLAIMS: '/plan/claims' },
}));

jest.mock('shared/utils/validation', () => ({
    claimValidationSchema: {
        shape: {},
    },
}));

jest.mock('@hookform/resolvers/yup', () => ({
    yupResolver: () => () => Promise.resolve({ values: {}, errors: {} }),
}));

import { ClaimForm } from '../../../pages/plan/claims/submit';

describe('Submit Claim Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<ClaimForm />);
        expect(container).toBeTruthy();
    });

    it('renders the step indicator', () => {
        render(<ClaimForm />);
        expect(screen.getByText('Tipo')).toBeTruthy();
        expect(screen.getByText('Detalhes')).toBeTruthy();
        expect(screen.getByText('Documentos')).toBeTruthy();
        expect(screen.getByText('Revisar')).toBeTruthy();
    });

    it('renders the procedure type step heading', () => {
        render(<ClaimForm />);
        expect(screen.getByText(/tipo de procedimento/i)).toBeTruthy();
    });

    it('renders the procedure type select', () => {
        render(<ClaimForm />);
        expect(screen.getByRole('combobox')).toBeTruthy();
    });

    it('renders next button', () => {
        render(<ClaimForm />);
        expect(screen.getByText(/proximo/i)).toBeTruthy();
    });

    it('next button is disabled when no type is selected', () => {
        render(<ClaimForm />);
        const nextButton = screen.getByText(/proximo/i).closest('button');
        expect(nextButton).toBeDisabled();
    });

    it('renders all procedure type options', () => {
        render(<ClaimForm />);
        expect(screen.getByText('Medico')).toBeTruthy();
        expect(screen.getByText('Odontologico')).toBeTruthy();
    });
});
