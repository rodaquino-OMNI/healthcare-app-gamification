import React from 'react';

interface ClaimsWidgetProps {
    journey?: string;
}

/**
 * Dashboard widget for displaying claims information in the My Plan journey.
 */
export const ClaimsWidget: React.FC<ClaimsWidgetProps> = () => {
    return (
        <div data-testid="claims-widget">
            <h3>Claims</h3>
        </div>
    );
};

export default ClaimsWidget;
