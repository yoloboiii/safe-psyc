// @flow

import React from 'react';
import { View, FlatList, Button } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

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
            key: ans + Math.random(),
        };
    });
}

function AnswerButton(props) {
    return <View>
        <Button
        title={ props.text }
        color={ constants.hilightColor2 }
        onPress={ () => props.onPress(props.text) }/>
        <VerticalSpace />
    </View>
}

function onAnswerPress(answer, props) {
    //console.log('KEUKEN', answer);
    if (answer === props.correctAnswer) {
        props.onCorrectAnswer();
    } else {
        props.onWrongAnswer(answer);
    }
}
