// @flow

import React from 'react';
import { Text, View, Image} from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';

import type { EyeQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    question: EyeQuestion,
    answerService: AnswerService,
    onCorrectAnswer: () => void,
    onWrongAnswer: () => void,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    // $FlowFixMe
    const imageSource = require(question.image);

    const answers = props.answerService.getAnswersTo(question, 3);
    const answerButtons = answers.map(answer => {
        return { text: answer };
    });
    return <View>
        <Image source={ imageSource } />
        <VerticalAnswerList
            answers={ props.answerService.getAnswersTo(question, 3) }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}
