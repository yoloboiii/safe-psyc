// @flow

import React from 'react';
import { Text, View, Image} from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';

import type { EyeQuestion } from '../models/questions.js';

type Props = {
    question: EyeQuestion,
    answers: Array<string>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: string) => void,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    /* TODO: this height is to make sure that the elements below the
     * image doesn't jump around so it needs to be at least as high as
     * the highest image. This information is only available in the
     * session though, so I need some way to push that data down here */

    return <View>
        <Image
            style={{ height: 200 }}
            source={{ uri: question.image }} />

        <VerticalAnswerList
            answers={ props.answers }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}
