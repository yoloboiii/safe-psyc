// @flow

import React from 'react';
import { View, Button } from 'react-native';
import { startRandomSession } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{}>,
}
export class HomeScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'A LA MAISON',
    };

    render() {
        return <View>
            <Button
                title='Start random session'
                onPress={ () => startRandomSession(this.props.navigation) }
            />
        </View>
    }
}
