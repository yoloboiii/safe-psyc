// @flow

import React from 'react';
import { View, Image, Text } from 'react-native';
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
            return <Text>naaah {props.question.type} </Text>
    }
}

function EyeQuestionDetails(props) {
    return <View style={{ padding: constants.space }}>
        <Text style={ constants.largeText }>Question Details</Text>
        <VerticalSpace />

        <Text>{ props.question.answer }</Text>

        <Image source={{ uri: props.question.image }}
            resizeMode='cover'
            style={{
                height: 200,
                backgroundColor: 'red',
            }}/>
        <VerticalSpace />

        <Text>Strength meter, 3/5</Text>

        <Text>You usually get this confused with...</Text>
    </View>
}
