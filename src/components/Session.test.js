// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { Session } from './Session.js';
import { QuestionComponent } from './Question.js';
import { getChildrenAndParent } from '../../tests/toHaveMatcher.js';
import { Button } from 'react-native';

it('shows an error screen if no questions are given', () => {
    const questions = [];
    const component = render({ questions: questions });

    expect(component).toContainStrings('no', 'question');
    expect(component).not.toHaveChild(QuestionComponent);
});

it('starts by showing a question', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(component).toHaveChild(QuestionComponent);
});

it.only('shows another question when the first is answered', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    const firstQuestion = getQuestion(component);
    clickAnswer(component);
    const secondQuestion = getQuestion(component);

    expect(secondQuestion).not.toBe(firstQuestion);
});

it('shows all questions eventually', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

it('doesn\'t repeat correctly answered questions', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

it('repeats an incorrectly answered question immediately', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

it('repeats a question answered incorrectly thrice in a row at the end of the session', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

function render(props) {
    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<Session {...props} />);
    return shallowRenderer.getRenderOutput();
}

function randomQuestions() {
    const qs = [];
    for (let i = 0; i < 10; i++) {
        qs.push(createRandomQuestion());
    }
    return qs;
}

function createRandomQuestion() {
    const uniqueString = '';
    return {
        type: 'word-question',
        questionText: uniqueString,
        answer: 'ans-' + uniqueString,
    };
}

function getQuestion(component) {
    const questions = getChildrenAndParent(component)
        .map(c => c.props)
        .filter(p => p.question)

    return questions[0];
}

function clickAnswer(component) {
    const qComponent = getChildrenAndParent(component)
        .filter(c => c.type === QuestionComponent)[0];

    const buttons = getChildrenAndParent(qComponent)
        .filter(c => {
            console.log(c);
            return c.type === Button;
        });

    console.log(qComponent);
    console.log(buttons);
    const correctAnswerButton = buttons[0];
    correctAnswerButton.click();

}
