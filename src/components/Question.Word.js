// @flow

import React from 'react';
import  { Text, View, FlatList, Button } from 'react-native';

import { answerService } from '../services/answer-service.js';

import type { EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: EmotionWordQuestion,
};

export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;
    const answers = answerService.getAnswersTo(question, 3);

    return <View>
        <Text>{ question.questionText }</Text>
        <ButtonList buttons={ answers } />
    </View>
}

function ButtonList(props) {
    return <View><FlatList
        data={props.buttons}
        renderItem={(button) => {
            return <Button
                title={button} />
        }} />
        </View>
}
