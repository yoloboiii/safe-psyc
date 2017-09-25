// @flow

import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { QuestionDetails } from './QuestionDetails.js';
import { StandardText } from './StandardText.js';
import { backendFacade } from '../services/backend.js';
import { log } from '../services/logger.js';

import type { Navigation } from '../navigation-actions.js';
import type { Question } from '../models/questions.js';
import type { DataPoints } from './QuestionDetails.js';

type Props = {
    navigation: Navigation<{
        question: Question,
    }>,
}
type State = {
    dataPoints: DataPoints,
    loadingState: 'not-started' | 'started' | 'failed' | 'successful';
};
export class QuestionDetailsScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'QUESTION DETAILS',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            dataPoints: {
                correct: [],
                incorrect: [],
            },
            loadingState: 'not-started',
        };
    }

    componentDidMount() {
        const { state, navigate } = this.props.navigation;
        if (state) {
            const { question } = state.params;
            this.setState({
                loadingState: 'started',
            });

            backendFacade.getAnswersTo(question)
                .then( (answers) => {
                    log.debug('Got answers to question', question, answers);
                    this.setState({
                        loadingState: 'successful',
                        dataPoints: answers,
                    });
                })
                .catch( e => {
                    log.error('Failed getting answers to question', question, e);
                    this.setState({
                        loadingState: 'failed',
                    });
                    Alert.alert('Unable read data', e.message);
                });
        }
    }

    render() {
        const { state, navigate } = this.props.navigation;
        if (state) {
            const navParams = state.params;
            return this._renderQuestion(navParams.question);

        } else {
            return <StandardText>No navigation state! Don't know what to do</StandardText>

        }
    }

    _renderQuestion(question) {
        switch(this.state.loadingState) {
            case 'started':
                return <ActivityIndicator />
            case 'not-started':
                return <StandardText>About to start loading data I hope</StandardText>
            case 'failed':
                return <StandardText>Unable to load data!</StandardText>
            case 'successful':
                return <QuestionDetails
                    question={ question }
                    dataPoints={ this.state.dataPoints }
                    navigation={ this.props.navigation }
                    />
        }
    }
}
