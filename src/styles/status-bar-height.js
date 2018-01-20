// @flow
import { /*StatusBar, */ Platform } from 'react-native';

export const statusBarHeight = Platform.OS === 'ios' ? 20 : 0; //StatusBar.currentHeight;
