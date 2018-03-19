// @flow

import React from 'react';
import { StandardButton } from '../src/components/Buttons.js';
import { QuestionComponent, ResultOverlay } from '../src/components/Question.js';
import { getChildrenAndParent, findChildren, findFirstChild, getAllRenderedStrings } from './component-tree-utils.js';
import { randomEmotion, randomEmotionWithImage, randomEmotions, randomEmotionWithCoordinates } from './emotion-utils.js';
import { Emotion } from '../src/models/emotion.js';
import uuid from 'uuid';

import type { Question, EyeQuestion, EmotionWordQuestion, IntensityQuestion } from '../src/models/questions.js';

export function randomEyeQuestions(numberOfQuestions:number = 10): Array<EyeQuestion> {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        qs.push(randomEyeQuestion(i.toString()));
    }
    return qs;
}

export function randomEyeQuestion(c?: string): EyeQuestion {
    c = c === undefined ? uuid.v4() : c;
    const uniqueString = 'THIS IS THE QUESTION TEXT '+c;
    const answer = randomEmotionWithImage('ans' + uniqueString);
    const answers = randomEmotions(2);
    answers.push(answer);
    return {
        type: 'eye-question',
        image: 'image' + c,
        correctAnswer: answer,
        answers: answers,
    };
}

export function randomWordQuestions(numberOfQuestions:number = 10): Array<EmotionWordQuestion> {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        qs.push(randomWordQuestion(i.toString()));
    }
    return qs;
}

export function randomWordQuestion(c?: string): EmotionWordQuestion {
    c = c === undefined ? uuid.v4() : c;
    const uniqueString = 'THIS IS THE QUESTION TEXT '+c;
    const answer = randomEmotion('ans' + uniqueString);
    const answers = randomEmotions(2);
    answers.push(answer);
    return {
        type: 'word-question',
        questionText: uniqueString,
        correctAnswer: answer,
        answers: answers,
    };
}

export function randomIntensityQuestion(): IntensityQuestion {
    const answer = randomEmotionWithCoordinates();
    const refPoints = new Map();
    refPoints.set(1, randomEmotionWithCoordinates());
    refPoints.set(3, randomEmotionWithCoordinates());
    refPoints.set(5, randomEmotionWithCoordinates());
    return {
        type: 'intensity',
        correctAnswer: answer,
        referencePoints: refPoints,
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
            const isAnswer = getAllRenderedStrings(b)
                .find(s => s.indexOf('ans') >= 0);

            return isAnswer;
        })[0];


    correctAnswerButton.props.onPress();
    return correctAnswerButton;
}

function findAnswerButtons(component: React.Component<*,*>): Array<React.Component<*,*>> {
    const qComponent = findFirstChild(component, QuestionComponent);
    const buttons = findChildren(qComponent, StandardButton);

    if (buttons.length === 0) {
        console.log('Found no buttons');
    }

    return buttons;
}

export function clickWrongAnswer(component: React.Component<*,*>) {
    const buttons = findAnswerButtons(component);
    const wrongAnswerButton = buttons
        .filter(b => {
            const isAnswer = getAllRenderedStrings(b)
                .find(s => s.indexOf('ans') >= 0);

           return !isAnswer;
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
    const buttons = findChildren(overlay, StandardButton);
    buttons.forEach( button => {
        button.props.onPress && button.props.onPress();
    });
}

export function clickWrongAnswerAndDismissOverlay(component: React.Component<*,*>) {
    const button = clickWrongAnswer(component);
    dismissOverlay(component);
    return button;
}
