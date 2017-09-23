// @flow

import React from 'react';
import { Text, View, TextInput, Alert, Keyboard, ActivityIndicator, TouchableHighlight } from 'react-native';
import { Kaede } from 'react-native-textinput-effects';
import { LargeButton } from './Buttons.js';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { ImageBackground } from './ImageBackground.js';
import { constants } from '../styles/constants.js';
import { backendFacade } from '../services/backend.js';

const containerStyle = {
    flex: 1,
    padding: constants.space,
    justifyContent: 'center',
};
const kaedeLabelStyle = { backgroundColor: constants.hilightColor2 };
const buttonContainerStyle = { flexDirection: 'row', justifyContent: 'space-between' };
const loginStyle = {
    flex: 1,
    marginRight: constants.space / 2,
    borderWidth: constants.space / 2,
    borderColor: 'transparent'
};
const registerStyle = {
    flex: 1,
    marginLeft: constants.space / 2,
    borderWidth: constants.space / 2,
    borderColor: constants.primaryColor,

    backgroundColor: 'transparent',
};

type State = {
    loading: 'no' | 'login' | 'register',
    email: string,
    password: string,
};
export class LoginScreen extends React.Component<{}, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: 'no',
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

        backendFacade.login(email, password)
            .then( () => {
                Keyboard.dismiss();
                // If the login is successful a listener registered in
                // App.js is invoked and navigates to the home screen
            })
            .catch( e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Login failed', e);
            });
    }

    _register() {
        const { email, password } = this.state;
        this.setState({
            password: '',
            loading: 'register',
        });

        backendFacade.createNewUser(email, password)
            .then( () => {
                Keyboard.dismiss();
                // If the login is successful a listener registered in
                // App.js is invoked and navigates to the home screen
            })
            .catch( e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Unable to create account', e.message);
            });
    }

    render() {
        const loginButton = this.state.loading === 'login'
            ? <ActivityIndicator />
            : <LargeButton
                style={ loginStyle }
                onPress={ this._login.bind(this) }
                disabled={ this.state.loading !== 'no' }
                title={ 'Login' } />

        const registerButton = this.state.loading === 'register'
            ? <ActivityIndicator />
            : <LargeButton
                style={ registerStyle }
                onPress={ this._register.bind(this) }
                disabled={ this.state.loading !== 'no' }
                title={ 'Register' } />

        return <ImageBackground>
                <View style={ containerStyle }>
                    <Kaede
                        labelStyle={ kaedeLabelStyle }
                        label={'EMAIL'}
                        value={ this.state.email }
                        onChangeText={ (text) => this.setState({ email: text }) }/>

                    <VerticalSpace />
                    <Kaede
                        labelStyle={ kaedeLabelStyle }
                        label={'Password'}
                        secureTextEntry={ true }
                        value={ this.state.password }
                        onChangeText={ (text) => this.setState({ password: text }) }/>


                    <VerticalSpace multiplier={2} />
                    <View style={ buttonContainerStyle }>
                        { loginButton }
                        { registerButton }
                    </View>

                    <VerticalSpace />
                    <StandardText>Forgot password</StandardText>
                </View>
            </ImageBackground>
    }
}

