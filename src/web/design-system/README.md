# AUSTA SuperApp Design System

## Overview

The AUSTA SuperApp Design System is a comprehensive collection of reusable components, design tokens, patterns, and guidelines that power our journey-centered healthcare application. This system ensures consistent, accessible, and engaging user experiences across all three core journeys: My Health (Minha Saúde), Care Now (Cuidar-me Agora), and My Plan & Benefits (Meu Plano & Benefícios).

## Principles

* **Journey-Centered:** Components adapt to each journey context with appropriate theming, behaviors, and patterns
* **Accessibility First:** All components meet WCAG 2.1 Level AA standards to ensure inclusive experiences
* **Gamification Ready:** Built-in support for achievement indicators, progress tracking, and rewards
* **Cross-Platform:** Consistent implementation across web and mobile platforms
* **Performance Optimized:** Lightweight, efficient components that maintain high performance
* **Consistency with Flexibility:** Unified visual language that allows for journey-specific customization

## Technologies

* **React/React Native:** Core UI framework for both web and mobile platforms
* **Styled Components (v6.0+):** CSS-in-JS styling with theming capabilities
* **TypeScript (v5.0+):** Type-safe component development and usage
* **Storybook (v7.0+):** Component documentation and visual testing
* **Jest/React Testing Library (v14.0+):** Component testing with accessibility validation
* **Reanimated (v3.0+):** Performance-optimized animations for gamification effects
* **Victory Native (v36.0+):** Cross-platform chart components for health metrics

## Getting Started

1. **Installation:**

   ```bash
   # Using yarn
   yarn add @austa/design-system

   # Using npm
   npm install @austa/design-system
   ```

2. **Setup:**

   ```jsx
   // In your app's root component
   import { ThemeProvider, defaultTheme } from '@austa/design-system';

   const App = () => {
     return (
       <ThemeProvider theme={defaultTheme}>
         {/* Your application */}
       </ThemeProvider>
     );
   };
   ```

3. **Basic Usage:**

   ```jsx
   import { Button, Card, Text, Box } from '@austa/design-system';

   const MyComponent = () => {
     return (
       <Card journey="health">
         <Box padding="md">
           <Text variant="heading">Health Metrics</Text>
           <Text variant="body">Track your important health indicators</Text>
           <Button onPress={() => console.log('Button pressed')}>
             View Details
           </Button>
         </Box>
       </Card>
     );
   };
   ```

4. **Journey-Specific Components:**

   ```jsx
   import { HealthMetricCard, ProgressIndicator } from '@austa/design-system';

   const HeartRateCard = () => {
     return (
       <HealthMetricCard
         title="Heart Rate"
         value={72}
         unit="bpm"
         trend="stable"
         achievement={{ title: "Heart Health Monitor", points: 50 }}
       />
     );
   };
   ```

## Core Concepts

### Design Tokens

Foundational values for visual attributes across the design system.

```jsx
// Accessing design tokens
import { tokens } from '@austa/design-system';

// Color usage
const primaryHealthColor = tokens.colors.journeys.health.primary; // #0ACF83
const primaryCareColor = tokens.colors.journeys.care.primary; // #FF8C42
const primaryPlanColor = tokens.colors.journeys.plan.primary; // #3A86FF
```

### Journey Theming

All components support journey-specific styling via the `journey` prop.

```jsx
// Components adapt to journey context
<Button journey="health">View Health Dashboard</Button>
<Button journey="care">Book Appointment</Button>
<Button journey="plan">Submit Claim</Button>
```

### Accessibility Features

Built-in accessibility support in all components.

```jsx
// Accessibility props are supported on all components
<Button 
  accessibilityLabel="View health metrics details"
  accessibilityHint="Opens the detailed view of your health metrics"
>
  View Details
</Button>
```

### Gamification Components

Specialized components for achievements, progress tracking, and rewards.

```jsx
import { AchievementBadge, ProgressTracker, RewardCard } from '@austa/design-system';

// Achievement badge
<AchievementBadge 
  achievement={{
    id: "steps-goal",
    title: "Step Master",
    description: "Complete 10,000 steps for 7 consecutive days",
    progress: 5,
    total: 7,
    unlocked: false,
    journey: "health"
  }}
/>

// Progress tracker
<ProgressTracker 
  current={7500}
  target={10000}
  label="Daily Steps"
  journey="health"
/>
```

## Component Categories

* **Typography:** Text, Heading, Label
* **Layout:** Box, Flex, Grid, Stack
* **Inputs:** Button, TextField, Select, Checkbox, RadioButton, Toggle, DatePicker
* **Feedback:** Toast, Alert, ProgressBar, Skeleton
* **Navigation:** Tabs, BottomNavigation, Breadcrumb, Link
* **Containers:** Card, Modal, Drawer, Panel
* **Data Display:** Table, List, Tag, Badge, Avatar
* **Health Journey:** HealthMetricCard, MedicalTimeline, GoalCard, DeviceCard
* **Care Journey:** ProviderCard, AppointmentCard, TelemedicineScreen, MedicationCard
* **Plan Journey:** CoverageCard, ClaimCard, InsuranceCard, BenefitCard
* **Gamification:** AchievementBadge, ProgressTracker, RewardCard, LevelIndicator
* **Data Visualization:** BarChart, LineChart, PieChart, RadialProgress

## Documentation

For detailed documentation on each component, including APIs, examples, and accessibility guidelines, visit our Storybook:

[https://design-system.austa.com.br](https://design-system.austa.com.br)

## Contributing

We welcome contributions to the design system! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

## License

Copyright © 2023 AUSTA. All rights reserved.