import { render } from '@testing-library/react-native';
import React from 'react';

import { IllustrationWrapper } from './IllustrationWrapper';

// Mock the image source
const mockSource = { uri: 'https://example.com/test.png' };

describe('IllustrationWrapper', () => {
    it('renders with required props', () => {
        const { getByLabelText } = render(<IllustrationWrapper source={mockSource} alt="Test illustration" />);
        expect(getByLabelText('Test illustration')).toBeTruthy();
    });

    it('renders with custom maxWidth', () => {
        const { getByTestId } = render(
            <IllustrationWrapper source={mockSource} alt="Test" maxWidth={200} testID="test-illustration" />
        );
        expect(getByTestId('test-illustration')).toBeTruthy();
    });

    it('renders with custom aspectRatio', () => {
        const { getByTestId } = render(
            <IllustrationWrapper source={mockSource} alt="Test" aspectRatio={0.56} testID="test-ratio" />
        );
        expect(getByTestId('test-ratio')).toBeTruthy();
    });
});
