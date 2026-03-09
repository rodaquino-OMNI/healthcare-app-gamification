// Shim: redirect react-native imports to react-native-web for Next.js web builds.
// This file is referenced by the webpack alias in next.config.js to ensure both
// client and server builds use react-native-web instead of the raw react-native
// package (which contains Flow syntax incompatible with Node.js).
module.exports = require('react-native-web');
