// @flow

import React from 'react';
import  { Text, View, FlatList, Button } from 'react-native';

import type { EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: EmotionWordQuestion,
};
export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;
    const answers = [question.answer];

    return <View>
        <Text>{ question.questionText }</Text>
        <ButtonList buttons={ answers } />
    </View>
}

function ButtonList(props) {
    return <FlatList
        data={props.buttons}
        renderItem={(button) => {
            return <Button
                title={button} />
        }} />
}
