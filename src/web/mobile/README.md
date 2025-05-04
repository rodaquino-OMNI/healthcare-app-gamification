# AUSTA SuperApp - Mobile Application

This directory contains the source code for the AUSTA SuperApp's mobile application, built using React Native.

## Technology Stack

- React Native: Cross-platform mobile development framework

- JavaScript/TypeScript: Programming language

- Expo: Managed workflow for React Native

## Getting Started

1. Install Node.js and npm or yarn.
2. Install Expo CLI: `npm install -g expo-cli` or `yarn global add expo-cli`.
3. Clone the repository.
4. Navigate to the `src/web/mobile` directory.
5. Install dependencies: `npm install` or `yarn install`.
6. Start the Expo development server: `expo start` or `yarn start`.
7. Follow the Expo CLI instructions to run the app on a simulator or physical device.

## Directory Structure

- `src/`: Contains the application's source code.
  - `components/`: Reusable UI components.
  - `screens/`: Application screens.
  - `navigation/`: Navigation configuration.
  - `api/`: API client and service integration.
  - `utils/`: Utility functions.
  - `assets/`: Static assets (images, fonts, etc.).

## Configuration

The application's configuration is managed through environment variables. Create a `.env` file in the root directory and define the necessary variables.

## Testing

Unit tests are located alongside the components they test, using Jest and React Testing Library.

## Deployment

The mobile application can be built and deployed to the app stores using Expo's build services. Refer to the Expo documentation for detailed instructions.
