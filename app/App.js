import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StatusBar, Platform } from 'react-native';

import { HomeScreen } from './src/components/HomeScreen.js';
import { SessionScreen } from './src/components/SessionScreen.js';
import { QuestionDetailsScreen } from './src/components/QuestionDetailsScreen.js';
import { CurrentFeelingScreen } from './src/components/CurrentFeelingScreen.js';
import { constants } from './src/styles/constants.js';



import { Firebase } from './src/components/TEST/firebase.js';

const statusBarHeight = Platform.OS === 'ios'
    ? 20
    : StatusBar.currentHeight;

const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            marginTop: statusBarHeight, // Fixes the header height
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    }
};

export default App = StackNavigator({
    FirebaseTest: { screen: Firebase, ...defaultScreenProps },
    Home: { screen: HomeScreen, ...defaultScreenProps },
    Session: { screen: SessionScreen, ...defaultScreenProps },
    QuestionDetails: { screen: QuestionDetailsScreen, ...defaultScreenProps },
    CurrentFeeling: { screen: CurrentFeelingScreen, ...defaultScreenProps },
});



// The props available in navigationOptions is a little hard to find, so
// the link is here https://reactnavigation.org/docs/navigators/stack#StackNavigatorConfig
