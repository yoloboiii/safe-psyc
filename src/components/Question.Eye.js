// @flow

import React from 'react';
import { Text, View, Image} from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { sessionService } from '../services/session-service.js';

import type { EyeQuestion } from '../models/questions.js';

const containerStyle = {
    padding: constants.space,
    height: '100%',
};
const imageStyle = { height: 200 };

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

        <VerticalAnswerList
            answers={ props.answers }
            correctAnswer={ question.answer }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}

export function EyeQuestionOverlay(props: OverlayProps) {
    console.log('APPPA');
    const { text, answeredCorrectly, answer } = props;

    const answerImage = sessionService.getQuestionPool()
        .filter(q => q.answer === answer)
        .map(q => q.image)[0];
    // TODO: what if there is no image?

    const otherEmotion = answeredCorrectly
        ? null
        : <View>
            <Text>{answer} looks like</Text>
            <Image
                style={{ height: 100, }}
                resizeMode='contain'
                source={{ uri: answerImage }} />
        </View>
    return <View>
        <Text>{ text }</Text>
        <VerticalSpace />
        { otherEmotion }
    </View>
}
