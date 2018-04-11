// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { EmotionDetails } from '~/src/components/EmotionDetails.js';
import { StandardText } from '~/src/components/lib/Texts.js';
import { answerBackendFacade } from '~/src/services/answer-backend.js';
import { log } from '~/src/services/logger.js';
import { constants } from '~/src/styles/constants.js';

import type { Navigation } from '~/src/navigation-actions.js';
import type { Emotion } from '~/src/models/emotion.js';
import type { DataPoints } from '~/src/components/EmotionDetails.js';

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
        const { state } = this.props.navigation;
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
                        emotion.name
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
        } else {
            log.warn('Tried to mount EmotionDetailsScreen without navigation state');
        }
    }

    render() {
        const { state } = this.props.navigation;
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
                    />
                );
        }
    }
}
