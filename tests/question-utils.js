// @flow

import React from 'react';
import { Button } from 'react-native';
import { QuestionComponent, ResultOverlay } from '../src/components/Question.js';
import { getChildrenAndParent, findChildren } from './component-tree-utils.js';

import type { Question } from '../src/models/questions.js';

export function randomQuestions(numberOfQuestions:number = 10): Array<Question> {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        qs.push(randomQuestion(i));
    }
    return qs;
}

export function randomQuestion(c: number=0): Question {
    const uniqueString = 'THIS IS THE QUESTION TEXT '+c;
    return {
        type: 'word-question',
        questionText: uniqueString,
        answer: 'ans-' + uniqueString,
    };
}

export function getQuestion(component: React.Component<*,*>) {
    const questions = getChildrenAndParent(component)
        // $FlowFixMe
        .filter(c => c.type && c.type.name === 'QuestionComponent')
        .map(c => c.props)
        .filter(p => p && p.question)
        .map(p => p.question);

    return questions[0];
}

export function clickAnswer(component: React.Component<*,*>) {
    const buttons = findAnswerButtons(component);
    const correctAnswerButton = buttons
        .filter(b => {
            return b.props.title.indexOf('ans') > -1;
        })[0];

    correctAnswerButton.props.onPress();
}

function findAnswerButtons(component: React.Component<*,*>): Array<React.Component<*,*>> {
    const qComponent = getChildrenAndParent(component)
        .filter(c => {
            // $FlowFixMe
            return c.type === QuestionComponent;
        })[0];

    const buttons = getChildrenAndParent(qComponent)
        .filter(c => {
            // $FlowFixMe
            return c.type === Button;
        });

    if (buttons.length === 0) {
        console.log('Found no buttons');
    }

    return buttons;
}

export function clickWrongAnswer(component: React.Component<*,*>) {
    const buttons = findAnswerButtons(component);
    const wrongAnswerButton = buttons
        .filter(b => {
           return b.props.title.indexOf('ans') === -1;
        })[0];


    wrongAnswerButton.props.onPress();
}

export function clickAnswerAndDismissOverlay(component: React.Component<*,*>) {
    clickAnswer(component);
    dismissOverlay(component);
}

function dismissOverlay(component) {
    const overlay = findChildren(component, ResultOverlay)[0];
    const buttons = findChildren(overlay, Button);
    buttons.forEach( button => {
        button.props.onPress && button.props.onPress();
    });
}

export function clickWrongAnswerAndDismissOverlay(component: React.Component<*,*>) {
    clickWrongAnswer(component);
    dismissOverlay(component);
}
