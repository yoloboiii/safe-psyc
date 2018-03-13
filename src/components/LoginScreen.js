// @flow

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Alert,
    Keyboard,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native';
import { Kaede } from 'react-native-textinput-effects';
import { LargeButton, SecondaryButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { ImageBackground } from './ImageBackground.js';
import { constants } from '../styles/constants.js';
import { userBackendFacade } from '../services/user-backend.js';
import { onUserLoggedIn, onUserRegistered, toResetPassword } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

const containerStyle = {
    flex: 1,
    padding: constants.space(),
    justifyContent: 'center',
};
const kaedeLabelStyle = { backgroundColor: constants.hilightColor2 };
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
    navigation: Navigation<{}>,
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
            //email: '',
            //password: '',
            email: 'lol@lol.lol',
            password: 'lollol',
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
                onUserLoggedIn(this.props.navigation);
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
                onUserRegistered(this.props.navigation, user.email);
            })
            .catch(e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Unable to create account', e.message);
            });
    }

    _resetPassword() {
        toResetPassword(this.props.navigation, this.state.email);
    }

    render() {
        const loginButton =
            this.state.loading === 'login' ? (
                <ActivityIndicator style={constants.flex1} />
            ) : (
                <LargeButton
                    style={loginStyle}
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
                    style={registerStyle}
                    onPress={this._register.bind(this)}
                    disabled={this.state.loading !== 'no'}
                    title={'Register'}
                />
            );

        return (
            <ImageBackground>
                <View style={containerStyle}>
                    <Kaede
                        labelStyle={kaedeLabelStyle}
                        label={'Email'}
                        value={this.state.email}
                        keyboardType={'email-address'}
                        onChangeText={text => this.setState({ email: text })}
                    />

                    <VerticalSpace />
                    <Kaede
                        labelStyle={kaedeLabelStyle}
                        label={'Password'}
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={text => this.setState({ password: text })}
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
