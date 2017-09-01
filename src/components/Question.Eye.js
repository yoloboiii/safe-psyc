// @flow

import React from 'react';
import  { Text, View, Image} from 'react-native';
import type { EyeQuestion } from '../models/questions.js';

type Props = {
    question: EyeQuestion,
};
export function EyeQuestionComponent(props: Props) {
    const { question } = props;

    // $FlowFixMe
    const imageSource = require(question.image);

    return <View>
        <Image source={ imageSource } />
    </View>
}
