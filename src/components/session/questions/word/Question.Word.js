// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { VerticalAnswerList } from '~/src/components/session/questions/VerticalAnswerList.js';
import { constants } from '~/src/styles/constants.js';
import { navigateToEmotionDetails } from '~/src/navigation-actions.js';

import type { WordQuestion } from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';

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
