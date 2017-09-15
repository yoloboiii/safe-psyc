// @flow

import React from 'react';
import { View, Image } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import type { Question, EyeQuestion } from '../models/questions.js';

type Props = {
    question: Question,
};
export function QuestionDetails(props: Props) {
    switch(props.question.type) {
        case 'eye-question':
            return <EyeQuestionDetails question={ (props.question: EyeQuestion) }/>;
        default:
            return <StandardText>naaah {props.question.type} </StandardText>
    }
}

function EyeQuestionDetails(props) {
    return <View style={{ padding: constants.space }}>
        <StandardText style={ constants.largeText }>Question Details</StandardText>
        <VerticalSpace />

        <StandardText>{ props.question.answer }</StandardText>

        <Image source={{ uri: props.question.image }}
            resizeMode='cover'
            style={{
                height: 200,
                backgroundColor: 'red',
            }}/>
        <VerticalSpace />

        <StandardText>Strength meter, 3/5</StandardText>

        <StandardText>You usually get this confused with...</StandardText>
    </View>
}
