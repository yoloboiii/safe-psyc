// @flow

import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { HeroButton, SecondaryButton } from '~/src/components/lib/Buttons.js';
import { Title, StandardText } from '~/src/components/lib/Texts.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { LogoBanner } from '~/src/components/lib/LogoBanner.js';

import { startRandomSession, openSettings, navigateToRegister } from '~/src/navigation-actions.js';
import { statusBarHeight } from '~/src/styles/status-bar-height.js';
import { constants } from '~/src/styles/constants.js';
import { log } from '~/src/services/logger.js';
import { userBackendFacade } from '~/src/services/user-backend.js';

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

        return (
            <ImageBackground>
                <View style={constants.colApart}>
                    <View style={{ alignItems: 'flex-end', margin: constants.space() }}>
                        <SettingsButton onPress={this._openSettings.bind(this)} />
                    </View>

                    <View style={constants.colApart}>
                        <View style={{ marginTop: 140 }}>
                            <LogoBanner />
                        </View>
                        <View style={constants.padding}>
                            { /*<HeroButton
                                title={"View progress"}
                                disabled={true}
                                style={{ height: 90 }}
                            />
                            <VerticalSpace /> */ }

                            <RegisterLink />
                            <VerticalSpace />

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

function SettingsButton(props) {
    // $FlowFixMe
    const cogwheel = require('../../images/settings.png');

    return <TouchableOpacity onPress={props.onPress}>
        <Image style={{
            width: 30,
            height: 30,
            tintColor: constants.defaultTextColor,
        }} source={cogwheel} />
    </TouchableOpacity>
}

function RegisterLink() {
    const user = userBackendFacade.getLoggedInUser();
    if (!user || !user.isAnonymous) {
        return null;
    }

    const textStyle = {
        textAlign: 'right',
        alignSelf: 'flex-end',
        maxWidth: '70%',
    };
    return <View>
        { /* TODO: This text should not be frightening the user... */ }
        <StandardText style={textStyle}>
            You are not logged in, data will not survive app restarts
        </StandardText>
        <SecondaryButton
            title={'Register'}
            onPress={navigateToRegister}
            textStyle={textStyle}
        />
    </View>
}
