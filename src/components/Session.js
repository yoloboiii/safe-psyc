// @flow

import React from 'react';
import { View, ScrollView, Text, Button } from 'react-native';
import { QuestionComponent } from './Question.js';
import { SessionReport } from './SessionReport.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import type { Question } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';
import type { Navigation } from '../navigation-actions.js';

type Props = {
    questions: Array<Question>,
    onSessionFinished: (report: Map<Question, Array<string>>) => void,
    answerService: AnswerService,
    navigation: Navigation<{}>,
};
type State = {
    isFinished: boolean,
    questions: QuestionCollection,
    answers: Array<string>,
    wrongAnswers: Map<Question, number>,
    report: Map<Question, Array<string>>,
};

const paddingStyle = {
    padding: constants.space,
};
export class Session extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this._propsToState(props);
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState(this._propsToState(newProps));
    }

    _propsToState(props) {
        const questions = new QuestionCollection(props.questions);
        return {
            isFinished: false,
            questions: questions,
            answers: questions.size() === 0
                ? []
                : props.answerService.getAnswersTo(questions.peek(), 3),
            wrongAnswers: new Map(),
            report: new Map(),
        };
    }

    _answeredCorrectly() {
        const currentQ = this.state.questions.peek();
        this.state.wrongAnswers.set(
            currentQ,
            0
        );

        if (!this.state.report.has(currentQ)) {
            this.state.report.set(currentQ, []);
        }

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

    _wrongAnswer(answer: string) {
        const currentQ = this.state.questions.peek();
        const prevCount = this.state.wrongAnswers.get(currentQ) || 0;
        const reportArray = this.state.report.get(currentQ) || [];

        this.state.wrongAnswers.set(currentQ, prevCount + 1);

        reportArray.push(answer);
        this.state.report.set(currentQ, reportArray);

        if (prevCount === 2) {
            this.state.questions.push(currentQ);
            this._nextQuestion();
        } else {
            this.forceUpdate();
        }
    }

    _onSessionFinished() {
        this.props.onSessionFinished(this.state.report);
    }

    render() {
        if (this.state.questions.isEmpty()) {
            return <Text>No question in session</Text>

        } else if (this.state.isFinished) {
            return <ScrollView contentContainerStyle={ paddingStyle }>
                <Text>Great job! Congratulations on finishing the session, here's a summary of how it went!</Text>

                <VerticalSpace multiplier={4}/>
                <SessionReport
                    report={ this.state.report }
                    navigation={ this.props.navigation }/>
                <VerticalSpace multiplier={2}/>

                <Button
                    color={ constants.hilightColor2 }
                    title={'Thanks!'}
                    onPress={this._onSessionFinished.bind(this)} />
            </ScrollView>
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
