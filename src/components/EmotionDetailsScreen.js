// @flow

import React from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { EmotionDetails } from './EmotionDetails.js';
import { StandardText } from './Texts.js';
import { answerBackendFacade } from '../services/answer-backend.js';
import { log } from '../services/logger.js';
import { constants } from '../styles/constants.js';

import type { Navigation } from '../navigation-actions.js';
import type { Emotion } from '../models/emotion.js';
import type { DataPoints } from './EmotionDetails.js';

type Props = {
    navigation: Navigation<{
        emotion: Emotion,
    }>,
};
type State = {
    dataPoints: DataPoints,
    loadingState: 'not-started' | 'started' | 'failed' | 'successful',
};
export class EmotionDetailsScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'EMOTION DETAILS',
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
            const { emotion } = state.params;
            this.setState({
                loadingState: 'started',
            });

            answerBackendFacade
                .getAnswersTo(emotion)
                .then(answers => {
                    log.debug(
                        'Got %j answer(s) to emotion %j',
                        answers.correct.length + answers.incorrect.length,
                        emotion
                    );

                    this.setState({
                        loadingState: 'successful',
                        dataPoints: answers,
                    });
                })
                .catch(e => {
                    log.error('Failed getting answers to emotion %j: %s', emotion.name, e);
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
            return <View style={constants.padflex}>{this._renderEmotion(navParams.emotion)}</View>;
        } else {
            return <StandardText>No navigation state! Don't know what to do</StandardText>;
        }
    }

    _renderEmotion(emotion) {
        switch (this.state.loadingState) {
            case 'started':
                return <ActivityIndicator />;
            case 'not-started':
                return <StandardText>About to start loading data I hope</StandardText>;
            case 'failed':
                return <StandardText>Unable to load data!</StandardText>;
            case 'successful':
                return (
                    <EmotionDetails
                        emotion={emotion}
                        dataPoints={this.state.dataPoints}
                        navigation={this.props.navigation}
                    />
                );
        }
    }
}
