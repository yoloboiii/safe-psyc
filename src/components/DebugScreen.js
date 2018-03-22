// @flow

import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { ImageBackground } from './lib/ImageBackground.js';
import { HeroButton } from './lib/Buttons.js';
import { VerticalSpace } from './lib/VerticalSpace.js';
import { ActivityIndicator } from './lib/ActivityIndicator.js';
import { startRandomSession, openSettings } from '../navigation-actions.js';
import { statusBarHeight } from '../styles/status-bar-height.js';
import { constants } from '../styles/constants.js';

import { navigateToEmotionDetails } from '../navigation-actions.js';
import { randomSessionService } from '../services/random-session-service.js';
import { log } from '../services/logger.js';

import type { Navigation } from '../navigation-actions.js';

const contentStyle = {
    paddingTop: statusBarHeight + constants.space(),
    padding: constants.space(),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
};

type Props = {
    navigation: Navigation<{}>,
};
type State = {
    loading: boolean,
};
export class DebugScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    _openSettings() {
        openSettings();
    }

    _startSession() {
        const onNavDataLoaded = () => {
            this.setState({ loading: false });
        };

        const onStateUpdated = () => {
            startRandomSession(onNavDataLoaded);
        };

        this.setState({ loading: true }, onStateUpdated);
    }

    render() {
        const buttonContent = this.state.loading ? <ActivityIndicator /> : 'Start session';

        // $FlowFixMe
        const cogwheel = require('../../images/settings.png');
        return (
            <ImageBackground>
                <View style={contentStyle}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this._openSettings.bind(this)}>
                            <Image style={{ width: 40, height: 40 }} source={cogwheel} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <HeroButton
                            title={'Emotion details'}
                            onPress={() =>
                                navigateToEmotionDetails(
                                    randomSessionService
                                        .getEmotionPool()
                                        .filter(e => e.name === 'bitter')[0]
                                )
                            }
                        />
                        <VerticalSpace />

                        <HeroButton
                            title={'How are you feeling right now?'}
                            onPress={() => this.props.navigation.navigate('CurrentFeeling', { skippable: true })}
                        />
                        <VerticalSpace />

                        <HeroButton
                            title={'Pitch'}
                            onPress={() => this.props.navigation.navigate('Pitch')}
                        />
                        <VerticalSpace />

                        <HeroButton
                            title={'Real home'}
                            onPress={() => this.props.navigation.navigate('AlwaysHome')}
                        />
                        <VerticalSpace />

                        <HeroButton
                            title={buttonContent}
                            onPress={this._startSession.bind(this)}
                            style={{ height: 90 }}
                        />
                        <VerticalSpace />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
