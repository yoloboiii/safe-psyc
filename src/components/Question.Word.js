// @flow

import React from 'react';
import  { Text, View } from 'react-native';
import type { EmotionWordQuestion } from '../models/questions.js';

type Props = {
    question: EmotionWordQuestion,
};
export class EmotionWordQuestionComponent extends React.Component {

    props: Props;

    render() {
        const { question } = this.props;

        return <View>
            <Text>{ question.questionText }</Text>
        </View>
    }
}
