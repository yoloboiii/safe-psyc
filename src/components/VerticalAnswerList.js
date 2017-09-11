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
    onWrongAnswer: (answer: string) => void,
};

export function VerticalAnswerList(props: Props) {

    //console.log('RENDERING ANSWER LIST', props.answers);
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
    //console.log('RENDERING ANSWER BUTTON WITH KEY', props.key);
    return <View>
        <Button
        title={ props.text }
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
