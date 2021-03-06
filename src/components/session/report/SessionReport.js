// @flow

import React from 'react';
import { SectionList, View, Modal } from 'react-native';

import { EyeQuestionRow } from './SessionReport.EyeRow.js';
import { IntensityQuestionRow } from './SessionReport.IntensityRow.js';

import { EmotionDetails } from '~/src/components/EmotionDetails.js';
import { StandardText } from '~/src/components/lib/Texts.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { navigateToEmotionDetails } from '~/src/navigation-actions.js';
import { constants } from '~/src/styles/constants.js';

import type {
    Question,
    EyeQuestion,
    WordQuestion,
    IntensityQuestion,
    AnswerType,
} from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';

export type Report = Map<Question, Array<AnswerType>>;
type Props = {
    report: Report,
};

export function SessionReport(props: Props) {
    let key = 0;
    const sections = {};
    props.report.forEach((wrongAnswers, question) => {
        if (sections[question.type] === undefined) {
            sections[question.type] = {
                title: question.type,
                data: [],
            };
        }

        sections[question.type].data.push({
            key: key++,
            question: question,
            wrongAnswers: wrongAnswers,
        });
    });

    const sectionsProp = Object.values(sections);
    sectionsProp.sort((a, b) => {
        // $FlowFixMe
        return a.title > b.title;
    });

    return (
        <SectionList
            sections={sectionsProp}
            renderItem={data => renderRow(data.item, onPressItem)}
            ItemSeparatorComponent={() => <VerticalSpace />}
        />
    );

    function onPressItem(question) {
        navigateToEmotionDetails(question.correctAnswer);
    }
}

function renderRow(item, onPress) {
    const { question, wrongAnswers } = item;

    if (question.type === 'eye-question') {
        return (
            <EyeQuestionRow
                question={(question: EyeQuestion)}
                wrongAnswers={wrongAnswers}
                onPress={() => onPress(question)}
            />
        );
    } else if (question.type === 'word-question') {
        return (
            <WordQuestionRow
                question={(question: WordQuestion)}
                wrongAnswers={wrongAnswers}
            />
        );
    } else if (question.type === 'intensity') {
        return (
            <IntensityQuestionRow
                question={(question: IntensityQuestion)}
                wrongAnswers={wrongAnswers}
                onPress={() => onPress(question)}
            />
        );
    } else {
        return <StandardText>Unknown question {question.type}</StandardText>;
    }
}

// TODO: Move to separate file
function WordQuestionRow(props) {
    return (
        <View>
            <StandardText>{props.question.correctAnswer.description}</StandardText>
            <StandardText style={{
                ...constants.smallText,

                alignSelf: 'flex-end',
                marginTop: constants.space(1),
                maxWidth: '50%',
            }}>
                {props.question.correctAnswer.name}
            </StandardText>
        </View>
    );
}
