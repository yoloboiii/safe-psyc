// @flow

import React from 'react';
import { View, Image } from 'react-native';
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
}
export class HomeScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        header: null,
    };

    render() {
        // $FlowFixMe
        const img = require('../../images/home-bg.jpg');
        return <View>
            <Image source={ img }
                resizeMode='cover'
                style={ bgImageStyle }>
                <View style={ contentStyle }>
                    <HeroButton
                        title='Start random session'
                        onPress={ () => startRandomSession(this.props.navigation) }
                    />
                </View>
            </Image>
        </View>
    }
}
