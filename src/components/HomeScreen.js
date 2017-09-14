// @flow

import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { HeroButton } from './HeroButton.js';
import { startRandomSession } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

const bgImageStyle = {
    width: '100%',
    height: '100%',
};
const contentStyle = {
    height: '100%',
    backgroundColor: 'rgba(255, 193, 69, 0.6)',
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

    componentWillUnmount() {
        this.setState({
            loading: false,
        });
    }

    _startRandomSession() {
        this.setState({
            loading: true,
        }, () => {
            startRandomSession(this.props.navigation);
        });
    }

    render() {
        // $FlowFixMe
        const img = require('../../images/home-bg.jpg');

        const buttonContent = this.state.loading
            ? <ActivityIndicator />
            : 'Start random session';

        return <View>
            <Image source={ img }
                resizeMode='cover'
                style={ bgImageStyle }>
                <View style={ contentStyle }>
                    <HeroButton
                        title={ buttonContent }
                        onPress={ this._startRandomSession.bind(this) }
                    />
                </View>
            </Image>
        </View>
    }
}
