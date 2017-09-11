// @flow

import React from 'react';
import { Text } from 'react-native';
import { QuestionComponent } from './Question.js';

import type { Question } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    questions: Array<Question>,
    onSessionFinished: () => void,
    answerService: AnswerService,
};
type State = {
    questions: QuestionCollection,
    wrongAnswers: Map<Question, number>,
};

export class Session extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            questions: new QuestionCollection(props.questions),
            wrongAnswers: new Map(),
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            questions: new QuestionCollection(newProps.questions),
            wrongAnswers: new Map(),
        });
    }

    _answeredCorrectly() {
        this.state.wrongAnswers.set(
            this.state.questions.peek(),
            0
        );

        const isLastQuestion = this.state.questions.size() === 1;
        if(isLastQuestion) {
            this.props.onSessionFinished();
        } else {
            this.state.questions.next();
            this.forceUpdate();
        }
    }

    _wrongAnswer() {
        const currentQ = this.state.questions.peek();
        const prev = this.state.wrongAnswers.get(currentQ) || 0;

        this.state.wrongAnswers.set(currentQ, prev + 1);

        if (prev === 2) {
            this.state.questions.next();
            this.state.questions.push(currentQ);
        }

        this.forceUpdate();
    }

    render() {
        if (this.state.questions.isEmpty()) {
            return <Text>No question in session</Text>

        } else {
            const currentQuestion = this.state.questions.peek();

            return <QuestionComponent
                question={ currentQuestion }
                answerService={ this.props.answerService }
                onCorrectAnswer={ this._answeredCorrectly.bind(this) }
                onWrongAnswer={ this._wrongAnswer.bind(this) } />
        }
    }
}

class QuestionCollection {
    _questions: Array<Question>;

    constructor(questions: Array<Question>) {
        this._questions = questions.slice();
    }

    hasNext(): boolean {
        return this._questions.length > 0;
    }

    next(): Question {
        if (!this.hasNext()) {
            throw new Error('Called next on empty collection');
        } else {
            return this._questions.shift();
        }
    }

    peek(): Question {
        if (this.isEmpty()) {
            throw new Error('Cannot peek an empty collection');
        }

        return this._questions[0];
    }

    push(question: Question) {
        this._questions.push(question);
    }

    size(): number {
        return this._questions.length;
    }

    isEmpty(): boolean {
        return this.size() === 0
    }
}
