// @flow

import React from 'react';
import { View, Image, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { QuestionComponent } from './questions/Question.js';
import { SessionReport } from './report/SessionReport.js';
import { VerticalSpace } from '../lib/VerticalSpace.js';
import { StandardButton } from '../lib//Buttons.js';
import { StandardText } from '../lib//Texts.js';
import { QuestionProgress } from './questions/QuestionProgress.js';
import { constants } from '../../styles/constants.js';
import { log } from '../../services/logger.js';
import { resetToHome } from '../../navigation-actions.js';

import type { AnswerBackendFacade } from '../../services/answer-backend.js';
import type { Question, AnswerType } from '../../models/questions.js';
import type { Emotion } from '../../models/emotion.js';
import type { AnswerService } from '../../services/answer-service.js';
import type { Report } from './report/SessionReport.js';
import type { Navigation, Subscription } from '../../navigation-actions.js';

type Props = {
    backendFacade: AnswerBackendFacade,
    questions: Array<Question>,
    onSessionFinished: Report => void,
    navigation: Navigation<{}>,
};
type State = {
    questions: QuestionCollection,
    wrongAnswers: Map<Question, number>,
    report: Map<Question, Array<AnswerType>>,
    currentQuestionIndex: number,
    totalNumberOfQuestions: number,
    finished: 'no' | 'soon' | 'yes',
};

const questionContainer = {
    flex: 1,
};
const backgroundStyle = {
    backgroundColor: constants.notReallyWhite,
    flex: 1,
};
const topRow = {
    flexDirection: 'row',
    paddingHorizontal: constants.space(),
    paddingTop: constants.space(),
};
const abortContainer = {
    paddingRight: constants.space(),
};
export class Session extends React.Component<Props, State> {
    timeout: ?TimeoutID;
    didFocusSubscription: ?Subscription;
    willBlurSubscription: ?Subscription;

    constructor(props: Props) {
        super(props);
        this.state = this._propsToState(props);
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState(this._propsToState(newProps));
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._askAbort);

        this.props.navigation.addListener('didFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', this._askAbort);
        });

        this.props.navigation.addListener('willBlur', payload => {
            BackHandler.removeEventListener('hardwareBackPress', this._askAbort);
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._askAbort);
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    // Needs to be an anonymous function for removeEventListener to
    // find the correct reference
    _askAbort = () => {
        Alert.alert(
            'Abort session?',
            'Answers are saved, but the progress is lost',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        // TODO: log how many questions were answered
                        log.event('ABORT_SESSION');
                        resetToHome();
                    },
                },
                { text: 'No', style: 'cancel' },
            ],
            {
                cancelable: true,
            }
        );

        return true;
    };

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        BackHandler.removeEventListener('hardwareBackPress', this._askAbort);
    }

    _propsToState(props) {
        const questions = new QuestionCollection(props.questions);
        return {
            questions: questions,
            wrongAnswers: (new Map(): Map<Question, number>),
            report: (new Map(): Map<Question, Array<AnswerType>>),
            currentQuestionIndex: 1,
            totalNumberOfQuestions: questions.size(),
            finished: 'no',
        };
    }

    _answeredCorrectly() {
        this._registerCorrectAnswerInReport();
        this._registerCorrectAnswerInBackend();

        const currentQ = this.state.questions.peek();
        this.state.wrongAnswers.set(currentQ, 0);

        const isLastQuestion = this.state.questions.size() === 1;
        if (isLastQuestion) {
            this.setState(
                {
                    finished: 'soon',
                },
                () => {
                    this.timeout = setTimeout(() => {
                        this.setState({ finished: 'yes' }, () => {
                            this.props.onSessionFinished(this.state.report);
                        });
                    }, 500);
                }
            );
        } else {
            this._nextQuestion();
        }
    }

    _registerCorrectAnswerInReport() {
        const currentQ = this.state.questions.peek();
        if (!this.state.report.has(currentQ)) {
            this.state.report.set(currentQ, []);
        }
    }

    _registerCorrectAnswerInBackend() {
        const currentQ = this.state.questions.peek();
        this.props.backendFacade
            .registerCorrectAnswer(currentQ)
            .then(() => {
                log.debug('Correct answer to %j saved', currentQ.correctAnswer.name);
            })
            .catch(e => {
                log.error('Failed saving correct answer to %j: %j', currentQ.correctAnswer.name, e);
            });
    }

    _nextQuestion() {
        this.state.questions.next();
        this.setState(prevState => {
            return {
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
            };
        });
        this.forceUpdate();
    }

    _wrongAnswer(answer: AnswerType) {
        this._registerWrongAnswerInReport(answer);
        this._registerWrongAnswerInBackend(answer);

        const currentQ = this.state.questions.peek();
        const prevCount = this.state.wrongAnswers.get(currentQ) || 0;
        this.state.wrongAnswers.set(currentQ, prevCount + 1);

        if (prevCount === 2) {
            this.state.questions.push(currentQ);
            this.state.totalNumberOfQuestions++;
            this._nextQuestion();
        } else {
            this.forceUpdate();
        }
    }

    _registerWrongAnswerInReport(answer) {
        const currentQ = this.state.questions.peek();
        const reportArray = this.state.report.get(currentQ) || [];
        reportArray.push(answer);
        this.state.report.set(currentQ, reportArray);
    }

    _registerWrongAnswerInBackend(answer) {
        const currentQ = this.state.questions.peek();
        this.props.backendFacade
            .registerIncorrectAnswer(currentQ, answer)
            .then(() => {
                log.debug('Incorrect answer to %j saved', currentQ.correctAnswer.name);
            })
            .catch(e => {
                log.error(
                    'Failed saving incorrect answer to %j: %j',
                    currentQ.correctAnswer.name,
                    e
                );
            });
    }

    render() {
        return <View style={backgroundStyle}>{this._renderContents()}</View>;
    }

    _renderContents() {
        if (this.state.questions.isEmpty() && this.state.finished !== 'soon') {
            return <StandardText>No question in session</StandardText>;
        } else if (this.state.finished === 'yes') {
            return <StandardText>Session finished!</StandardText>;
        } else {
            const questionIndex =
                this.state.finished === 'soon'
                    ? this.state.currentQuestionIndex + 1
                    : this.state.currentQuestionIndex;

            const currentQuestion = this.state.questions.peek();

            return (
                <View style={questionContainer}>
                    <View style={topRow}>
                        <AbortSessionButton onPress={this._askAbort} />

                        <QuestionProgress
                            current={questionIndex}
                            total={this.state.totalNumberOfQuestions}
                        />
                    </View>

                    <VerticalSpace />

                    <QuestionComponent
                        question={currentQuestion}
                        onCorrectAnswer={this._answeredCorrectly.bind(this)}
                        onWrongAnswer={this._wrongAnswer.bind(this)}
                    />
                </View>
            );
        }
    }
}

export function AbortSessionButton(props: { onPress: () => * }) {
    // $FlowFixMe
    const closeImage = require('../../../images/close.png');

    return (
        <TouchableOpacity style={abortContainer} onPress={props.onPress}>
            <Image
                source={closeImage}
                style={{ tintColor: constants.primaryColor }}
                width={constants.space(3)}
                height={constants.space(3)}
            />
        </TouchableOpacity>
    );
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
        return this.size() === 0;
    }
}
