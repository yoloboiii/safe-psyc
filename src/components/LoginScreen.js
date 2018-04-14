// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { SquarePrimaryButton, SquareSecondaryButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { StandardText } from '~/src/components/lib/Texts.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';

import { constants } from '~/src/styles/constants.js';
import { navigateToEmailLogIn } from '~/src/navigation-actions.js';
import { userBackendFacade } from '~/src/services/user-backend.js';

type State = {
    loggingIn: 'no' | 'yes',
};
export class LoginScreen extends React.Component<{}, State> {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {
            loggingIn: 'no',
        };
    }

    _anonymousLogin() {

        this.setState({ loggingIn: 'yes' }, () => {

            userBackendFacade.createNewAnonymousUser()
                .catch( e => {
                    this.setState({ loggingIn: 'no' });
                    Alert.alert('Something went wrong', e.message);
                });
        });
    }

    render() {
        return (
            <ImageBackground>
                <View style={styles.container}>
                    <StandardText>hihihi, press stuff...</StandardText>
                    <VerticalSpace />

                    { this._renderLoginButton() }
                    <VerticalSpace />

                    <SquareSecondaryButton
                        title={'Already a user'}
                        onPress={navigateToEmailLogIn}
                    />
                </View>
            </ImageBackground>
        )
    }

    _renderLoginButton(Component, containerStyle) {
        if (this.state.loggingIn === 'yes') {
            return <ActivityIndicator style={{ height: 69 }}/>

        } else {
            return <SquarePrimaryButton
                title={'Get started'}
                onPress={this._anonymousLogin.bind(this)}
            />
        }
    }
}

const styles = {
    container: {
        flex: 1,
        padding: constants.space(),
        justifyContent: 'center',
    },
};
