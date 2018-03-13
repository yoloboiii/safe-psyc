import { AppRegistry } from 'react-native';
import App from './App';

import TestFairy from 'react-native-testfairy';
TestFairy.begin('d5ba4519ae7f50059a72e0c4f11986f3a841c396');

AppRegistry.registerComponent('safepsyc', () => App);
