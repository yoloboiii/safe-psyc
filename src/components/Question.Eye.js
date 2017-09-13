// @flow

import React from 'react';
import { Text, View, Image} from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import type { EyeQuestion } from '../models/questions.js';

const containerStyle = {
    padding: constants.space,
    height: '100%',
};
const imageStyle = { height: 200 };
const fillerStyle = {
    flex: 2,
};

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

    return <View style={ containerStyle }>
            <Text>Which of the following emotion best describes what the person in the image is feeling?</Text>
            <VerticalSpace multiplier={2} />

            <Image
                style={ imageStyle }
                source={{ uri: question.image }} />

        <View style={ fillerStyle }/>

        <VerticalAnswerList
            answers={ props.answers }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}
