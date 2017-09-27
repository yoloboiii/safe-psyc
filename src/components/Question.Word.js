// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';

import type { EmotionWordQuestion } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';

type Props = {
    question: EmotionWordQuestion,
    answers: Array<Emotion>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
};

export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;

    return <View>
        <Text>{ question.questionText }</Text>
        <VerticalSpace multiplier={2} />
        <VerticalAnswerList
            answers={ props.answers }
            correctAnswer={ question.emotion }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}

