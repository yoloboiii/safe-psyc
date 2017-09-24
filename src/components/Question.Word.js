// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';

import type { EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: EmotionWordQuestion,
    answers: Array<string>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: string) => void,
};

export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;

    return <View>
        <Text>{ question.questionText }</Text>
        <VerticalSpace multiplier={2} />
        <VerticalAnswerList
            answers={ props.answers }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}

