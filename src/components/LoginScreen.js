// @flow

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Alert,
    Keyboard,
    TouchableHighlight,
} from 'react-native';
import { LargeButton, SecondaryButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { FancyInput } from '~/src/components/lib/Inputs.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { constants } from '~/src/styles/constants.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { onUserLoggedIn, onUserRegistered, toResetPassword } from '~/src/navigation-actions.js';


const containerStyle = {
    flex: 1,
    padding: constants.space(),
    justifyContent: 'center',
};
const buttonContainerStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
};
const loginStyle = {
    flex: 1,
    marginRight: constants.space(0.5),
    borderWidth: constants.space(0.5),
    borderColor: 'transparent',
};
const registerStyle = {
    flex: 1,
    marginLeft: constants.space(0.5),
    borderWidth: constants.space(0.5),
    borderColor: constants.primaryColor,

    backgroundColor: 'transparent',
};

type Props = {
};
type State = {
    loading: 'no' | 'login' | 'register',
    email: string,
    password: string,
};
export class LoginScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: 'no',
            email:    __DEV__ ? 'lol@lol.lol' : '',
            password: __DEV__ ? 'lollol'      : '',
        };
    }

    _login() {
        const { email, password } = this.state;
        this.setState({
            password: '',
            loading: 'login',
        });

        userBackendFacade
            .login(email, password)
            .then(() => {
                Keyboard.dismiss();
                onUserLoggedIn();
            })
            .catch(e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Login failed', e.message);
            });
    }

    _register() {
        const { email, password } = this.state;
        this.setState({
            password: '',
            loading: 'register',
        });

        userBackendFacade
            .createNewUser(email, password)
            .then(user => {
                Keyboard.dismiss();
                onUserRegistered(user.email);
            })
            .catch(e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Unable to create account', e.message);
            });
    }

    _resetPassword() {
        toResetPassword(this.state.email);
    }

    render() {
        const loginButton =
            this.state.loading === 'login' ? (
                <ActivityIndicator style={constants.flex1} />
            ) : (
                <LargeButton
                    containerStyle={loginStyle}
                    onPress={this._login.bind(this)}
                    disabled={this.state.loading !== 'no'}
                    title={'Login'}
                />
            );

        const registerButton =
            this.state.loading === 'register' ? (
                <ActivityIndicator style={constants.flex1} />
            ) : (
                <LargeButton
                    containerStyle={registerStyle}
                    textStyle={{
                        textShadowColor: 'rgba(0, 0, 0, 0.2)',
                        textShadowOffset: {width: 0, height: 1},
                    }}
                    onPress={this._register.bind(this)}
                    disabled={this.state.loading !== 'no'}
                    title={'Register'}
                />
            );

        return (
            <ImageBackground>
                <View style={containerStyle}>
                    <FancyInput
                        label={'Email'}
                        value={this.state.email}
                        keyboardType={'email-address'}
                        onChange={text => this.setState({ email: text })}
                    />

                    <VerticalSpace />
                    <FancyInput
                        label={'Password'}
                        secureTextEntry={true}
                        value={this.state.password}
                        onChange={text => this.setState({ password: text })}
                    />

                    <VerticalSpace multiplier={2} />
                    <View style={buttonContainerStyle}>
                        {loginButton}
                        {registerButton}
                    </View>

                    <VerticalSpace />
                    <SecondaryButton
                        title="forgot password"
                        onPress={this._resetPassword.bind(this)}
                        textStyle={{
                            color: constants.notReallyWhite,
                            textAlign: 'left',
                        }}
                    />
                </View>
            </ImageBackground>
        );
    }
}
