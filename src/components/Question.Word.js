// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';

import type { EmotionWordQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    question: EmotionWordQuestion,
    answerService: AnswerService,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: string) => void,
};

export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;

    return <View>
        <Text>{ question.questionText }</Text>
        <VerticalSpace multiplier={2} />
        <VerticalAnswerList
            answers={ props.answerService.getAnswersTo(question, 3) }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}

