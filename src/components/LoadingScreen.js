// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { configBackendFacade } from '~/src/services/config-backend.js';
import { log } from '~/src/services/logger.js';
import { resetToHome, onUserLoggedOut } from '~/src/navigation-actions.js';

type Props = {
};
export class LoadingScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        header: null,
    };

    autologinTimeout = null;

    componentDidMount() {
        this._startLoading().catch(e => {
            log.error('Failed loading the app, %s', e);

            Alert.alert('Failed loading the app', e.message);
        });
    }

    async _startLoading() {
        const isLoggedIn = await checkIfLoggedIn(userBackendFacade, this);

        registerLoginRedirecter(userBackendFacade);

        await configBackendFacade.load();

        this._redirect(isLoggedIn);
    }

    _redirect(isLoggedIn) {
        if (isLoggedIn) {
            resetToHome();
        } else {
            onUserLoggedOut();
        }
    }

    componentWillUnmount() {
        if (this.autologinTimeout) {
            clearTimeout(this.autologinTimeout);
        }
    }

    render() {
        return (
            <ImageBackground>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            </ImageBackground>
        );
    }
}

function checkIfLoggedIn(backend, state): Promise<boolean> {
    const autologinTimeoutMs = 1000;
    return new Promise((resolve, reject) => {
        listenForLoginEvent(resolve);
        startTimeout(resolve);
    });

    function listenForLoginEvent(resolve) {
        backend.onceAuthStateChange( userLoggedIn => {
            clearTimer();
            if (userLoggedIn) {
                log.debug('Got logged in event, redirecting to home');
            } else {
                log.debug('Got logged out event, redirecting to login screen');
            }
            resolve(userLoggedIn);
        });
    }

    function startTimeout(resolve) {
        state.autologinTimeout = setTimeout(() => {
            log.debug('Timed out waiting for autologin, redirecting to login screen');
            resolve(false);
        }, autologinTimeoutMs);
    }

    function clearTimer() {
        if (state.autologinTimeout) {
            clearTimeout(state.autologinTimeout);
        }
    }
}

function registerLoginRedirecter(backend) {
    backend.onUserLoggedIn(() => {
        log.debug('User logged in - resetting to home');
        resetToHome();
    });

    backend.onUserLoggedOut(() => {
        log.debug('User logged out - redirection to login screen');
        onUserLoggedOut();
    });
}
