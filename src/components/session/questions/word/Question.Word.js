// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from '../../../lib/Texts.js';
import { VerticalSpace } from '../../../lib/VerticalSpace.js';
import { VerticalAnswerList } from '../VerticalAnswerList.js';
import { constants } from '../../../../styles/constants.js';
import { navigateToEmotionDetails } from '../../../../navigation-actions.js';

import type { WordQuestion } from '../../../../models/questions.js';
import type { Emotion } from '../../../../models/emotion.js';

type Props = {
    question: WordQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
};

export class EmotionWordQuestionComponent extends React.Component<Props, {}> {
    render(){
        const props = this.props;
    const { question } = props;

    return (
        <View style={constants.colApart}>
            <StandardText
                testID='question-text'
                style={{
                    flex: 1,
                }}
            >{question.questionText}</StandardText>

            <VerticalAnswerList
                answers={question.answers}
                correctAnswer={question.correctAnswer}
                onCorrectAnswer={props.onCorrectAnswer}
                onWrongAnswer={props.onWrongAnswer}
                onHelp={toEmotionDetails}
            />
        </View>
    );

    function toEmotionDetails(emotion) {
        navigateToEmotionDetails(emotion);
    }
}
}
