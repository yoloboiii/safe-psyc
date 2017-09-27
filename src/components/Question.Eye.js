// @flow

import React from 'react';
import { View, Image} from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';
import { StandardText } from './StandardText.js';
import { constants } from '../styles/constants.js';

import type { EyeQuestion } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';
import type { SpecificOverlayProps } from './Question.js';

const containerStyle = {
    flex: 1,
    justifyContent: 'space-between'
};
const imageStyle = { height: 200 };

type Props = {
    question: EyeQuestion,
    answers: Array<Emotion>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    /* TODO: this height is to make sure that the elements below the
     * image doesn't jump around so it needs to be at least as high as
     * the highest image. This information is only available in the
     * session though, so I need some way to push that data down here */

    return <View style={ containerStyle }>
        <View>
            <StandardText>Which of the following emotion best describes what the person in the image is feeling?</StandardText>
            <VerticalSpace multiplier={2} />

            <Image
                style={ imageStyle }
                source={{ uri: question.image }} />
            <VerticalSpace multiplier={2} />
        </View>

        <VerticalAnswerList
            answers={ props.answers }
            correctAnswer={ question.emotion }
            onCorrectAnswer={ props.onCorrectAnswer }
            onWrongAnswer={ props.onWrongAnswer } />
    </View>
}


const overlayImageStyle = { height: 100, };
export function EyeQuestionOverlay(props: SpecificOverlayProps) {
    const { answeredCorrectly, answer } = props;

    const answerImage = props.sessionService.getQuestionPool()
        .filter(q => q.type === 'eye-question' && q.emotion === answer)
        // $FlowFixMe
        .map(q => q.image)[0];

    const shouldShowOtherEmotion = !answeredCorrectly && answerImage;
    if (answeredCorrectly) {
        return <StandardText>{answer.name} is correct!</StandardText>
    } else if (!answerImage) {

        return <StandardText>{answer.name} is sadly incorrect</StandardText>
    } else {
        return <View>
            <StandardText>That's sadly incorrect. {startOfSentence(answer.name)} looks like this</StandardText>
            <VerticalSpace />
            <Image
                style={ overlayImageStyle }
                resizeMode='contain'
                source={{ uri: answerImage }} />
        </View>
    }
}

function startOfSentence(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}
