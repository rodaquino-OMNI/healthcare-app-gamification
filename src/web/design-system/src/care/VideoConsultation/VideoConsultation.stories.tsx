import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/**
 * VideoConsultation requires Agora RTC SDK and React Navigation context.
 * It cannot be rendered directly in Storybook.
 * This story serves as documentation for the component's purpose and usage.
 */

const PlaceholderComponent: React.FC = () => (
  <div
    style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#1a1a2e',
      color: 'white',
      borderRadius: '8px',
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}
  >
    <div style={{ fontSize: '3rem' }}>VIDEO</div>
    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>VideoConsultation</h2>
    <p style={{ margin: 0, maxWidth: '400px', lineHeight: '1.5', opacity: 0.8 }}>
      This component requires Agora RTC SDK and React Navigation context to render.
      It is used in the Care Now journey for telemedicine video consultations.
    </p>
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '4px',
        textAlign: 'left',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '0.9rem' }}>Usage:</p>
      <code style={{ fontSize: '0.8rem', opacity: 0.9 }}>
        {`<VideoConsultation />`}
        <br />
        {`// Reads params from navigation route:`}
        <br />
        {`// sessionId, channelName, token,`}
        <br />
        {`// providerId, providerName, providerSpecialty`}
      </code>
    </div>
  </div>
);

const meta: Meta<typeof PlaceholderComponent> = {
  title: 'Care/VideoConsultation',
  component: PlaceholderComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'VideoConsultation enables telemedicine video calls using Agora RTC. ' +
          'It requires React Navigation (for route params) and the Agora RTC SDK. ' +
          'Cannot be rendered in isolation in Storybook. See component source for full implementation details.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceholderComponent>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      VideoConsultation requires Agora RTC and navigation context. See component source for usage.
    </div>
  ),
};

export const DocumentationPlaceholder: Story = {
  render: () => <PlaceholderComponent />,
};
