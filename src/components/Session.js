// @flow

import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { QuestionComponent } from './Question.js';
import { SessionReport } from './SessionReport.js';
import { VerticalSpace } from './VerticalSpace.js';
import { StandardButton } from './Buttons.js';
import { StandardText } from './Texts.js';
import { QuestionProgress } from './QuestionProgress.js';
import { constants } from '../styles/constants.js';
import { log } from '../services/logger.js';

import type { BackendFacade } from '../services/backend.js';
import type { Question, AnswerType } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';
import type { AnswerService } from '../services/answer-service.js';
import type { Report } from './SessionReport.js';
import type { Navigation } from '../navigation-actions.js';

type Props = {
    backendFacade: BackendFacade,
    questions: Array<Question>,
    onSessionFinished: (Report) => void,
    navigation: Navigation<{}>,
};
type State = {
    questions: QuestionCollection,
    wrongAnswers: Map<Question, number>,
    report: Map<Question, Array<AnswerType>>,
    currentQuestionIndex: number,
    totalNumberOfQuestions: number,
    isFinished: boolean,
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
            questions: questions,
            wrongAnswers: (new Map(): Map<Question, number>),
            report: (new Map(): Map<Question, Array<AnswerType>>),
            currentQuestionIndex: 1,
            totalNumberOfQuestions: questions.size(),
            isFinished: false,
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

        this.props.backendFacade.registerCorrectAnswer(currentQ)
            .then( () => {
                log.debug('Correct answer to %j saved', currentQ.correctAnswer.name);
            })
            .catch( e => {
                log.error('Failed saving correct answer to %j: %j', currentQ.correctAnswer.name, e);
            });

        const isLastQuestion = this.state.questions.size() === 1;
        if(isLastQuestion) {
            this.props.onSessionFinished(this.state.report);
            this.setState({ isFinished: true });
        } else {
            this._nextQuestion();
        }
    }

    _nextQuestion() {
        this.state.questions.next();
        this.setState((prevState) => {
            return {
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
            };
        });
        this.forceUpdate();
    }

    _wrongAnswer(answer: AnswerType) {
        const currentQ = this.state.questions.peek();
        const prevCount = this.state.wrongAnswers.get(currentQ) || 0;
        const reportArray = this.state.report.get(currentQ) || [];

        this.state.wrongAnswers.set(currentQ, prevCount + 1);

        reportArray.push(answer);
        this.state.report.set(currentQ, reportArray);

        this.props.backendFacade.registerIncorrectAnswer(currentQ, answer)
            .then( () => {
                log.debug('Incorrect answer to %j saved', currentQ.correctAnswer.name);
            })
            .catch( e => {
                log.error('Failed saving incorrect answer to %j: %j', currentQ.correctAnswer.name, e);
            });

        if (prevCount === 2) {
            this.state.questions.push(currentQ);
            this.state.totalNumberOfQuestions++;
            this._nextQuestion();
        } else {
            this.forceUpdate();
        }
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
            return <StandardText>Session finished!</StandardText>
        } else {
            const currentQuestion = this.state.questions.peek();

            return <View style={ questionContainer }>
                <QuestionProgress
                    current={ this.state.currentQuestionIndex }
                    total={ this.state.totalNumberOfQuestions } />

                <VerticalSpace />

                <QuestionComponent
                    navigation={ this.props.navigation }
                    question={ currentQuestion }
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
