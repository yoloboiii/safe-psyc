// @flow

import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ImageBackground } from './lib/ImageBackground.js';
import { HeroButton } from './lib/Buttons.js';
import { Title, StandardText } from './lib/Texts.js';
import { VerticalSpace } from './lib/VerticalSpace.js';
import { ActivityIndicator } from './lib/ActivityIndicator.js';
import { startRandomSession, openSettings } from '../navigation-actions.js';
import { statusBarHeight } from '../styles/status-bar-height.js';
import { constants } from '../styles/constants.js';
import { log } from '../services/logger.js';

type Props = {
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

    componentDidMount() {
        log.event('HOME_SCREEN_MOUNTED');
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
        const sessionButtonContent = this.state.loading ? <ActivityIndicator /> : 'Start session';

        // $FlowFixMe
        const cogwheel = require('../../images/settings.png');
        return (
            <ImageBackground>
                <View style={constants.colApart}>
                    <View style={{ alignItems: 'flex-end', margin: constants.space() }}>
                        <TouchableOpacity onPress={this._openSettings.bind(this)}>
                            <Image style={{
                                width: 30,
                                height: 30,
                                tintColor: constants.defaultTextColor,
                            }} source={cogwheel} />
                        </TouchableOpacity>
                    </View>

                    <View style={constants.colApart}>
                        <View>
                            <View style={{ marginTop: 100 }}>
                                <View style={{
                                    position: 'absolute',
                                    top: 14,

                                    width: 320,
                                    height: 0,
                                    borderTopWidth: 80, // the height of the thing
                                    borderTopColor: constants.primaryColor,

                                    borderRightWidth: 20,
                                    borderRightColor: 'transparent',
                                }}/>
                                <Title>
                                    safe psyc
                                </Title>
                            </View>
                        </View>
                        <View style={constants.padding}>
                            { /*<HeroButton
                                title={"View progress"}
                                disabled={true}
                                style={{ height: 90 }}
                            />
                            <VerticalSpace /> */ }
                            <HeroButton
                                title={sessionButtonContent}
                                onPress={this._startSession.bind(this)}
                                style={{ height: 90 }}
                            />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
