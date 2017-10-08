// @flow

import React from 'react';
import { FlatList, View,  Modal } from 'react-native';
import { EyeQuestionRow } from './SessionReport.EyeRow.js';
import { IntensityQuestionRow } from './SessionReport.IntensityRow.js';
import { EmotionDetails } from './EmotionDetails.js';
import { StandardText } from './Texts.js';
import { VerticalSpace } from './VerticalSpace.js';
import { navigateToEmotionDetails } from '../navigation-actions.js';

import type { Question, EyeQuestion, EmotionWordQuestion, IntensityQuestion, AnswerType } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';
import type { Navigation } from '../navigation-actions.js';

export type Report = Map<Question, Array<AnswerType>>;
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
        renderItem={(data) => renderRow(data.item, onPressItem)}
        ItemSeparatorComponent={ () => <VerticalSpace multiplier={3} /> }
        />


    function onPressItem(question) {
        navigateToEmotionDetails(props.navigation, question.correctAnswer);
    }
}

function renderRow(item, onPress) {
    const { question, wrongAnswers } = item;

    if (question.type === 'eye-question') {
        return <EyeQuestionRow
            question={ (question: EyeQuestion) }
            wrongAnswers={ wrongAnswers }
            onPress={ () => onPress(question) }
            />
    } else if (question.type === 'word-question') {
        return <WordQuestionRow
            question={ (question: EmotionWordQuestion) }
            wrongAnswers={ wrongAnswers }
            />
    } else if (question.type === 'intensity') {
        return <IntensityQuestionRow
            question={ (question: IntensityQuestion) }
            wrongAnswers={ wrongAnswers }
            onPress={ () => onPress(question) }
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
