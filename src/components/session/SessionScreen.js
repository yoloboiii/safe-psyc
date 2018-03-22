// @flow

/// This component exists solely so that we can map the props given
/// as an argument to `navigate` to the props needed by the Sessoion
/// component

import React from 'react';
import { Text, StatusBar } from 'react-native';
import { Session } from './Session.js';
import { navigateToSessionReport } from '../../navigation-actions.js';
import { answerBackendFacade } from '../../services/answer-backend.js';

import type { Navigation } from '../../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        questions: Array<*>,
    }>,
};
export class SessionScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        header: null,
    };

    componentWillMount() {
        StatusBar.setHidden(true, 'slide');
    }

    componentWillUnmount() {
        StatusBar.setHidden(false, 'slide');
    }

    render() {
        const { state, navigate } = this.props.navigation;
        if (state) {
            const navParams = state.params;

            return (
                <Session
                    backendFacade={answerBackendFacade}
                    questions={navParams.questions}
                    onSessionFinished={report =>
                        navigateToSessionReport(report)
                    }
                    navigation={((this.props.navigation: any): Navigation<{}>)}
                />
            );
        } else {
            return <Text>No navigation state! Don't know what to do</Text>;
        }
    }
}
