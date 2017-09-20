// @flow

import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { QuestionComponent } from './Question.js';
import { SessionReport } from './SessionReport.js';
import { VerticalSpace } from './VerticalSpace.js';
import { StandardButton } from './StandardButton.js';
import { StandardText } from './StandardText.js';
import { QuestionProgress } from './QuestionProgress.js';
import { constants } from '../styles/constants.js';

import type { BackendFacade } from '../services/backend.js';
import type { Question } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';
import type { Navigation } from '../navigation-actions.js';

type Props = {
    backendFacade: BackendFacade,
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
    currentQuestionIndex: number,
    totalNumberOfQuestions: number,
};

const questionContainer = {
    flex: 1,
};
const backgroundStyle = {
    backgroundColor: constants.notReallyWhite,
    flex: 1,
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
            currentQuestionIndex: 1,
            totalNumberOfQuestions: questions.size(),
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

        this.props.backendFacade.registerCorrectAnswer(currentQ);

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
        this.setState((prevState) => {
            return {
                answers: this.props.answerService.getAnswersTo(q, 3),
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
            };
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

        this.props.backendFacade.registerIncorrectAnswer(currentQ, answer);

        if (prevCount === 2) {
            this.state.questions.push(currentQ);
            this.state.totalNumberOfQuestions++;
            this._nextQuestion();
        } else {
            this.forceUpdate();
        }
    }

    _onSessionFinished() {
        this.props.onSessionFinished(this.state.report);
    }

    render() {
        return <View
            style={ backgroundStyle }>
            { this._renderContents() }
        </View>
    }

    _renderContents() {
        if (this.state.questions.isEmpty()) {
            return <StandardText>No question in session</StandardText>

        } else if (this.state.isFinished) {
            return <ScrollView
                contentContainerStyle={{ padding: constants.space }}>

                <StandardText>Great job! Congratulations on finishing the session, here's a summary of how it went!</StandardText>

                <VerticalSpace multiplier={4}/>
                <SessionReport
                    report={ this.state.report }
                    navigation={ this.props.navigation }/>
                <VerticalSpace multiplier={2}/>

                <StandardButton
                    title={'Thanks!'}
                    onPress={this._onSessionFinished.bind(this)} />
            </ScrollView>
        } else {
            const currentQuestion = this.state.questions.peek();

            return <View style={ questionContainer }>
                <QuestionProgress current={ this.state.currentQuestionIndex } total={ this.state.totalNumberOfQuestions } />

                <VerticalSpace />

                <QuestionComponent
                question={ currentQuestion }
                answers={ this.state.answers }
                onCorrectAnswer={ this._answeredCorrectly.bind(this) }
                onWrongAnswer={ this._wrongAnswer.bind(this) } />
            </View>
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
