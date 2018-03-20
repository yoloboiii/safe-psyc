// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText, LargeText } from './lib/Texts.js';
import { HeroButton } from './lib/Buttons.js';
import { ImageBackground } from './lib/ImageBackground.js';
import { VerticalSpace } from './lib/VerticalSpace.js';
import { log } from '../services/logger.js';
import { resetToHome } from '../navigation-actions.js';
import { constants } from '../styles/constants.js';

import type { Navigation } from '../navigation-actions.js';

const containerStyle = {
    ...constants.padflex,
    justifyContent: 'space-between',
};
type Props = {
    navigation: Navigation<{
        username: string,
    }>,
};
type State = {};
export class WelcomeScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    render() {
        const props =
            this.props.navigation.state && this.props.navigation.state.params
                ? this.props.navigation.state.params
                : undefined;

        if (props) {
            return this._render(props);
        } else {
            log.error('Invalid welcome screen props', new Error('Invalid welcome screen props'));
            return (
                <View>
                    <StandardText
                        style={{
                            color: constants.notReallyWhite,
                        }}
                    >
                        Invalid welcome screen props
                    </StandardText>
                </View>
            );
        }
    }

    _render(props) {
        const { username } = props;

        return (
            <ImageBackground>
                <View style={containerStyle}>
                    <View>
                        <LargeText
                            style={{
                                alignSelf: 'center',
                                color: constants.notReallyWhite,
                            }}
                        >
                            Welcome!
                        </LargeText>
                        <VerticalSpace />
                        <StandardText
                            style={{
                                color: constants.notReallyWhite,
                            }}
                        >Successfully registered {username}</StandardText>
                    </View>
                    <HeroButton
                        title={"Let's get started!"}
                        onPress={() => resetToHome(this.props.navigation)}
                    />
                </View>
            </ImageBackground>
        );
    }
}
