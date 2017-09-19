// @flow

import React from 'react';
import { Button } from 'react-native';
import { QuestionComponent, ResultOverlay } from '../src/components/Question.js';
import { getChildrenAndParent, findChildren } from './component-tree-utils.js';

import type { Question, EyeQuestion, EmotionWordQuestion } from '../src/models/questions.js';

export function randomEyeQuestions(numberOfQuestions:number = 10): Array<EyeQuestion> {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        qs.push(randomEyeQuestion(i));
    }
    return qs;
}

export function randomEyeQuestion(c?: number): EyeQuestion {
    c = c === undefined ? Math.random() : c;
    const uniqueString = 'IMAGE-'+c;
    return {
        type: 'eye-question',
        image: uniqueString,
        answer: 'ans-' + uniqueString,
    };
}

export function randomWordQuestions(numberOfQuestions:number = 10): Array<EmotionWordQuestion> {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        qs.push(randomWordQuestion(i));
    }
    return qs;
}

export function randomWordQuestion(c?: number): EmotionWordQuestion {
    c = c === undefined ? Math.random() : c;
    const uniqueString = 'THIS IS THE QUESTION TEXT '+c;
    return {
        type: 'word-question',
        questionText: uniqueString,
        answer: 'ans-' + uniqueString,
    };
}

export function randomQuestions(numberOfQuestions:number = 10) {
    return randomWordQuestions(numberOfQuestions);
}

export function randomQuestion(): Question {
    return randomWordQuestion();
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
    return correctAnswerButton;
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
    return wrongAnswerButton;
}

export function clickAnswerAndDismissOverlay(component: React.Component<*,*>) {
    const button = clickAnswer(component);
    dismissOverlay(component);
    return button;
}

function dismissOverlay(component) {
    const overlay = findChildren(component, ResultOverlay)[0];
    const buttons = findChildren(overlay, Button);
    buttons.forEach( button => {
        button.props.onPress && button.props.onPress();
    });
}

export function clickWrongAnswerAndDismissOverlay(component: React.Component<*,*>) {
    const button = clickWrongAnswer(component);
    dismissOverlay(component);
    return button;
}
