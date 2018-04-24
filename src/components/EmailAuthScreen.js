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
import { StandardText } from '~/src/components/lib/Texts.js';
import { SquarePrimaryButton, SquareSecondaryButton, SecondaryButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { FancyInput } from '~/src/components/lib/Inputs.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { constants } from '~/src/styles/constants.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { paramsOr, onUserLoggedIn, onUserRegistered, toResetPassword } from '~/src/navigation-actions.js';

import type { Navigation } from '~/src/navigation-actions.js';


type Props = {
    navigation: Navigation<{
        primaryAction: 'login' | 'register',
    }>,
};
type State = {
    loading: 'no' | 'login' | 'register',
    email: string,
    password: string,
};
export class EmailAuthScreen extends React.Component<Props, State> {
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

        const currentlyLoggedIn = userBackendFacade.getLoggedInUser() === null;
        const action = currentlyLoggedIn
            ? userBackendFacade.createNewUser
            : userBackendFacade.promoteAnonymousToNamed;

        action(email, password)
            .then(user => {
                Keyboard.dismiss();
                onUserRegistered();
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
        const params = paramsOr(this.props.navigation, { primaryAction: 'register' });
        const buttons = this._renderButtons(params);

        return (
            <ImageBackground>
                <View style={styles.container}>
                    <AnonymousLinkDescription />
                    <VerticalSpace />

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
                    <View style={styles.buttonContainer}>
                        { buttons.primary }
                        { buttons.secondary }
                    </View>

                    <VerticalSpace />
                    <SecondaryButton
                        title="forgot password"
                        onPress={this._resetPassword.bind(this)}
                        textStyle={{
                            color: constants.notReallyWhite,
                            textAlign: params.primaryAction === 'login' ? 'left' : 'right',
                        }}
                    />
                </View>
            </ImageBackground>
        );
    }

    _renderButtons(params) {
        const { primaryAction } = params;
        if (primaryAction === 'login') {
            return {
                primary: this._renderLoginButton(SquarePrimaryButton, styles.primary),
                secondary: this._renderRegisterButton(SquareSecondaryButton, styles.secondary),
            };

        } else {
            return {
                primary: this._renderRegisterButton(SquarePrimaryButton, styles.primary),
                secondary: this._renderLoginButton(SquareSecondaryButton, styles.secondary),
            };
        }
    }

    _renderLoginButton(Component, containerStyle) {
        if (this.state.loading === 'login') {
            return <ActivityIndicator style={constants.flex1} />

        } else {
            return <Component
                containerStyle={containerStyle}
                onPress={this._login.bind(this)}
                disabled={this.state.loading !== 'no'}
                title={'Login'}
            />
        }

    }

    _renderRegisterButton(Component, containerStyle) {
        if (this.state.loading === 'register') {
            return <ActivityIndicator style={constants.flex1} />

        } else {
            return <Component
                containerStyle={containerStyle}
                textStyle={constants.textShadow}
                onPress={this._register.bind(this)}
                disabled={this.state.loading !== 'no'}
                title={'Register'}
            />
        }
    }
}

function AnonymousLinkDescription() {
    const user = userBackendFacade.getLoggedInUser();
    if (user && user.isAnonymous) {
        return <StandardText>
            You can register and make sure all you data is accessible when you want.
        </StandardText>
    } else {
        return null;
    }
}

const styles = {
    container: {
        ...constants.padflex,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    primary: {
        flex: 1,
        marginRight: constants.space(0.5),
    },
    secondary: {
        flex: 1,
        marginLeft: constants.space(0.5),
    },
};

