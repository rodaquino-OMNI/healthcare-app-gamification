import React, { useState, useCallback } from 'react';
import { AccordionHeader, AccordionContent, AccordionIcon } from './Accordion.styles';
import { Box } from '../../primitives/Box/Box';
import { Text } from '../../primitives/Text/Text';
import { Touchable } from '../../primitives/Touchable/Touchable';

// Helper function to generate a unique ID if none is provided
const generateId = (): string => {
    return `accordion-${Math.random().toString(36).substring(2, 9)}`;
};

export interface AccordionProps {
    /**
     * The title content displayed in the accordion header
     */
    title: string | React.ReactNode;

    /**
     * The content to be shown/hidden when the accordion is toggled
     */
    content: React.ReactNode;

    /**
     * Controls the expanded state (for controlled components)
     */
    isExpanded?: boolean;

    /**
     * Callback function triggered when the accordion is toggled
     */
    onToggle?: (isExpanded: boolean) => void;

    /**
     * Journey context for journey-specific styling (health, care, plan)
     */
    journey?: 'health' | 'care' | 'plan';

    /**
     * Optional CSS class name for custom styling
     */
    className?: string;

    /**
     * Unique identifier for the accordion
     * If not provided, a unique ID will be generated
     */
    id?: string;
}

/**
 * Accordion component that displays collapsible content with an interactive header.
 * Supports both controlled and uncontrolled usage, journey-specific styling, and
 * full accessibility support.
 */
const Accordion: React.FC<AccordionProps> = ({
    title,
    content,
    isExpanded: isExpandedProp,
    onToggle,
    journey,
    className,
    id: providedId,
}) => {
    // Generate a unique ID if not provided
    const id = providedId || generateId();

    // Set up state for uncontrolled component
    const [isExpandedState, setIsExpandedState] = useState(false);

    // Determine if this is a controlled or uncontrolled component
    const isControlled = isExpandedProp !== undefined;
    const isExpanded = isControlled ? isExpandedProp : isExpandedState;

    // Handle toggle action
    const handleToggle = useCallback(() => {
        if (!isControlled) {
            setIsExpandedState((prevState) => !prevState);
        }

        if (onToggle) {
            onToggle(!isExpanded);
        }
    }, [isControlled, isExpanded, onToggle]);

    // Generate unique IDs for header and content
    const headerId = `${id}-header`;
    const contentId = `${id}-content`;

    return (
        <Box className={className}>
            <Touchable
                onPress={handleToggle}
                accessibilityLabel={typeof title === 'string' ? title : 'Accordion toggle'}
                accessibilityRole="button"
                accessibilityHint="Press to expand or collapse content"
            >
                <AccordionHeader
                    id={headerId}
                    isExpanded={isExpanded}
                    journey={journey}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                >
                    {typeof title === 'string' ? <Text journey={journey}>{title}</Text> : title}
                    <AccordionIcon name="chevron-down" isExpanded={isExpanded} journey={journey} aria-hidden="true" />
                </AccordionHeader>
            </Touchable>

            <AccordionContent
                id={contentId}
                role="region"
                aria-labelledby={headerId}
                isExpanded={isExpanded}
                journey={journey}
            >
                {content}
            </AccordionContent>
        </Box>
    );
};

export default Accordion;
