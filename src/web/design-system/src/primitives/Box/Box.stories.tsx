import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    journey: {
      control: 'select',
      options: ['health', 'care', 'plan'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    display: { control: 'text' },
    padding: { control: 'text' },
    margin: { control: 'text' },
    borderRadius: { control: 'text' },
    boxShadow: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    padding: 'md',
    children: 'Box content',
  },
};

export const WithJourney: Story = {
  args: {
    journey: 'health',
    padding: 'lg',
    borderRadius: 'md',
    children: 'Journey-themed Box',
  },
};

export const WithSize: Story = {
  args: {
    size: 'md',
    backgroundColor: '#e0e0e0',
    children: null,
  },
};

export const WithShadow: Story = {
  args: {
    padding: 'lg',
    boxShadow: 'md',
    borderRadius: 'lg',
    children: 'Box with shadow',
  },
};

export const FlexLayout: Story = {
  args: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    padding: 'md',
    children: (
      <>
        <Box padding="sm" backgroundColor="#f0f0f0">Item 1</Box>
        <Box padding="sm" backgroundColor="#f0f0f0">Item 2</Box>
        <Box padding="sm" backgroundColor="#f0f0f0">Item 3</Box>
      </>
    ),
  },
};
