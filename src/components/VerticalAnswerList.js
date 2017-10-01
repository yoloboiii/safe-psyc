// @flow

import React from 'react';
import { View, FlatList } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';
import { StandardButton } from './Buttons.js';

import type { Emotion } from '../models/emotion.js';

type Props = {
    correctAnswer: Emotion,
    answers: Array<Emotion>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
};

export function VerticalAnswerList(props: Props) {

    return <View>
        <FlatList
        data={ answersToButtonData(props.answers) }
        renderItem={ dataForItem => AnswerButton({
            onPress: (answer) => onAnswerPress(answer, props),
            ...dataForItem.item,
        }) } />
    </View>
}

function answersToButtonData(answers) {
    return answers.map(ans => {
        return {
            emotion: ans,
            key: ans.name,
        };
    });
}

function AnswerButton(props) {
    return <View>
        <StandardButton
        title={ props.emotion.name }
        onPress={ () => props.onPress(props.emotion) }/>
        <VerticalSpace />
    </View>
}

function onAnswerPress(answer, props) {
    if (answer === props.correctAnswer) {
        props.onCorrectAnswer();
    } else {
        props.onWrongAnswer(answer);
    }
}
