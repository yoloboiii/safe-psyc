// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText, LargeText } from './Texts.js';
import { HeroButton } from './Buttons.js';
import { ImageBackground } from './ImageBackground.js';
import { VerticalSpace } from './VerticalSpace.js';
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
            log.error('Invalid welcome screen props', new Error());
            return (
                <View>
                    <StandardText>Invalid welcome screen props</StandardText>
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
                        <LargeText customStyle={{ alignSelf: 'center' }}>
                            Welcome!
                        </LargeText>
                        <VerticalSpace />
                        <StandardText>
                            Successfully registered {username}
                        </StandardText>
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
