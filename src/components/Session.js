// @flow

import React from 'react';
import { Text } from 'react-native';
import { QuestionComponent } from './Question.js';

import type { Question } from '../models/questions.js';

type Props = {
    questions: Array<Question>
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

    render() {
        const currentQuestion = this.props.questions[this.state.currentQuestionIndex];

        if (currentQuestion) {
            return <QuestionComponent question={ currentQuestion } />
        } else {
            return <Text>No question in session</Text>
        }
    }
}
