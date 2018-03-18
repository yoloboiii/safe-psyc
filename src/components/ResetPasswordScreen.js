// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { FancyInput } from './Inputs.js';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { LargeButton, StandardButton } from './Buttons.js';
import { StandardText } from './Texts.js';
import { ActivityIndicator } from './ActivityIndicator.js';
import { VerticalSpace } from './VerticalSpace.js';
import { userBackendFacade } from '../services/user-backend.js';
import { constants } from '../styles/constants.js';
import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        email?: string,
    }>,
};
type State = {
    email: string,
    status: 'not-sent' | 'sending' | 'success' | Error,
};
export class ResetPasswordScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'RESET PASSWORD',
    };

    constructor(props: Props) {
        super(props);

        const email = props.navigation.state ? props.navigation.state.params.email || '' : '';
        this.state = {
            email: email,
            status: 'not-sent',
        };
    }

    _sendResetEmail() {
        this.setState({ status: 'sending' }, () => {
            userBackendFacade
                .resetPassword(this.state.email)
                .then(() => {
                    this.setState({
                        status: 'success',
                    });
                })
                .catch(e => {
                    this.setState({
                        status: e,
                    }, () => {
                        Alert.alert('Unable to send reset email', e.message);
                    });
                });
        });
    }

    _done() {
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Login',
                    }),
                ],
            })
        );
    }

    render() {
        return <SpaceBetween>
                { this._renderTop() }
                { this._renderBottom() }
        </SpaceBetween>
    }

    _renderTop() {
        if (this.state.status === 'success'){
            return <StandardText>Password reset email sent!</StandardText>
        } else {

            return <FancyInput
                label={'EMAIL'}
                value={this.state.email}
                onChange={text => this.setState({ email: text })}
                disabled={this.state.status === 'sending'}
            />
        }
    }

    _renderBottom() {
        const { status } = this.state;

        if (status === 'not-sent') {
            return <LargeButton
                title="Send reset email"
                onPress={this._sendResetEmail.bind(this)}
            />
        } else if (status === 'sending') {
            return <ActivityIndicator color={constants.primaryColor} size="large" />
        } else if (status === 'success') {
            return <LargeButton
                title="Back to login"
                onPress={this._done.bind(this)}
            />
        } else if (status instanceof Error) {
            return <LargeButton
                title="Send reset email"
                onPress={this._sendResetEmail.bind(this)}
            />
        } else {
            return <StandardText>Unknown status {status} </StandardText>
        }
    }
}

function SpaceBetween(props) {
    return <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',

                margin: constants.space(),
    }} { ...props } />
}
