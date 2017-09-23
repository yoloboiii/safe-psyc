// @flow

import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { ImageBackground } from './ImageBackground.js';
import { HeroButton } from './HeroButton.js';
import { startRandomSession } from '../navigation-actions.js';

import { StandardButton } from './StandardButton.js';
import { VerticalSpace } from './VerticalSpace.js';
import { backendFacade } from '../services/backend.js';

import type { Navigation } from '../navigation-actions.js';

const contentStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
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

    _startRandomSession() {
        const onNavDataLoaded = () => {
            this.setState({ loading: false });
        };

        const onStateUpdated = () => {
            startRandomSession(this.props.navigation, onNavDataLoaded);
        };

        this.setState({ loading: true, }, onStateUpdated);
    }

    render() {
        const buttonContent = this.state.loading
            ? <ActivityIndicator />
            : 'Start random session';

        return <ImageBackground>
                <View style={ contentStyle }>
                <HeroButton
                    title={ 'How are you feeling right now? '}
                    onPress={ () => this.props.navigation.navigate('CurrentFeeling') } />
                <HeroButton
                    title={ buttonContent }
                    onPress={ this._startRandomSession.bind(this) }
                />

                <VerticalSpace multiplier={4} />
                <StandardButton onPress={ backendFacade.logOut } title={ 'Log out' } />
            </View>
        </ImageBackground>
    }
}
