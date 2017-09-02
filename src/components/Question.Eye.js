// @flow

import React from 'react';
import { Text, View, Image} from 'react-native';

import { answerService } from '../services/answer-service.js';
import { ButtonList } from './ButtonList.js';

import type { EyeQuestion } from '../models/questions.js';

type Props = {
    question: EyeQuestion,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    // $FlowFixMe
    const imageSource = require(question.image);

    const answers = answerService.getAnswersTo(question, 3);
    const answerButtons = answers.map(answer => {
        return { text: answer };
    });
    return <View>
        <Image source={ imageSource } />
        <ButtonList buttons={ answerButtons } />
    </View>
}
