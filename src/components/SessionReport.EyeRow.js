// @flow

import React from 'react';
import { View, Image, TouchableHighlight } from 'react-native';
import { StandardText } from './Texts.js';
import { constants } from '../styles/constants.js';
import type { EyeQuestion } from '../models/questions.js';

const eyeContainerStyle = {
    paddingBottom: 2 * constants.space,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
};
const imageContainerStyle = {
    width: '40%',
    height: 4 * constants.space,
};
const imageStyle = {
    height: '100%',
};

type Props = {
    question: EyeQuestion,
    wrongAnswers: Array<string>,
    onPress: () => void,
}
export function EyeQuestionRow(props: Props) {
    const subtext = getSubText();

    return <View style={ eyeContainerStyle }>
        <View>
            <StandardText>{ props.question.correctAnswer.name }</StandardText>
            <StandardText style={ constants.smallText }>{ subtext }</StandardText>
        </View>
        <View style={ imageContainerStyle }>
            <TouchableHighlight onPress={ props.onPress }>
                <Image
                    source={{ uri: props.question.image }}
                    resizeMode='cover'
                    style={ imageStyle } />
            </TouchableHighlight>
        </View>
    </View>

    function getSubText() {
        if (props.wrongAnswers.length === 0) {
            return '';
        }

        if (props.wrongAnswers.length === 1) {
            return 'You almost had this one!';
        }

        return 'This was a hard one';
    }
}

