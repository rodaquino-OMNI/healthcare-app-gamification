import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { IllustrationWrapper } from './IllustrationWrapper';

const mockSource = { uri: 'https://example.com/test.png' };

describe('IllustrationWrapper', () => {
    it('renders with required props', () => {
        render(<IllustrationWrapper source={mockSource} alt="Test illustration" />);
        expect(screen.getByLabelText('Test illustration')).toBeInTheDocument();
    });

    it('renders with custom maxWidth', () => {
        render(<IllustrationWrapper source={mockSource} alt="Test" maxWidth={200} testID="test-illustration" />);
        expect(screen.getByTestId('test-illustration')).toBeInTheDocument();
    });

    it('renders with custom aspectRatio', () => {
        render(<IllustrationWrapper source={mockSource} alt="Test" aspectRatio={0.56} testID="test-ratio" />);
        expect(screen.getByTestId('test-ratio')).toBeInTheDocument();
    });
});
