// @flow

import React from 'react';
import { View, Alert, Picker, ActivityIndicator } from 'react-native';
import { StandardText } from './Texts.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { log } from '../services/logger.js';

import type { CurrentEmotionBackendFacade } from '../services/current-emotion-backend.js';

const buttonRowStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
};
type Props = {
    backendFacade: CurrentEmotionBackendFacade,
    emotionWords: Array<string>,
    onAnswered: () => void,
    onSkip?: () => void,
};
type State = {
    selectedEmotion: string,
    submissionState: 'not-started' | 'submitting' | 'successful' | 'failed',
};
export class CurrentFeeling extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedEmotion: props.emotionWords[0],
            submissionState: 'not-started',
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            selectedEmotion: newProps.emotionWords[0],
            submissionState: 'not-started',
        });
    }

    render() {
        const words = this.props.emotionWords.map(word => {
            return <Picker.Item key={word} label={word} value={word} />;
        });

        const submitButton = this._createSubmitButton();
        const skipButton = this._createSkipButton();

        return (
            <View style={constants.padflex}>
                <StandardText>
                    Please choose the word that best describes how you are feeling right now
                </StandardText>
                <VerticalSpace />

                <Picker
                    selectedValue={this.state.selectedEmotion}
                    onValueChange={itemValue => this.setState({ selectedEmotion: itemValue })}
                >
                    {words}
                </Picker>

                <VerticalSpace multiplier={2} />
                <View style={buttonRowStyle}>
                    {skipButton}
                    {submitButton}
                </View>
            </View>
        );
    }

    _createSubmitButton() {
        switch (this.state.submissionState) {
            case 'successful':
                return <StandardButton title={'Success!'} onPress={this.props.onAnswered} />;
            case 'failed':
            case 'not-started':
                return (
                    <StandardButton
                        title={'Submit'}
                        onPress={() => this._chooseEmotionWord(this.state.selectedEmotion)}
                    />
                );

            case 'submitting':
                return <ActivityIndicator />;
        }
    }

    _createSkipButton() {
        if (this.props.onSkip) {
            return <StandardButton title={'Skip'} onPress={this.props.onSkip} />;
        } else {
            return <View />;
        }
    }

    _chooseEmotionWord(emotion) {
        this.setState(
            {
                submissionState: 'submitting',
            },
            () => {
                this.props.backendFacade
                    .registerCurrentEmotion(emotion)
                    .then(() => {
                        log.debug('Current emotion saved');
                        this.setState({
                            submissionState: 'successful',
                        });
                    })
                    .catch(e => {
                        log.error('Failed saving current emotion', e);
                        this.setState({
                            submissionState: 'failed',
                        });
                        Alert.alert('Save failure', e.message);
                    });
            }
        );
    }
}
