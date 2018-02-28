// @flow

import React from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from 'react-native';
import { ImageBackground } from './ImageBackground.js';
import { HeroButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { startRandomSession, openSettings } from '../navigation-actions.js';
import { statusBarHeight } from '../styles/status-bar-height.js';
import { constants } from '../styles/constants.js';

import { navigateToEmotionDetails } from '../navigation-actions.js';
import { randomSessionService } from '../services/random-session-service.js';

import type { Navigation } from '../navigation-actions.js';

const contentStyle = {
    paddingTop: statusBarHeight + constants.space,
    padding: constants.space,
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
export class HomeScreen extends React.Component<Props, State> {
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
        openSettings(this.props.navigation);
    }

    _startRandomSession() {
        const onNavDataLoaded = () => {
            this.setState({ loading: false });
        };

        const onStateUpdated = () => {
            startRandomSession(this.props.navigation, onNavDataLoaded);
        };

        this.setState({ loading: true }, onStateUpdated);
    }

    render() {
        const buttonContent = this.state.loading ? (
            <ActivityIndicator />
        ) : (
            'Start random session'
        );

        // $FlowFixMe
        const cogwheel = require('../../images/settings.png');
        return (
            <ImageBackground>
                <View style={contentStyle}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={this._openSettings.bind(this)}
                        >
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={cogwheel}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <HeroButton
                            title={'Emotion details'}
                            onPress={() =>
                                navigateToEmotionDetails(
                                    this.props.navigation,
                                    randomSessionService
                                        .getEmotionPool()
                                        .filter(e => e.name === 'bitter')[0]
                                )
                            }
                        />
                        <VerticalSpace />
                        <HeroButton
                            title={'How are you feeling right now? '}
                            onPress={() =>
                                this.props.navigation.navigate('CurrentFeeling')
                            }
                        />
                        <VerticalSpace />
                        <HeroButton
                            title={buttonContent}
                            onPress={this._startRandomSession.bind(this)}
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
