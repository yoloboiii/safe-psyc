// @flow

/// This component exists solely so that we can map the props given
/// as an argument to `navigate` to the props needed by the Sessoion
/// component

import React from 'react';
import { Text } from 'react-native';
import { Session } from './Session.js';
import { onSessionFinished } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    navigation: Navigation<{
        questions: Array<*>,
        answerService: AnswerService,
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
                answerService={ navParams.answerService }
                onSessionFinished={ () => onSessionFinished(this.props.navigation) }
                navigation={ ((this.props.navigation: any): Navigation<{}>) } />

        } else {
            return <Text>No navigation state! Don't know what to do</Text>

        }
    }
}
