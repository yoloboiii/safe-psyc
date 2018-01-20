// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { Kaede } from 'react-native-textinput-effects';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { LargeButton, StandardButton } from './Buttons.js';
import { StandardText } from './Texts.js';
import { VerticalSpace } from './VerticalSpace.js';
import { backendFacade } from '../services/backend.js';
import { constants } from '../styles/constants.js';
import type { Navigation } from '../navigation-actions.js';

const kaedeLabelStyle = { backgroundColor: constants.hilightColor2 };

type Props = {
    navigation: Navigation<{
        email?: string,
    }>,
};
type State = {
    email: string,
    emailSent: boolean,
};
export class ResetPasswordScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'RESET PASSWORD',
    };

    constructor(props: Props) {
        super(props);

        const email = props.navigation.state
            ? props.navigation.state.params.email || ''
            : '';
        this.state = {
            email: email,
            emailSent: false,
        };
    }

    _sendResetEmail() {
        backendFacade
            .resetPassword(this.state.email)
            .then(() => {
                this.setState({
                    emailSent: true,
                });
            })
            .catch(e => {
                Alert.alert('Unable to send reset email', e.message);
            });
    }

    render() {
        if (this.state.emailSent) {
            return (
                <View style={constants.flex1}>
                    <StandardText>Password reset email sent!</StandardText>
                    <VerticalSpace />
                    <StandardButton
                        title={'Back to login'}
                        onPress={() =>
                            this.props.navigation.dispatch(
                                NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({
                                            routeName: 'Login',
                                        }),
                                    ],
                                })
                            )
                        }
                    />
                </View>
            );
        }

        return (
            <View style={constants.flex1}>
                <Kaede
                    labelStyle={kaedeLabelStyle}
                    label={'EMAIL'}
                    value={this.state.email}
                    onChangeText={text => this.setState({ email: text })}
                />

                <VerticalSpace />
                <LargeButton
                    onPress={this._sendResetEmail.bind(this)}
                    title={'Send reset email'}
                />
            </View>
        );
    }
}
