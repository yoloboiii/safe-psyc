import React from 'react';
import { StackNavigator } from 'react-navigation';

import { RedirectScreen } from './src/components/RedirectScreen.js';
import { PitchScreen } from './src/components/PitchScreen.js';
import { HomeScreen } from './src/components/HomeScreen.js';
import { SettingsScreen } from './src/components/SettingsScreen.js';
import { ResetPasswordScreen } from './src/components/ResetPasswordScreen.js';
import { WelcomeScreen } from './src/components/WelcomeScreen.js';
import { SessionScreen } from './src/components/SessionScreen.js';
import { SessionReportScreen } from './src/components/SessionReportScreen.js';
import { EmotionDetailsScreen } from './src/components/EmotionDetailsScreen.js';
import { CurrentFeelingScreen } from './src/components/CurrentFeelingScreen.js';
import { LoginScreen } from './src/components/LoginScreen.js';

import { constants } from './src/styles/constants.js';
import { backendFacade } from './src/services/backend.js';
import { onUserLoggedIn, onUserLoggedOut } from './src/navigation-actions.js';

const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    }
};

const App = StackNavigator({
    Redirect: { screen: RedirectScreen },
    Pitch: { screen: PitchScreen },
    Login: { screen: LoginScreen },
    Home: { screen: HomeScreen },
    Welcome: { screen: WelcomeScreen },
    Settings: { screen: SettingsScreen, ...defaultScreenProps },
    ResetPassword: { screen: ResetPasswordScreen, ...defaultScreenProps },

    Session: { screen: SessionScreen, ...defaultScreenProps },
    SessionReport: { screen: SessionReportScreen, ...defaultScreenProps },
    EmotionDetails: { screen: EmotionDetailsScreen, ...defaultScreenProps },
    CurrentFeeling: { screen: CurrentFeelingScreen, ...defaultScreenProps },
});


// The props available in navigationOptions is a little hard to find, so
// the link is here https://reactnavigation.org/docs/navigators/stack#StackNavigatorConfig

export default App;
