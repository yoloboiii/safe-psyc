// flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from './Texts.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import type { IntensityQuestion } from '../models/questions.js';

type Props = {
    question: IntensityQuestion,
};
export function IntensityQuestionComponent(props: Props) {
    const emotionName = props.question.correctAnswer.name;
    const referencePoints =  new Map();
    referencePoints.set(1, 'sug');
    referencePoints.set(2, 'sug');
    referencePoints.set(3, 'sug');

    return <View style={ constants.flex1 }>
        <StandardText>How intense is { emotionName }</StandardText>
        <VerticalSpace />
        <IntensityScale
            referencePoints={ referencePoints }
            onPress={ (intensity) => console.log('Intensity', intensity) }/>
    </View>
};

type ScaleProps = {
    onPress: (number) => void,
    referencePoints: Map<number, string>,
};
export function IntensityScale(props: ScaleProps) {
    const cells = [];
    for (let i = 1; i <= 5; i++) {
        cells.push( createScaleCell(i) );
    }
    return <View style={{
        backgroundColor: 'red',
        borderColor: 'black',
        borderWidth: 1,
        borderRightWidth: 0,
        flexDirection: 'row',
    }}>
        { cells }
    </View>

    function createScaleCell(number) {
        const colors = ['yellow', 'blue', 'green'];
        return <TouchableOpacity
            ref={ (ref) => console.log('some sort of ref', ref) }
            style={{
                backgroundColor: colors[number % colors.length],
                height: 50,
                width: '20%',
                borderRightColor: 'black',
                borderRightWidth: 1,
            }}
            intensity={ number }
            key={ number }
            onPress={ () => props.onPress(number) } />
    }
}
