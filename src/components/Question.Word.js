// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { answerService } from '../services/answer-service.js';
import { ButtonList } from './ButtonList.js';

import type { EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: EmotionWordQuestion,
};

export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;
    const answers = answerService.getAnswersTo(question, 3)
        .map(ans => {
            return {
                text: ans,
                key: ans,
            };
        });

    return <View>
        <Text>{ question.questionText }</Text>
        <ButtonList buttons={ answers } />
    </View>
}

