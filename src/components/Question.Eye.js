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
    onWrongAnswer: (answer: string) => void,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    const answers = props.answerService.getAnswersTo(question, 3);
    const answerButtons = answers.map(answer => {
        return { text: answer };
    });

    /* TODO: this height is to make sure that the elements below the
     * image doesn't jump around so it needs to be at least as high as
     * the highest image. This information is only available in the
     * session though, so I need some way to push that data down here */

    return <View>
        <Image
            style={{ height: 200 }}
            source={{ uri: question.image }} />

        <VerticalAnswerList
            answers={ props.answerService.getAnswersTo(question, 3) }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}
