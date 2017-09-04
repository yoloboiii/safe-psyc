// @flow

import React from 'react';
import { Text } from 'react-native';
import { QuestionComponent } from './Question.js';

import type { Question } from '../models/questions.js';

type Props = {
    questions: Array<Question>,
    onSessionFinished: () => void,
};

export class Session extends React.Component<*,*> {

    props: Props;
    state: {
        currentQuestionIndex: number;
    };

    constructor() {
        super();
        this.state = {
            currentQuestionIndex: 0,
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            currentQuestionIndex: 0,
        });
    }

    _answeredCorrectly() {
        const isLastQuestion = this.state.currentQuestionIndex === this.props.questions.length - 1;

        if(isLastQuestion) {
            this.props.onSessionFinished();
        } else {
            this.setState({
                currentQuestionIndex: this.state.currentQuestionIndex + 1,
            });
        }
    }

    render() {
        const currentQuestion = this.props.questions[this.state.currentQuestionIndex];

        if (currentQuestion) {
            return <QuestionComponent
                question={ currentQuestion }
                onCorrectAnswer={ this._answeredCorrectly.bind(this) } />
        } else {
            return <Text>No question in session</Text>
        }
    }
}
