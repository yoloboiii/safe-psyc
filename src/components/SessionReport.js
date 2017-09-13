// @flow

import React from 'react';
import { FlatList, View,  Text, Modal } from 'react-native';
import { EyeQuestionRow } from './SessionReport.EyeRow.js';
import { QuestionDetails } from './QuestionDetails.js';
import { navigateToQuestionDetails } from '../navigation-actions.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';
import type { Navigation } from '../navigation-actions.js';

type Props = {
    report: Map<Question, Array<string>>,
    navigation: Navigation<{}>,
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
        renderItem={(data) => renderRow(data.item, props.navigation)} />
}

function renderRow(item, navigation) {
    const { question, wrongAnswers } = item;

    if (question.type === 'eye-question') {
        return <EyeQuestionRow
            question={ (question: EyeQuestion) }
            wrongAnswers={ wrongAnswers }
            onPopoutQuestion={ () => navigateToQuestionDetails(navigation, question) }
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

// TODO: Move to separate file
function WordQuestionRow(props) {
    return <View>
        <Text>{ props.question.questionText }</Text>
    </View>
}
