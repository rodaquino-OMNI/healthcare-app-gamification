// Dynamic Expo config — wraps app.json and injects environment variables
// Run "eas init" to set EAS_PROJECT_ID, or configure in .env
const appJson = require('./app.json');

const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID || 'your-project-id';

module.exports = ({ config }) => {
  return {
    ...config,
    ...appJson.expo,
    updates: {
      ...appJson.expo.updates,
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    extra: {
      ...appJson.expo.extra,
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
  };
};
