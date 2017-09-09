// @flow

import React from 'react';
import  { Text, View, StyleSheet } from 'react-native';

import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type CurrentAnswerState = 'NOT-ANSWERED' | 'CORRECT' | 'WRONG';

type Props = {
    question: Question,
    answerService: AnswerService,
    onCorrectAnswer: () => void,
    onWrongAnswer: () => void,
};
type State = {
    currentAnswerState: CurrentAnswerState,
};

// TODO: Duolingo's discuss feature on each question is quite cool
export class QuestionComponent extends React.Component<Props,State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentAnswerState: 'NOT-ANSWERED',
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            currentAnswerState: 'NOT-ANSWERED',
        });
    }

    _correctAnswer() {
        this.setState({ currentAnswerState: 'CORRECT' });
        this.props.onCorrectAnswer();
    }

    _wrongAnswer() {
        this.setState({ currentAnswerState: 'WRONG' });
        this.props.onWrongAnswer();
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
                    question={this.props.question} />

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

        padding: 50,

        backgroundColor: 'green',
    },
});
type ResultOverlayProps = {
    question: Question,
    answeredCorrectly: boolean,
}
export function ResultOverlay(props: ResultOverlayProps) {
    const text = props.answeredCorrectly
        ? 'Correct!'
        : 'That is sadly incorrect';

    return <View style={resultOverlayStyleSheet.root}>
        <Text>{text}</Text>
    </View>
}
