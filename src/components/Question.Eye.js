// @flow

import React from 'react';
import { Text, View, Image} from 'react-native';

import { ButtonList } from './ButtonList.js';

import type { EyeQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    question: EyeQuestion,
    answerService: AnswerService,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    // $FlowFixMe
    const imageSource = require(question.image);

    const answers = props.answerService.getAnswersTo(question, 3);
    const answerButtons = answers.map(answer => {
        return { text: answer };
    });
    return <View>
        <Image source={ imageSource } />
        <ButtonList buttons={ answerButtons } onPress={ () => {} } />
    </View>
}
