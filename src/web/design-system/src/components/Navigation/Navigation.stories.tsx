import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Header, TabBar, BottomNav } from './Navigation';

const meta: Meta = {
    title: 'Components/Navigation',
    tags: ['autodocs'],
};

export default meta;

// ---- Header Stories ----
export const HeaderDefault: StoryObj<typeof Header> = {
    render: () => <Header title="Health Dashboard" journey="health" />,
};

export const HeaderWithActions: StoryObj<typeof Header> = {
    render: () => (
        <Header
            title="My Profile"
            journey="care"
            leftAction={<button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>Back</button>}
            rightAction={<button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>}
        />
    ),
};

// ---- TabBar Stories ----
export const TabBarDefault: StoryObj<typeof TabBar> = {
    render: () => {
        const [active, setActive] = useState('overview');
        return (
            <TabBar
                tabs={[
                    { label: 'Overview', value: 'overview' },
                    { label: 'Activity', value: 'activity' },
                    { label: 'Nutrition', value: 'nutrition' },
                    { label: 'Sleep', value: 'sleep', disabled: true },
                ]}
                activeTab={active}
                onTabChange={setActive}
                journey="health"
            />
        );
    },
};

export const TabBarCare: StoryObj<typeof TabBar> = {
    render: () => {
        const [active, setActive] = useState('appointments');
        return (
            <TabBar
                tabs={[
                    { label: 'Appointments', value: 'appointments' },
                    { label: 'Medications', value: 'medications' },
                    { label: 'Messages', value: 'messages' },
                ]}
                activeTab={active}
                onTabChange={setActive}
                journey="care"
            />
        );
    },
};

// ---- BottomNav Stories ----
export const BottomNavDefault: StoryObj<typeof BottomNav> = {
    render: () => {
        const [active, setActive] = useState('home');
        return (
            <BottomNav
                items={[
                    { label: 'Home', value: 'home', icon: '🏠' },
                    { label: 'Health', value: 'health', icon: '❤️' },
                    { label: 'Care', value: 'care', icon: '👨‍⚕️' },
                    { label: 'Plan', value: 'plan', icon: '📋' },
                    { label: 'Profile', value: 'profile', icon: '👤' },
                ]}
                activeItem={active}
                onItemPress={setActive}
                journey="health"
            />
        );
    },
};
