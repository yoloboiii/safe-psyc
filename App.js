import React from 'react';
import { StackNavigator } from 'react-navigation';

import { LoadingScreen } from './src/components/LoadingScreen.js';
import { PitchScreen } from './src/components/PitchScreen.js';
import { HomeScreen } from './src/components/HomeScreen.js';
import { SettingsScreen } from './src/components/SettingsScreen.js';
import { ResetPasswordScreen } from './src/components/ResetPasswordScreen.js';
import { WelcomeScreen } from './src/components/WelcomeScreen.js';
import { SessionScreen } from './src/components/session/SessionScreen.js';
import { SessionReportScreen } from './src/components/session/report/SessionReportScreen.js';
import { EmotionDetailsScreen } from './src/components/EmotionDetailsScreen.js';
import { CurrentFeelingScreen } from './src/components/CurrentFeelingScreen.js';
import { LoginScreen } from './src/components/LoginScreen.js';
import { DebugScreen } from './src/components/DebugScreen.js';

import { constants } from './src/styles/constants.js';

const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    },
};

const App = StackNavigator({
    Loading: { screen: LoadingScreen },
    Pitch: { screen: PitchScreen },
    Login: { screen: LoginScreen },
    Home: { screen: __DEV__ ? DebugScreen : HomeScreen },

    Welcome: { screen: WelcomeScreen },
    Settings: { screen: SettingsScreen, ...defaultScreenProps },
    ResetPassword: { screen: ResetPasswordScreen, ...defaultScreenProps },

    Session: { screen: SessionScreen, ...defaultScreenProps },
    SessionReport: { screen: SessionReportScreen, ...defaultScreenProps },
    EmotionDetails: { screen: EmotionDetailsScreen, ...defaultScreenProps },
    CurrentFeeling: { screen: CurrentFeelingScreen, ...defaultScreenProps },

    // Since the "Home" screen gives the debug screen in dev mode but I want to be able to see the
    // real home screen in dev too I need a second screen for this :)
    AlwaysHome: { screen: HomeScreen },
});

// The props available in navigationOptions is a little hard to find, so
// the link is here https://reactnavigation.org/docs/navigators/stack#StackNavigatorConfig

export default App;
