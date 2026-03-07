import React from 'react';

interface SidebarProps {
    journey?: string;
}

/**
 * Sidebar navigation component providing journey-specific navigation links.
 */
export const Sidebar: React.FC<SidebarProps> = () => {
    return (
        <nav data-testid="sidebar">
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/health">Saude</a>
                </li>
                <li>
                    <a href="/care">Cuidados</a>
                </li>
                <li>
                    <a href="/plan">Plano</a>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
