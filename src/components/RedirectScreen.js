// @flow

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ImageBackground } from './ImageBackground.js';
import { backendFacade } from '../services/backend.js';
import { log } from '../services/logger.js';
import { resetToHome, onUserLoggedOut } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{}>,
};
export class RedirectScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        header: null,
    };

    timerId = null;
    loggedIn = false;

    componentWillMount() {
        backendFacade.onUserLoggedIn(this._userLoggedIn.bind(this));
        this.timerId = setTimeout(() => {
            this._timeout();
        }, 500);
    }

    componentWillUnmount() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
    }

    _userLoggedIn() {
        this.loggedIn = true;
        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        log.debug('Got logged in event, redirecting to home');
        resetToHome(this.props.navigation);
    }

    _timeout() {
        if (!this.loggedIn) {
            log.debug(
                'Timed out waiting for autologin, redirecting to login screen'
            );
            onUserLoggedOut(this.props.navigation);
        }
    }

    render() {
        return (
            <ImageBackground>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator />
                </View>
            </ImageBackground>
        );
    }
}
