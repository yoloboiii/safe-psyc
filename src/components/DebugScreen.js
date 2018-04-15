// @flow

import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { StandardButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { startRandomSession, openSettings } from '~/src/navigation-actions.js';
import { statusBarHeight } from '~/src/styles/status-bar-height.js';
import { constants } from '~/src/styles/constants.js';

import { navigateToEmotionDetails, UNSAFE_navigateTo } from '~/src/navigation-actions.js';
import { randomSessionService } from '~/src/services/random-session-service.js';
import { log } from '~/src/services/logger.js';

const contentStyle = {
    paddingTop: statusBarHeight + constants.space(),
    ...constants.padflex,
    flexDirection: 'column',
    justifyContent: 'space-between',
};

type Props = {};
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
        startRandomSession();
    }

    render() {
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
                    <ScrollView>
                        <StandardButton
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

                        <StandardButton
                            title={'How are you feeling right now?'}
                            onPress={() => UNSAFE_navigateTo('CurrentFeeling', { skippable: true })}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Pitch'}
                            onPress={() => UNSAFE_navigateTo('Pitch')}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Real home'}
                            onPress={() => UNSAFE_navigateTo('AlwaysHome')}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Start session'}
                            onPress={this._startSession.bind(this)}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Welcome'}
                            onPress={() => UNSAFE_navigateTo('Welcome')}
                        />
                        <VerticalSpace />
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}
