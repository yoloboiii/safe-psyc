// @flow

import React from 'react';
import { View, FlatList, Button } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';

type Apa = {
    text: string,
};
type Props = {
    correctAnswer: string,
    answers: Array<string>,
    onCorrectAnswer: () => void,
    onWrongAnswer: () => void,
};

export function VerticalAnswerList(props: Props) {

    return <FlatList
        data={ answersToButtonData(props.answers) }
        renderItem={ dataForItem => AnswerButton({
            onPress: (answer) => onAnswerPress(answer, props),
            ...dataForItem.item,
        }) } />
}

function answersToButtonData(answers) {
    return answers.map(ans => {
        return {
            text: ans,
            key: ans,
        };
    });
}

function AnswerButton(props) {
    return <View>
        <Button
        title={ props.text }
        onPress={ () => props.onPress(props.key) }/>
        <VerticalSpace />
    </View>
}

function onAnswerPress(answer, props) {
    if (answer === props.correctAnswer) {
        props.onCorrectAnswer();
    } else {
        props.onWrongAnswer();
    }
}
