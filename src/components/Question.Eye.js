// @flow

import React from 'react';
import { View, Image, Alert } from 'react-native';

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
import type { Navigation } from '../navigation-actions.js';

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
    navigation: Navigation<{}>,
};
export function EyeQuestionComponent(props: Props) {
    const { question, answers, onCorrectAnswer, onWrongAnswer } = props;

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
                answers={answers}
                correctAnswer={question.correctAnswer}
                onCorrectAnswer={onCorrectAnswer}
                onWrongAnswer={onWrongAnswer}
                onHelp={toEmotionDetails}
            />
        </View>
    );

    function toEmotionDetails(emotion) {
        navigateToEmotionDetails(props.navigation, emotion);
    }
}

const overlayImageStyle = { height: 100 };
export function EyeQuestionOverlay(props: SpecificOverlayProps<Emotion>) {
    const { answeredCorrectly, answer, navigation } = props;
    const answerImage = answer.image;

    const toEmotionDetails = () => navigateToEmotionDetails(navigation, answer);

    if (answeredCorrectly) {
        return <StandardText style={{ width: '97%' }}>
            {capitalize(answer.name) + ' is correct!'}
        </StandardText>;
    } else if (!answerImage) {
        return (
            <View style={{ flex: 1, width: '97%'}}>
                <Link
                    linkText={capitalize(answer.name)}
                    onLinkPress={toEmotionDetails}
                    postfix={' is unfortunately incorrect'}
                />
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, width: '97%'}}>
                <StandardText>That's unfortunately incorrect.</StandardText>
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
