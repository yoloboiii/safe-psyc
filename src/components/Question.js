// @flow

import React from 'react';
import  { Text, Button, View, StyleSheet } from 'react-native';

import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { VerticalSpace } from './VerticalSpace.js';

import { constants } from '../styles/constants.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type CurrentAnswerState = 'NOT-ANSWERED' | 'CORRECT' | 'WRONG';

type Props = {
    question: Question,
    answerService: AnswerService,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: string) => void,
};
type State = {
    currentAnswerState: CurrentAnswerState,
    currentAnswer: string,
};

// TODO: Duolingo's discuss feature on each question is quite cool
export class QuestionComponent extends React.Component<Props,State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentAnswerState: 'NOT-ANSWERED',
            currentAnswer: '',
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            currentAnswerState: 'NOT-ANSWERED',
            currentAnswer: '',
        });
    }

    _correctAnswer() {
        this.setState({
            currentAnswerState: 'CORRECT',
            currentAnswer: this.props.question.answer,
        });
    }

    _wrongAnswer(answer: string) {
        this.setState({
            currentAnswerState: 'WRONG',
            currentAnswer: answer,
        });
    }

    // Invoked by the overlay to dismiss it
    _questionFinished() {
        const answeredCorrectly= this.state.currentAnswerState === 'CORRECT';
        answeredCorrectly
            ? this.props.onCorrectAnswer()
            : this.props.onWrongAnswer(this.state.currentAnswer);
    }

    render() {
        const questionView = this._getQuestionComponent();
        const resultOverlay = this._createResultOverLay();
        return <View>
            { questionView }
            { resultOverlay }
        </View>
    }

    _getQuestionComponent() {
        const { question, answerService } = this.props;

        const onCorrectAnswer = this._correctAnswer.bind(this);
        const onWrongAnswer = this._wrongAnswer.bind(this);

        switch(question.type) {
            case 'eye-question':
                return <EyeQuestionComponent
                            question={ question }
                            answerService={ answerService }
                            onCorrectAnswer={ onCorrectAnswer }
                            onWrongAnswer={ onWrongAnswer } />
            case 'word-question':
                return <EmotionWordQuestionComponent
                            question={ question }
                            answerService={ answerService }
                            onCorrectAnswer={ onCorrectAnswer }
                            onWrongAnswer={ onWrongAnswer } />
            default:
                return <UnknownQuestionComponent question={ question } />;
        }
    }

    _createResultOverLay() {
        switch(this.state.currentAnswerState) {
            case 'CORRECT':
            case 'WRONG':
                return <ResultOverlay
                    answeredCorrectly={this.state.currentAnswerState === 'CORRECT'}
                    answer={this.state.currentAnswer}
                    question={this.props.question}
                    onDismiss={this._questionFinished.bind(this)}
                    />

            case 'NOT-ANSWERED':
            default:
                return undefined;
        }
    }
}

function UnknownQuestionComponent(props) {
    const { question } = props;
    return <div>Unknown question type { question.type } </div>;
}

const resultOverlayStyleSheet = StyleSheet.create({
    root: {
        position: 'absolute',
        top: 155,
        width: '100%',

        padding: 3 * constants.space,
    },
    correct: {
        backgroundColor: constants.green,
    },
    wrong: {
        backgroundColor: constants.red,
    },
});
type ResultOverlayProps = {
    question: Question,
    answer: string,
    answeredCorrectly: boolean,
    onDismiss: () => void,
}
export function ResultOverlay(props: ResultOverlayProps) {
    const text = props.answeredCorrectly
        ? props.answer + ' is correct!'
        : props.answer + ' is sadly incorrect';
    const style = props.answeredCorrectly
        ? resultOverlayStyleSheet.correct
        : resultOverlayStyleSheet.wrong;

    return <View style={[resultOverlayStyleSheet.root, style]}>
        <Text>{text}</Text>
        <VerticalSpace />
        <Button
            title={'Ok'}
            onPress={props.onDismiss} />
    </View>
}
