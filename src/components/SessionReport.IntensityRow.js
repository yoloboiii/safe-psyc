// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from './Texts.js';
import { SnapSlider } from './SnapSlider.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { intensityToGroup } from '../utils/intensity-utils.js';
import { log } from '../services/logger.js';

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

    const intensity = props.question.correctAnswer.intensity();
    if (intensity === null || intensity === undefined) {
        log.warn('The intensity for emotion %s was not set', props.question.correctAnswer.name);
    }

    const intensityVisialization = intensity ? (
        <SnapSlider
            items={items}
            itemStyle={constants.smallText}
            value={intensityToGroup(intensity) - 1}
            disabled={true}
        />
    ) : null;

    return (
        <TouchableOpacity onPress={props.onPress}>
            <View>
                <StandardText>{props.question.correctAnswer.name}</StandardText>
                <StandardText style={constants.smallText}>{subtext}</StandardText>
            </View>

            <VerticalSpace />
        </TouchableOpacity>
    );

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
