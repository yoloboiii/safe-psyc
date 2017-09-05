// @flow

import React from 'react';
import  { Text, View } from 'react-native';

import { answerService } from '../services/answer-service.js';
import { ButtonList } from './ButtonList.js';
import { VerticalSpace } from './VerticalSpace.js';

import type { EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: EmotionWordQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: () => void,
};

export function EmotionWordQuestionComponent(props: Props) {
    const { question } = props;

    const answers = new Map();
    answerService.getAnswersTo(question, 3)
        .forEach(ans => {
            answers.set({
                text: ans,
                key: ans,
            }, ans);
        });

    return <View>
        <Text>{ question.questionText }</Text>
        <VerticalSpace multiplier={2} />
        <ButtonList
            buttons={ Array.from(answers.keys()) }
            onPress={ onAnswerPress } />
    </View>


    function onAnswerPress(answer) {
        //console.log('Got answer', answer, 'to question', question);
        if (!answers.has(answer)) {
            //console.log('Got press event on an unknown answer. We\'re in bat country now');
            return;
        }

        const ans = answers.get(answer);
        if (ans === question.answer) {
            //console.log('It was the correct answer!');
            props.onCorrectAnswer();
        } else {
            //console.log('It was not the correct answer :(');
            props.onWrongAnswer();
        }
    }
}

