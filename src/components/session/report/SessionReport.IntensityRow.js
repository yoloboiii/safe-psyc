// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts.js';
import { SnapSlider } from '~/src/components/lib/SnapSlider.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { constants } from '~/src/styles/constants.js';
import { intensityToGroup } from '~/src/utils/intensity-utils.js';
import { log } from '~/src/services/logger.js';

import type { IntensityQuestion } from '~/src/models/questions.js';

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
    let intensityVisialization = null;
    if (intensity === null || intensity === undefined) {
        log.warn('The intensity for emotion %s was not set', props.question.correctAnswer.name);
    } else {

        intensityVisialization = (
            <SnapSlider
                items={items}
                itemStyle={constants.smallText}
                value={intensityToGroup(intensity) - 1}
                disabled={true}
            />
        );
    }

    return (
        <TouchableOpacity onPress={props.onPress}>
            {/* for the tag=10 test thing */}
            <View>
                <View>
                    <StandardText>{props.question.correctAnswer.name}</StandardText>
                    <StandardText style={constants.smallText}>{subtext}</StandardText>
                </View>
                { intensityVisialization }

                <VerticalSpace />
            </View>
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
