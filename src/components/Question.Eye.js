// @flow

import React from 'react';
import  { Text, View, Image} from 'react-native';
import type { EyeQuestion } from '../models/questions.js';

type Props = {
    question: EyeQuestion,
};
export class EyeQuestionComponent extends React.Component {

    props: Props;

    render() {
        const { question } = this.props;

        return <View>
            <Image source={require(question.image)} />
        </View>
    }
}
