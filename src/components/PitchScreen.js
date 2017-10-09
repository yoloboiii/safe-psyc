// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './Texts.js';

type Props = {
};
type State = {
}
export class PitchScreen extends React.Component<Props, State> {

    static navigationOptions = {
        header: null,
    };

    render() {
        return <View>
            <StandardText>hellu</StandardText>
        </View>
    }
}
