// flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from '../../../lib/Texts.js';
import { Link } from '../../../lib/Link.js';
import { StandardButton } from '../../../lib/Buttons.js';
import { VerticalSpace } from '../../../lib/VerticalSpace.js';
import { SnapSlider } from '../../../lib/SnapSlider.js';
import { constants } from '../../../../styles/constants.js';
import { navigateToEmotionDetails } from '../../../../navigation-actions.js';
import { intensityToGroup } from '../../../../utils/intensity-utils.js';

// TODO: REMOVE
import { emotionService } from '../../../../services/emotion-service';
import { ScatterChart } from '../../../scatter-plot';

import type { IntensityQuestion } from '../../../../models/questions.js';

type Props = {
    question: IntensityQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: number) => void,
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
        const { question } = this.props;
        const emotion = question.correctAnswer;
        const emotionName = emotion.name;

        const onEmotionPress = () => navigateToEmotionDetails(emotion);

        return (
            <View style={containerStyle}>
                <View>
                    <Link
                        prefix={'How intense is '}
                        linkText={emotionName}
                        onLinkPress={onEmotionPress}
                        postfix={' ?'}
                    />
                    <VerticalSpace multiplier={2} />
                    <IntensityScale
                        onIntensityChosen={this._onIntensityChosen.bind(this)}
                        referencePoints={question.referencePoints}
                        selectedGroup={this.state.lastAnswer}
                    />

                    {false && __DEV__ && <DebugPlot question={question} />}
                </View>

                <StandardButton onPress={this._submit.bind(this)} title={'Submit'} />
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
    const text = props.answeredCorrectly ? "That's correct!" : "That's unfortunately incorrect";

    return <StandardText style={{ width: '97%' }}>{text}</StandardText>;
}

function DebugPlot(props) {
    const { question } = props;
    const activeDots = [question.correctAnswer, ...Array.from(question.referencePoints.values())];
    const inactiveDots = emotionService
        .getEmotionPool()
        .filter(e => !!e.coordinates)
        .filter(e => !activeDots.includes(e));

    return (
        <View>
            <VerticalSpace multiplier={2} />
            <ScatterChart
                horizontalLinesAt={[0]}
                verticalLinesAt={[0]}
                data={[
                    {
                        // Just to set the size of the chart
                        color: 'white',
                        values: [{ x: 20, y: 20 }, { x: -20, y: -20 }],
                    },
                    {
                        color: 'rgba(255, 0, 0, 1)',
                        values: activeDots.map(emotionToDot),
                    },
                    {
                        color: 'rgba(0, 255, 0, 0.2)',
                        values: inactiveDots.map(emotionToDot),
                    },
                ]}
                chartHeight={350}
            />
        </View>
    );

    function emotionToDot(e) {
        const { intensity } = e.coordinates;
        const polar = degreesToRadians(e.coordinates.polar);

        const x = intensity * Math.cos(polar);
        const y = intensity * Math.sin(polar);
        return {
            x,
            y,
            label: e.name,
        };
    }

    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}
