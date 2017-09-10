// @flow

import React from 'react';
import { Session } from './Session.js';
import { answerService } from '../services/answer-service.js';
import { Button } from 'react-native';
import { QuestionComponent } from './Question.js';

import { render, renderShallow, randomQuestions, getQuestion, clickAnswerAndDismissOverlay, clickWrongAnswerAndDismissOverlay } from '../../tests/utils.js';


answerService.setAnswerPool(['a', 'b', 'c']);

const defaultProps = {
    onSessionFinished: () => {},
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
    const questions = randomQuestions(1);
    const sessionFinishedSpy = jest.fn();

    const component = render(Session, {
        questions: questions,
        onSessionFinished: sessionFinishedSpy,
    }, defaultProps);

    clickAnswerAndDismissOverlay(component);

    expect(sessionFinishedSpy.mock.calls.length).toBe(1);
});

it('shows all questions eventually', () => {
    const questions = randomQuestions();
    const component = render(Session, { questions: questions }, defaultProps);

    const seen = new Map();
    for (let i = 0; i < questions.length; i++) {
        const question = getQuestion(component);
        seen.set(question, true);
        clickAnswerAndDismissOverlay(component);
    }

    expect(seen.size).toBe(questions.length);
});

it('doesn\'t repeat correctly answered questions', () => {
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

