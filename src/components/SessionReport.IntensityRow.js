// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './Texts.js';
import { SnapSlider } from './SnapSlider.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import type { IntensityQuestion } from '../models/questions.js';

type Props = {
    question: IntensityQuestion,
    wrongAnswers: Array<string>,
    onPress?: () => void,
};
export function IntensityQuestionRow(props: Props) {
    const subtext = getSubText();
    const items = [];
    for (let i = 1; i <= 5; i++) {
        let label = '';
        const refPoint = props.question.referencePoints.get(i);
        if (refPoint) {
            label = refPoint.name;
        }
        items.push({
            value: i,
            label: label,
        });
    }

    return <View>
        <View>
            <StandardText>{ props.question.correctAnswer.name }</StandardText>
            <StandardText style={ constants.smallText }>{ subtext }</StandardText>
        </View>

        {/* TODO: I need the grouping shit here */}
        <SnapSlider
            items={ items }
            itemStyle={ constants.smallText }
            value={ props.question.correctAnswer.intensity }
            disabled={ true }
            />
        <VerticalSpace />
    </View>

    // TODO: This is copied from SessionReport.EyeRow.js :(
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
