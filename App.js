import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StatusBar, Platform } from 'react-native';

import { HomeScreen } from './src/components/HomeScreen.js';
import { SettingsScreen } from './src/components/SettingsScreen.js';
import { ResetPasswordScreen } from './src/components/ResetPasswordScreen.js';
import { SessionScreen } from './src/components/SessionScreen.js';
import { EmotionDetailsScreen } from './src/components/EmotionDetailsScreen.js';
import { CurrentFeelingScreen } from './src/components/CurrentFeelingScreen.js';
import { LoginScreen } from './src/components/LoginScreen.js';
import { constants } from './src/styles/constants.js';
import { backendFacade } from './src/services/backend.js';
import { onUserLoggedIn, onUserLoggedOut } from './src/navigation-actions.js';
import { log } from './src/services/logger.js';

export const statusBarHeight = Platform.OS === 'ios'
    ? 20
    : 0; //StatusBar.currentHeight;

const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            marginTop: statusBarHeight, // Fixes the header height
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    }
};

const Navigator = StackNavigator({
    Login: { screen: LoginScreen },
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen, ...defaultScreenProps },
    ResetPassword: { screen: ResetPasswordScreen, ...defaultScreenProps },

    Session: { screen: SessionScreen, ...defaultScreenProps },
    EmotionDetails: { screen: EmotionDetailsScreen, ...defaultScreenProps },
    CurrentFeeling: { screen: CurrentFeelingScreen, ...defaultScreenProps },
});

export default class App extends React.Component<{}, { loginListenersRegistered: boolean}> {

    constructor() {
        super();
        this.loginListenersRegistered = false;
    }

    _setNavigator(navigator) {
        this.navigator = navigator;
        this._registerLoginListeners();
    }

    _registerLoginListeners() {

        if (!this.loginListenersRegistered) {
            log.debug('Registering login listeners');

            backendFacade.onUserLoggedIn(() => {
                log.debug('User logged in, redirecting to home');
                onUserLoggedIn(this.navigator);
            });
            backendFacade.onUserLoggedOut(() => {
                log.debug('User logged out, redirecting to login');
                onUserLoggedOut(this.navigator);
            });

            this.loginListenersRegistered = true;
        }
    }

    render() {
        return <Navigator ref={ this._setNavigator.bind(this) } />
    }
}



// The props available in navigationOptions is a little hard to find, so
// the link is here https://reactnavigation.org/docs/navigators/stack#StackNavigatorConfig
