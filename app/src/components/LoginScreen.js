// @flow

import React from 'react';
import { View, TextInput, Alert, Keyboard, ActivityIndicator } from 'react-native';
import { Kaede } from 'react-native-textinput-effects';
import { StandardButton } from './StandardButton.js';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { ImageBackground } from './ImageBackground.js';
import { constants } from '../styles/constants.js';
import { backendFacade } from '../services/backend.js';

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
            : <StandardButton
                onPress={ this._login.bind(this) }
                disabled={ this.state.loading !== 'no' }
                title={ 'Login' } />

        const registerButton = this.state.loading === 'register'
            ? <ActivityIndicator />
            : <StandardButton
                onPress={ this._register.bind(this) }
                disabled={ this.state.loading !== 'no' }
                title={ 'Register' } />

        return <ImageBackground>
            <View style={{
                flex: 1,
                padding: constants.space,
                justifyContent: 'center',
            }}>
            <Kaede
                labelStyle={{ backgroundColor: constants.hilightColor2 }}
                label={'EMAIL'}
                value={ this.state.email }
                onChangeText={ (text) => this.setState({ email: text }) }/>

            <VerticalSpace />
            <Kaede
                labelStyle={{ backgroundColor: constants.hilightColor2 }}
                label={'Password'}
                secureTextEntry={ true }
                value={ this.state.password }
                onChangeText={ (text) => this.setState({ password: text }) }/>


            <VerticalSpace multiplier={10} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                { loginButton }
                { registerButton }
            </View>

            <VerticalSpace />
            <StandardText>Forgot password</StandardText>
        </View>
    </ImageBackground>
    }
}

