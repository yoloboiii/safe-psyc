// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { EyeQuestionComponent, EyeQuestionOverlay } from './eye/Question.Eye.js';
import { EmotionWordQuestionComponent } from './word/Question.Word.js';
import { IntensityQuestionComponent, IntensityQuestionOverlay } from './intensity/Question.Intensity.js';
import { VerticalSpace } from '../../lib/VerticalSpace.js';
import { StandardText } from '../../lib/Texts.js';
import { StandardButton } from '../../lib/Buttons.js';
import { FlagQuestionButton } from './FlagQuestionButton.js';

import { constants } from '../../../styles/constants.js';
import { log } from '../../../services/logger.js';

import type {
    Question,
    EyeQuestion,
    WordQuestion,
    AnswerType,
} from '../../../models/questions.js';
import type { Emotion } from '../../../models/emotion.js';

type CurrentAnswerState = 'NOT-ANSWERED' | 'CORRECT' | 'WRONG';

export type Props = {
    question: Question,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: AnswerType) => void,
};
type State = {
    currentAnswerState: CurrentAnswerState,
    currentAnswer: ?AnswerType,
};

// TODO: Duolingo's discuss feature on each question is quite cool
export class QuestionComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentAnswerState: 'NOT-ANSWERED',
            currentAnswer: null,
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            currentAnswerState: 'NOT-ANSWERED',
            currentAnswer: null,
        });
    }

    _correctAnswer() {
        this.setState({
            currentAnswerState: 'CORRECT',
            currentAnswer: this.props.question.correctAnswer,
        });
    }

    _wrongAnswer(answer: AnswerType) {
        this.setState({
            currentAnswerState: 'WRONG',
            currentAnswer: answer,
        });
    }

    // Invoked by the overlay to dismiss it
    _questionFinished() {
        const answer = this.state.currentAnswer;
        if (!answer) {
            log.error('A question finished with a null answer. Bat country!');
            return;
        }

        const answeredCorrectly = this.state.currentAnswerState === 'CORRECT';
        answeredCorrectly ? this.props.onCorrectAnswer() : this.props.onWrongAnswer(answer);
    }

    render() {
        const questionView = this._getQuestionComponent();
        const resultOverlay = this._createResultOverLay();
        return (
            <View style={constants.flex1}>
                <View style={constants.padflex}>{questionView}</View>
                {resultOverlay}
            </View>
        );
    }

    _getQuestionComponent() {
        const { question } = this.props;

        const onCorrectAnswer = this._correctAnswer.bind(this);
        const onWrongAnswer = this._wrongAnswer.bind(this);

        switch (question.type) {
            case 'eye-question':
                return (
                    <EyeQuestionComponent
                        question={question}
                        onCorrectAnswer={onCorrectAnswer}
                        onWrongAnswer={onWrongAnswer}
                    />
                );
            case 'word-question':
                return (
                    <EmotionWordQuestionComponent
                        question={question}
                        onCorrectAnswer={onCorrectAnswer}
                        onWrongAnswer={onWrongAnswer}
                    />
                );
            case 'intensity':
                return (
                    <IntensityQuestionComponent
                        question={question}
                        onCorrectAnswer={onCorrectAnswer}
                        onWrongAnswer={onWrongAnswer}
                    />
                );

            default:
                return <UnknownQuestionComponent question={question} />;
        }
    }

    _createResultOverLay() {
        switch (this.state.currentAnswerState) {
            case 'CORRECT':
            case 'WRONG':
                const answer = this.state.currentAnswer;
                if (!answer) {
                    log.error('Tried to render the resultoverlay with a null answer. Bat country!');
                    return;
                }

                return (
                    <ResultOverlay
                        answeredCorrectly={this.state.currentAnswerState === 'CORRECT'}
                        answer={answer}
                        question={this.props.question}
                        onDismiss={this._questionFinished.bind(this)}
                    />
                );

            case 'NOT-ANSWERED':
            default:
                return undefined;
        }
    }
}

function UnknownQuestionComponent(props) {
    const { question } = props;
    return <div>Unknown question type {question.type} </div>;
}

const resultOverlayStyleSheet = StyleSheet.create({
    root: {
        position: 'absolute',
        top: 155, // TODO: I want the overlay to show just beneath the question image in case the user wants to compare them
        width: '100%',

        padding: constants.space(3),
        elevation: 10,
    },
    correct: {
        backgroundColor: constants.positiveColor,
    },
    wrong: {
        backgroundColor: constants.negativeColor,
    },
});

type ResultOverlayProps = {
    question: Question,
    answer: AnswerType,
    answeredCorrectly: boolean,
    onDismiss: () => void,
};
export type SpecificOverlayProps<T> = {
    answeredCorrectly: boolean,
    answer: T,
    question: Question,
};
export function ResultOverlay(props: ResultOverlayProps) {
    const Overlay = props.answeredCorrectly ? CorrectOverlay : WrongOverlay;

    return (
        <Overlay>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'relative',
            }}>
                <View style={constants.flex1}>
                    <QuestionSpecificOverlay {...props} />
                </View>
                <View
                    style={{
                        marginLeft: constants.space(),
                        position: 'absolute',
                        top: 0,
                        right: 0,
                    }}>
                    <FlagQuestionButton question={props.question} />
                </View>
            </View>
            <VerticalSpace multiplier={2} />
            <StandardButton title={'Ok'} onPress={props.onDismiss} />
        </Overlay>
    );
}

class CorrectOverlay extends React.Component<*, {}> {
    getChildContext() {
        return {
            textStyle: {
                ...constants.largeText,
                color: constants.notReallyWhite,
            },
            buttonContainerStyle: {
                backgroundColor: constants.notReallyWhite,
            },
            buttonTextStyle: {
                color: constants.positiveColor,
            },
        };
    }

    render() {
        const style = resultOverlayStyleSheet.correct;
        return <View style={[resultOverlayStyleSheet.root, style]}>{this.props.children}</View>;
    }
}
CorrectOverlay.childContextTypes = {
    textStyle: PropTypes.object,
    buttonContainerStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
};

class WrongOverlay extends React.Component<*, {}> {
    getChildContext() {
        return {
            textStyle: {
                ...constants.largeText,
                color: constants.notReallyWhite,
            },
            buttonContainerStyle: {
                backgroundColor: constants.notReallyWhite,
            },
            buttonTextStyle: {
                color: constants.negativeColor,
            },
        };
    }

    render() {
        const style = resultOverlayStyleSheet.wrong;

        return <View style={[resultOverlayStyleSheet.root, style]}>{this.props.children}</View>;
    }
}
WrongOverlay.childContextTypes = CorrectOverlay.childContextTypes;

function QuestionSpecificOverlay(props: ResultOverlayProps) {
    if (props.question.type === 'eye-question') {
        if (typeof props.answer === 'number') {
            throw new Error('Attempted to render EyeQuestionOverlay with a number as answer');
        }

        return (
            <EyeQuestionOverlay
                question={props.question}
                answeredCorrectly={props.answeredCorrectly}
                answer={props.answer}
            />
        );
    } else if (props.question.type === 'intensity') {
        return (
            <IntensityQuestionOverlay
                question={props.question}
                answeredCorrectly={props.answeredCorrectly}
                answer={props.answer}
            />
        );
    } else {
        let answer: string = '';
        if (props.answer.name && typeof props.answer.name === 'string') {
            answer = props.answer.name;
        } else {
            answer = props.answer.toString();
        }

        const text = props.answeredCorrectly
            ? answer + ' is correct!'
            : answer + ' is unfortunately incorrect';
        return <StandardText style={{ width: '97%' }}>{text}</StandardText>;
    }
}

