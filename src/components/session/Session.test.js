// @flow

jest.useFakeTimers();
jest.mock('BackHandler', () => {
    return require('react-native/Libraries/Utilities/__mocks__/BackHandler');
});

import React from 'react';
import { Button, TouchableOpacity, Alert, BackHandler } from 'react-native';

import { Session, AbortSessionButton } from './Session.js';
import { answerService } from '../../services/answer-service.js';
import { QuestionComponent } from './questions/Question.js';
import { QuestionProgress } from './questions/QuestionProgress.js';

import { render, renderShallow } from '../../../tests/render-utils.js';
import { findChildren, getAllRenderedStrings } from '../../../tests/component-tree-utils.js';
import {
    randomQuestions,
    randomQuestion,
    getQuestion,
    clickAnswerAndDismissOverlay,
    clickWrongAnswerAndDismissOverlay,
} from '../../../tests/question-utils.js';

const defaultProps = {
    questions: randomQuestions(5),
    backendFacade: {
        registerCorrectAnswer: promiseMock(),
        registerIncorrectAnswer: promiseMock(),
    },
    onSessionFinished: () => {},
    answerService: answerService,
    navigation: {
        navigate: jest.fn(),
        dispatch: jest.fn(),
        addListener: jest.fn(),
    },
};

it('shows an error screen if no questions are given', () => {
    const questions = [];
    const component = renderShallow(Session, { questions: questions }, defaultProps);

    expect(component).toContainStrings('no', 'question');
    expect(component).not.toHaveChild(QuestionComponent);
});

it('starts by showing a question', () => {
    const questions = randomQuestions();
    const component = renderShallow(Session, { questions: questions }, defaultProps);

    expect(component).toHaveChild(QuestionComponent);
});

it('shows another question when the first is answered', () => {
    const questions = randomQuestions();
    const component = render(Session, { questions: questions }, defaultProps);

    const firstQuestion = getQuestion(component);
    clickAnswerAndDismissOverlay(component);
    const secondQuestion = getQuestion(component);

    expect(secondQuestion).not.toEqual(firstQuestion);
});

it('finishes the session if the last question was answered correctly', () => {
    const questions = [randomQuestion()];
    const sessionFinishedSpy = jest.fn();

    const component = render(
        Session,
        {
            questions: questions,
            onSessionFinished: sessionFinishedSpy,
        },
        defaultProps
    );

    clickAnswerAndDismissOverlay(component);

    // Click all buttons to dismiss the finishing congrats
    findChildren(component, Button).forEach(
        button => button.props.onPress && button.props.onPress()
    );

    jest.runAllTimers();
    expect(sessionFinishedSpy).toHaveBeenCalledTimes(1);
});

it('shows all questions eventually', () => {
    const questions = randomQuestions();
    const component = render(Session, { questions: questions }, defaultProps);

    const seen = new Map();
    for (let i = 0; i < questions.length; i++) {
        const question = getQuestion(component);
        seen.set(question, true);

        const button = clickAnswerAndDismissOverlay(component);
    }

    expect(seen.size).toBe(questions.length);
});

it("doesn't repeat correctly answered questions", () => {
    const questions = randomQuestions();
    const component = render(Session, { questions: questions }, defaultProps);

    const seen = new Map();
    for (let i = 0; i < questions.length; i++) {
        const question = getQuestion(component);
        expect(seen.has(question)).toBe(false);

        seen.set(question, true);

        clickAnswerAndDismissOverlay(component);
    }
});

it('repeats an incorrectly answered question immediately', () => {
    const questions = randomQuestions();
    const component = render(Session, { questions: questions }, defaultProps);

    const firstQuestion = getQuestion(component);
    clickWrongAnswerAndDismissOverlay(component);
    const secondQuestion = getQuestion(component);

    expect(secondQuestion).toEqual(firstQuestion);
});

it('repeats a question answered incorrectly thrice in a row at the end of the session', () => {
    const questions = randomQuestions();
    const component = render(Session, { questions: questions }, defaultProps);

    // Answer the first question correctly, for some reason :)
    clickAnswerAndDismissOverlay(component);

    // Answer the second question wrong three times in a row
    const theDifficultQuestion = getQuestion(component);
    clickWrongAnswerAndDismissOverlay(component);
    clickWrongAnswerAndDismissOverlay(component);
    clickWrongAnswerAndDismissOverlay(component);

    // Answer the rest of the questions correctly
    for (let i = 2; i < questions.length; i++) {
        clickAnswerAndDismissOverlay(component);
    }

    const lastQuestion = getQuestion(component);
    expect(lastQuestion).toBe(theDifficultQuestion);
});

it('calls back with a report when the session is finished', () => {
    const onFinishedMock = jest.fn();

    const questions = randomQuestions(3);
    const component = render(
        Session,
        {
            questions: questions,
            onSessionFinished: onFinishedMock,
        },
        defaultProps
    );

    const report = new Map();
    for (let i = 0; i < questions.length; i++) {
        const q = getQuestion(component);
        if (i % 2 === 0) {
            report.set(q, []);
            clickAnswerAndDismissOverlay(component);
        } else {
            const button = clickWrongAnswerAndDismissOverlay(component);
            const answer = getAllRenderedStrings(button)[0];
            const emotion = q.answers.find(a => a.name === answer);
            report.set(q, [emotion]);
            clickAnswerAndDismissOverlay(component);
        }
    }

    jest.runAllTimers();
    expect(onFinishedMock).toHaveBeenCalledWith(report);
});

it('shows how many questions are left', () => {
    const questions = randomQuestions(5);
    const component = render(Session, { questions }, defaultProps);

    let questionProgress = findChildren(component, QuestionProgress)[0];

    expect(questionProgress.props).toMatchObject({
        current: 1,
        total: questions.length,
    });
    for (let i = 0; i < questions.length - 1; i++) {
        clickAnswerAndDismissOverlay(component);

        questionProgress = findChildren(component, QuestionProgress)[0];
        expect(questionProgress.props).toMatchObject({
            current: i + 2,
            total: questions.length,
        });
    }
});

it('increases the number of questions left after three wrong answers', () => {
    const questions = randomQuestions(5);
    const component = render(Session, { questions }, defaultProps);

    const prevTotal = findChildren(component, QuestionProgress)[0].props.total;

    clickWrongAnswerAndDismissOverlay(component);
    clickWrongAnswerAndDismissOverlay(component);
    clickWrongAnswerAndDismissOverlay(component);

    const currentTotal = findChildren(component, QuestionProgress)[0].props.total;
    expect(currentTotal).toBe(prevTotal + 1);
});

it('invokes the backend facade on correct answers', () => {
    const backendFacade = {
        registerCorrectAnswer: promiseMock(),
    };
    const questions = randomQuestions(1);
    const component = render(
        Session,
        {
            questions,
            backendFacade,
        },
        defaultProps
    );

    clickAnswerAndDismissOverlay(component);
    expect(backendFacade.registerCorrectAnswer).toHaveBeenCalledTimes(1);
    expect(backendFacade.registerCorrectAnswer).toHaveBeenCalledWith(questions[0]);
});

it('invokes the backend facade on wrong answers', () => {
    const backendFacade = {
        registerIncorrectAnswer: promiseMock(),
    };
    const questions = randomQuestions(1);
    const component = render(
        Session,
        {
            questions,
            backendFacade,
        },
        defaultProps
    );

    const b = clickWrongAnswerAndDismissOverlay(component);
    const answer = getAllRenderedStrings(b)[0];

    expect(backendFacade.registerIncorrectAnswer).toHaveBeenCalledTimes(1);
    expect(backendFacade.registerIncorrectAnswer).toHaveBeenCalledWith(
        questions[0],
        expect.objectContaining({ name: answer })
    );
});

it('has an abort button that asks to abort the session when tapped', () => {
    Alert.alert = jest.fn();

    const component = render(Session, {}, defaultProps);
    expect(component).toHaveChild(AbortSessionButton);

    const abortButton = findChildren(component, AbortSessionButton)[0];
    const touchable = findChildren(abortButton, TouchableOpacity)[0];

    touchable.props.onPress();
    expect(Alert.alert).toHaveBeenCalledWith(
        'Abort session?',
        expect.anything(),
        expect.anything(),
        { cancelable: true }
    );
});

it('ask to abort when the back button is pressed', () => {
    Alert.alert = jest.fn();

    const component = render(Session, {}, defaultProps);

    BackHandler.mockPressBack();

    expect(Alert.alert).toHaveBeenCalledWith(
        'Abort session?',
        expect.anything(),
        expect.anything(),
        { cancelable: true }
    );
});

it('aborts the session when the abort confirm is tapped', () => {
    let abortYes = null;
    Alert.alert = (_1, _2, buttons) => {
        abortYes = buttons.find(b => b.text === 'Yes');
    };

    const props = {
        navigation: {
            dispatch: jest.fn(),
            addListener: jest.fn(),
        },
    };
    const component = render(Session, props, defaultProps);
    const abortButton = findChildren(component, AbortSessionButton)[0];
    let touchable = findChildren(abortButton, TouchableOpacity)[0];
    touchable.props.onPress();

    expect(abortYes).not.toBeNull();
    abortYes && abortYes.onPress();

    expect(props.navigation.dispatch).toHaveResetTo('Home');
});

function promiseMock() {
    return jest.fn().mockReturnValue(new Promise(() => {}));
}
