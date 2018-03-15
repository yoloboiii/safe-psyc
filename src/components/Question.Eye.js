// @flow

import React from 'react';
import { View, Image } from 'react-native';

import { VerticalAnswerList } from './VerticalAnswerList.js';
import { VerticalSpace } from './VerticalSpace.js';
import { StandardText } from './Texts.js';
import { Link } from './Link.js';
import { constants } from '../styles/constants.js';
import { navigateToEmotionDetails } from '../navigation-actions.js';
import { capitalize } from '../utils/text-utils.js';

import type { EyeQuestion } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';
import type { SpecificOverlayProps } from './Question.js';

const containerStyle = {
    flex: 1,
    justifyContent: 'space-between',
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

    return (
        <View style={containerStyle}>
            <View>
                <StandardText>
                    Which of the following emotions best describe what the person in the image is
                    feeling?
                </StandardText>
                <VerticalSpace multiplier={2} />

                <Image style={imageStyle} source={{ uri: question.image }} />
                <VerticalSpace multiplier={2} />
            </View>

            <VerticalAnswerList
                answers={props.answers}
                correctAnswer={question.correctAnswer}
                onCorrectAnswer={props.onCorrectAnswer}
                onWrongAnswer={props.onWrongAnswer}
            />
        </View>
    );
}

const overlayImageStyle = { height: 100 };
export function EyeQuestionOverlay(props: SpecificOverlayProps<Emotion>) {
    const { answeredCorrectly, answer, navigation } = props;
    const answerImage = answer.image;

    const toEmotionDetails = () => navigateToEmotionDetails(navigation, answer);

    if (answeredCorrectly) {
        return <StandardText>{capitalize(answer.name) + ' is correct!'}</StandardText>;
    } else if (!answerImage) {
        return (
            <Link
                linkText={capitalize(answer.name)}
                onLinkPress={toEmotionDetails}
                postfix={' is sadly incorrect'}
            />
        );
    } else {
        return (
            <View style={constants.flex1}>
                <StandardText>That's sadly incorrect.</StandardText>
                <Link
                    linkText={capitalize(answer.name)}
                    onLinkPress={toEmotionDetails}
                    postfix={' looks like this'}
                />
                <VerticalSpace />
                <Image
                    style={overlayImageStyle}
                    resizeMode="contain"
                    source={{ uri: answerImage }}
                />
            </View>
        );
    }
}
