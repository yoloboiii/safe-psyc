// @flow

import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { navigateToQuestionDetails } from '../navigation-actions.js';

import type { Question, EyeQuestion } from '../models/questions.js';
import type { Navigation } from '../navigation-actions.js';
import type moment from 'moment';

const detailsContainerStyle = { padding: constants.space };
const detailsImageStyle = {
    height: 200,
};

export type DataPoints = {
    correct: Array<moment$Moment>,
    incorrect: Array<{
        question: Question,
        when: moment$Moment,
    }>,
};
type Props = {
    question: Question,
    dataPoints: DataPoints,
    navigation: Navigation<*>,
};
export function QuestionDetails(props: Props) {
    const image = props.question.image
        ? <View>
            <Image source={{ uri: props.question.image }}
                resizeMode='cover'
                style={ detailsImageStyle }/>
            <VerticalSpace />
          </View>
        : undefined;

    const details = props.dataPoints.correct.length + props.dataPoints.incorrect.length < 4
        ? <StandardText>You haven't encountered this emotion enough to give any stats</StandardText>
        : <View>
            <StrengthMeter dataPoints={ props.dataPoints } />
            <ConfusionList
                dataPoints={ props.dataPoints }
                navigation={ props.navigation } />
        </View>

    return <View style={ detailsContainerStyle }>
        <StandardText style={ constants.largeText }>Question Details</StandardText>
        <VerticalSpace />

        <StandardText>{ props.question.answer }</StandardText>
        { image }

        { details }
    </View>
}

function StrengthMeter(props) {
    const { correct, incorrect } = props.dataPoints;

    const percent = correct.length / (correct.length + incorrect.length);
    return <TriangularMeter percent={ percent } />
}

export function TriangularMeter(props: { percent: number }) {
    const { percent } = props;
    return <View>
        <StandardText>{percent}%</StandardText>
    </View>
}

function ConfusionList(props) {
    const { navigation } = props;
    const { correct, incorrect } = props.dataPoints;

    if (incorrect.length < 4) {
        return null;
    }

    const data = new Map();
    incorrect.forEach(i => data.set(i.question.answer, {
        question: i.question,
        key: i.question.answer,
    }));
    return <View>
        <StandardText>You sometimes get this confused with...</StandardText>
        <FlatList
            data={ Array.from(data.values()) }
            renderItem={ renderRow } />
    </View>

    function renderRow(props: { item: { question: Question }}) {
        const { question } = props.item;
        const navigate = () => navigateToQuestionDetails(navigation, question);
        return <StandardText onPress={ navigate }>{ question.answer }</StandardText>
    }
}
