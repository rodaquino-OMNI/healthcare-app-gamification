import Link from 'next/link';
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
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/health">Saude</Link>
                </li>
                <li>
                    <Link href="/care">Cuidados</Link>
                </li>
                <li>
                    <Link href="/plan">Plano</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
