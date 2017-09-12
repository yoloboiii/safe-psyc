// @flow

import React from 'react';
import { View, Image, Text, FlatList } from 'react-native';
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

function EyeQuestionRow(props) {
    const subtext = getSubText();

    return <View style={{
        padding: constants.space,
        paddingBottom: 2 * constants.space,
        flex: 1,
        justifyContent: 'space-between',
    }}>
        <View>
            <Text>{ props.question.answer }</Text>
            <Text style={{
                fontSize: 8,
            }}>{ subtext }</Text>
        </View>
        <Image source={{ uri: props.question.image }} />
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
