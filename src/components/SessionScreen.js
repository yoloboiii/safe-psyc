// @flow

/// This component exists solely so that we can map the props given
/// as an argument to `navigate` to the props needed by the Sessoion
/// component

import React from 'react';
import { Session } from './Session.js';
import { Text } from 'react-native';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        questions: Array<*>,
    }>,
}
export class SessionScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'SESSION',
    };

    render() {
        const { state, navigate } = this.props.navigation;
        if (state) {
            const navParams = state.params;

            return <Session
                questions={ navParams.questions }
                onSessionFinished={ () => navigate('Home')}/>

        } else {
            return <Text>No navigation state! Don't know what to do</Text>

        }

    }
}
