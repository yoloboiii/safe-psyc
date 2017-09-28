// @flow

import React from 'react';
import { FlatList, View,  Modal } from 'react-native';
import { EyeQuestionRow } from './SessionReport.EyeRow.js';
import { EmotionDetails } from './EmotionDetails.js';
import { StandardText } from './Texts.js';
import { navigateToEmotionDetails } from '../navigation-actions.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';
import type { Navigation } from '../navigation-actions.js';

export type Report = Map<Question, Array<Emotion>>;
type Props = {
    report: Report,
    navigation: Navigation<any>,
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
            onPress={ () => navigateToEmotionDetails(navigation, question.correctAnswer) }
            />
    } else if (question.type === 'word-question') {
        return <WordQuestionRow
            question={ (question: EmotionWordQuestion) }
            wrongAnswers={ wrongAnswers }
            />
    } else  {
        return <StandardText>Unknown question {question.type}</StandardText>
    }
}

// TODO: Move to separate file
function WordQuestionRow(props) {
    return <View>
        <StandardText>{ props.question.questionText }</StandardText>
    </View>
}
