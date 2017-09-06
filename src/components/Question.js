// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    question: Question,
    answerService: AnswerService,
    onCorrectAnswer: () => void,
    onWrongAnswer: () => void,
};
// TODO: Duolingo's discuss feature on each question is quite cool

export function QuestionComponent(props: Props) {

    const questionView = getQuestionComponent(props);
    return <View>
        { questionView }
    </View>
}

function getQuestionComponent(props) {
    const { question, answerService, onCorrectAnswer, onWrongAnswer } = props;

    switch(question.type) {
        case 'eye-question':
            return <EyeQuestionComponent
                        question={ question }
                        answerService={ answerService }
                        onCorrectAnswer={ onCorrectAnswer }
                        onWrongAnswer={ onWrongAnswer } />
        case 'word-question':
            return <EmotionWordQuestionComponent
                        question={ question }
                        answerService={ answerService }
                        onCorrectAnswer={ onCorrectAnswer }
                        onWrongAnswer={ onWrongAnswer } />
        default:
            return <UnknownQuestionComponent question={ question } />;
    }
}

function UnknownQuestionComponent(props) {
    const { question } = props;
    return <div>Unknown question type { question.type } </div>;
}
