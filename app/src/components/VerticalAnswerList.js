// @flow

import React from 'react';
import { View, FlatList } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';
import { StandardButton } from './Buttons.js';

type Apa = {
    text: string,
};
type Props = {
    correctAnswer: string,
    answers: Array<string>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: string) => void,
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
            text: ans,
            key: ans + Math.random(),
        };
    });
}

function AnswerButton(props) {
    return <View>
        <StandardButton
        title={ props.text }
        onPress={ () => props.onPress(props.text) }/>
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
