// flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from './Texts.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import { SnapSlider } from './SnapSlider.js';

import type { IntensityQuestion } from '../models/questions.js';

type Props = {
    question: IntensityQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: number) => void,
};
export function IntensityQuestionComponent(props: Props) {
    const emotionName = props.question.correctAnswer.name;
    const referencePoints =  new Map();
    referencePoints.set(1, 'calm');
    referencePoints.set(3, 'irritated');
    referencePoints.set(5, 'angry');

    return <View style={ constants.flex1 }>
        <StandardText>How intense is { emotionName }?</StandardText>
        <VerticalSpace />
        <IntensityScale
            onIntensityChosen={ _onIntensityChosen }
            referencePoints={ referencePoints }
            />
    </View>

    function _onIntensityChosen(intensity: number) {
        console.log('YATTAMAS', intensity);
        if (props.question.correctAnswer.intensity === intensity) {
            props.onCorrectAnswer();
        } else {
            props.onWrongAnswer(intensity);
        }
    }
};

type ScaleProps = {
    onIntensityChosen: (number) => void,
    referencePoints: Map<number, string>,
};
export function IntensityScale(props: ScaleProps) {
    const items = [];
    for (let i = 1; i <= 5; i++) {
        items.push({
            value: i,
            label: props.referencePoints.get(i) || '',
        });
    }

    return <SnapSlider
        items={ items }
        onSlidingComplete={ (item) => props.onIntensityChosen(item.value) }
        />
}
