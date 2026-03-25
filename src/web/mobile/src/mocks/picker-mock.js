/**
 * DEMO_MODE mock for @react-native-picker/picker
 */
const React = require('react');
const { View } = require('react-native');
const Picker = (props) => React.createElement(View, props);
Picker.Item = (props) => React.createElement(View, props);
module.exports = { Picker };
module.exports.default = Picker;
