// @flow

import React from 'react';
import { View, Text, Button } from 'react-native';
import { QuestionComponent } from './Question.js';

import type { Question } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';

type Props = {
    questions: Array<Question>,
    onSessionFinished: () => void,
    answerService: AnswerService,
};
type State = {
    isFinished: boolean,
    questions: QuestionCollection,
    answers: Array<string>,
    wrongAnswers: Map<Question, number>,
};

export class Session extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const questions = new QuestionCollection(props.questions);
        this.state = {
            isFinished: false,
            questions: questions,
            answers: questions.size() === 0
                ? []
                : props.answerService.getAnswersTo(questions.peek(), 3),
            wrongAnswers: new Map(),
        };
    }

    componentWillReceiveProps(newProps: Props) {
        const questions = new QuestionCollection(props.questions);
        this.setState({
            isFinished: false,
            questions: questions,
            answers: questions.size() === 0
                ? []
                : props.answerService.getAnswersTo(questions.peek(), 3),
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
            this.setState({ isFinished: true });
        } else {
            this._nextQuestion();
        }
    }

    _nextQuestion() {
        this.state.questions.next();
        const q = this.state.questions.peek();
        this.setState({
            answers: this.props.answerService.getAnswersTo(q, 3),
        });
        this.forceUpdate();
    }

    _wrongAnswer() {
        const currentQ = this.state.questions.peek();
        const prev = this.state.wrongAnswers.get(currentQ) || 0;

        this.state.wrongAnswers.set(currentQ, prev + 1);

        if (prev === 2) {
            this.state.questions.push(currentQ);
            this._nextQuestion();
        } else {
            this.forceUpdate();
        }
    }

    render() {
        if (this.state.questions.isEmpty()) {
            return <Text>No question in session</Text>

        } else if (this.state.isFinished) {
            return <View>
                <Text>Great job! Congratulations on finishing the session</Text>

                <Button title={'Thanks!'} onPress={this.props.onSessionFinished} />
            </View>
        } else {
            const currentQuestion = this.state.questions.peek();

            return <QuestionComponent
                question={ currentQuestion }
                answers={ this.state.answers }
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
