// flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './Texts.js';
import { Link } from './Link.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { navigateToEmotionDetails } from '../navigation-actions.js';

import { SnapSlider } from './SnapSlider.js';

import type { IntensityQuestion } from '../models/questions.js';
import type { Navigation } from '../navigation-actions.js';

type Props = {
    question: IntensityQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: number) => void,
    navigation: Navigation<{}>,
};
type State = {
    lastAnswer: number,
};

const containerStyle = {
    flex: 1,
    justifyContent: 'space-between',
};
export class IntensityQuestionComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            lastAnswer: 1,
        };
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.question !== this.props.question) {
            this.setState({
                lastAnswer: 1,
            });
        }
    }

    render() {
        const emotion = this.props.question.correctAnswer;
        const emotionName = emotion.name;

        const navigation = this.props.navigation;
        const onEmotionPress = () =>
            navigateToEmotionDetails(navigation, emotion);

        return (
            <View style={containerStyle}>
                <View>
                    <Link
                        prefix={'How intense is '}
                        linkText={emotionName}
                        onLinkPress={onEmotionPress}
                        postfix={'?'}
                    />
                    <VerticalSpace multiplier={2} />
                    <IntensityScale
                        onIntensityChosen={this._onIntensityChosen.bind(this)}
                        referencePoints={this.props.question.referencePoints}
                        selectedGroup={this.state.lastAnswer}
                    />
                </View>

                <StandardButton
                    onPress={this._submit.bind(this)}
                    title={'Submit'}
                />
            </View>
        );
    }

    _onIntensityChosen(intensity: number) {
        this.setState({
            lastAnswer: intensity,
        });
    }

    _submit() {
        const answer = this.state.lastAnswer;
        const correctIntensity = this.props.question.correctAnswer.intensity();
        const correctGroup = intensityToGroup(correctIntensity);

        if (correctGroup === answer) {
            this.props.onCorrectAnswer();
        } else {
            this.props.onWrongAnswer(answer);
        }
    }
}

export function intensityToGroup(intensity) {
    const quotient = Math.floor(intensity / 2);
    const remainder = intensity % 2;

    return Math.min(5, quotient + remainder);
}

type ScaleProps = {
    onIntensityChosen: number => void,
    referencePoints: Map<number, Emotion>,
    selectedGroup: number,
};
export function IntensityScale(props: ScaleProps) {
    const items = [];
    for (let i = 1; i <= 5; i++) {
        let label = '';
        if (props.referencePoints.has(i)) {
            label = props.referencePoints.get(i).name + '';
        }
        items.push({
            value: i,
            label: label,
        });
    }

    return (
        <SnapSlider
            items={items}
            value={props.selectedGroup - 1}
            onSlidingComplete={item => props.onIntensityChosen(item.value)}
        />
    );
}

export function IntensityQuestionOverlay(props: SpecificOverlayProps<number>) {
    const text = props.answeredCorrectly
        ? "That's correct!"
        : "That's sadly incorrect";

    return <StandardText>{text}</StandardText>;
}
