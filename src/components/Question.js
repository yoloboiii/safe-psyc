// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: Question,
    onCorrectAnswer: () => void,
};
// TODO: Duolingo's discuss feature on each question is quite cool

export function QuestionComponent(props: Props) {

    const { question } = props;
    const DiscreteQuestionComponent = getQuestionComponent(question.type)
        || UnknownQuestionComponent;

    return <View>
        { /* $FlowFixMe */ }
        <DiscreteQuestionComponent
            question={question}
            onCorrectAnswer={ props.onCorrectAnswer } />
    </View>
}

function getQuestionComponent(questionType: string) {
    switch(questionType) {
        case 'eye-question':
            return EyeQuestionComponent;
        case 'word-question':
            return EmotionWordQuestionComponent;
        default:
            return null;
    }
}

function UnknownQuestionComponent(props) {
    const { question } = props;
    return <div>Unknown question type { question.type } </div>;
}
