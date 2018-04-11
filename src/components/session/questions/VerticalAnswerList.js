// @flow

import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { StandardButton } from '~/src/components/lib/Buttons.js';
import { StandardText } from '~/src/components/lib/Texts.js';
import { constants } from '~/src/styles/constants.js';

import type { Emotion } from '~/src/models/emotion.js';

type Props = {
    correctAnswer: Emotion,
    answers: Array<Emotion>,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
    onHelp?: (emotion: Emotion) => void,
};

export function VerticalAnswerList(props: Props) {
    return (
        <View>
            { props.answers.map(answer => <AnswerButton
                    key={answer.name}
                    emotion={answer}

                    onPress={answer => onAnswerPress(answer, props)}
                    onHelp={props.onHelp}
                />
            )}
        </View>
    );
}

type AnswerButtonProps = {
    emotion: Emotion,
    onPress: (Emotion) => void,
    onHelp: (Emotion) => void,
};
function AnswerButton(props: AnswerButton) {
    const { emotion, onPress, onHelp } = props;

    return (
        <View testID='answer-button'>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <StandardButton
                    containerStyle={constants.flex1}
                    title={AnswerButtonContainerHoC({ emotion, onHelp })}
                    onPress={() => onPress(emotion)}
                />
            </View>
            <VerticalSpace />
        </View>
    );
}

type AnswerButtonContainerHoCProps = {
    emotion: Emotion,
    onHelp: (Emotion) => void,
};
function AnswerButtonContainerHoC(props: AnswerButtonContainerHoCProps) {

    const { emotion, onHelp } = props;
    const onHelpComponent = onHelp && <Help onHelp={() => onHelp(emotion)} />;
    const horizontalCenterer = onHelp && <View style={{ width: 25 + 2 * constants.space() }} />

    return (innerProps) => <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
    >
        { horizontalCenterer }
        <StandardText style={[...innerProps.textStyle, constants.flex1]}>{emotion.name}</StandardText>
        { onHelpComponent }
    </View>
}

function Help(props) {
    const { onHelp } = props;

    return <TouchableOpacity onPress={onHelp}>
        <Image
            // $FlowFixMe
            source={require('../../../../images/help.png')}
            style={{
                width: 25,
                height: 25,
                marginHorizontal: constants.space(),
                tintColor: 'rgba(255,255,255, 0.5)',
            }}
        />
    </TouchableOpacity>
}

function onAnswerPress(answer, props) {
    if (answer === props.correctAnswer) {
        props.onCorrectAnswer();
    } else {
        props.onWrongAnswer(answer);
    }
}
