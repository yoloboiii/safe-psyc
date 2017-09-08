// @flow

import React from 'react';
import { View, Button } from 'react-native';
import { Session } from './Session.js';

type Props = {
    navigation: {
        navigate: (string, ?Object) => void,
        state: {
            params: {
                questions: Array<*>,
            },
        },
    },
}
export class SessionScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'SESSION',
    };

    render() {
        const { navigate } = this.props.navigation;
        const navParams = this.props.navigation.state.params;

        return <Session
            questions={ navParams.questions }
            onSessionFinished={ () => navigate('Home')}/>
    }
}
