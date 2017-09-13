// @flow

import React from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
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
    onPopoutQuestion: () => void,
}
export function EyeQuestionRow(props: Props) {
    const subtext = getSubText();

    return <View style={ eyeContainerStyle }>
        <View>
            <Text>{ props.question.answer }</Text>
            <Text style={ constants.smallText }>{ subtext }</Text>
        </View>
        <View style={ imageContainerStyle }>
            <TouchableHighlight onPress={ props.onPopoutQuestion }>
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

