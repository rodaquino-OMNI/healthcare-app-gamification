/**
 * DEMO_MODE mock for @react-native-community/datetimepicker
 */
const React = require('react');
const { View } = require('react-native');
const DateTimePicker = (props) => React.createElement(View, props);
DateTimePicker.dismiss = () => {};
module.exports = DateTimePicker;
module.exports.default = DateTimePicker;
