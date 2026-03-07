import React from 'react';

interface JourneyHeaderProps {
    title: string;
    subtitle?: string;
    journey?: string;
}

/**
 * A reusable header component that displays the title and optional subtitle
 * for the current journey page.
 */
const JourneyHeader: React.FC<JourneyHeaderProps> = ({ title, subtitle }) => {
    return (
        <div data-testid="journey-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
        </div>
    );
};

export { JourneyHeader };
export default JourneyHeader;
