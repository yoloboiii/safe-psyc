// @flow

import React from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';

type Props = {
    report: Map<Question, Array<string>>,
};
export function SessionReport(props: Props) {

    let key = 0;
    const data = [];
    props.report.forEach((wrongAnswers, question) => {
        data.push({
            key: key++,
            question: question,
            wrongAnswers: wrongAnswers,
        });
    });

    return <FlatList
        data={data}
        renderItem={(data) => renderRow(data.item)} />
}

function renderRow(props) {
    const { question, wrongAnswers } = props;

    if (question.type === 'eye-question') {
        return <EyeQuestionRow
            question={ (question: EyeQuestion) }
            wrongAnswers={ wrongAnswers }
            />
    } else if (question.type === 'word-question') {
        return <WordQuestionRow
            question={ (question: EmotionWordQuestion) }
            wrongAnswers={ wrongAnswers }
            />
    } else  {
        return <Text>Unknown question {question.type}</Text>
    }
}

const eyeContainerStyle = {
    paddingBottom: 2 * constants.space,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
};
const subtextStyle = {
    fontSize: 8,
};
const imageContainerStyle = {
    width: '40%',
    height: 4 * constants.space,
};
const imageStyle = {
    height: '100%',
};
function EyeQuestionRow(props) {
    const subtext = getSubText();

    return <View style={ eyeContainerStyle }>
        <View>
            <Text>{ props.question.answer }</Text>
            <Text style={ subtextStyle }>{ subtext }</Text>
        </View>
        <View style={ imageContainerStyle }>
            <Image
                source={{ uri: props.question.image }}
                resizeMode='cover'
                style={ imageStyle } />
        </View>
    </View>

    function getSubText() {
        if (props.wrongAnswers.length === 0) {
            return '';
        }

        if (props.wrongAnswers.length === 1) {
            return 'You almost had this one!';
        }

        return 'This was a hard one';
    }
}

function WordQuestionRow(props) {
    return <View>
        <Text>{ props.question.questionText }</Text>
    </View>
}
