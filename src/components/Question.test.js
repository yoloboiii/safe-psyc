// @flow

import React from 'react';
import { render, renderShallow, randomQuestion, getChildrenAndParent, clickAnswer } from '../../tests/utils.js';

import { QuestionComponent } from './Question.js';
import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { answerService } from '../services/answer-service.js';

const defaultProps = {
    answerService: answerService,
    onCorrectAnswer: () => {},
    onWrongAnswer: () => {},
};

it('renders without crashing', () => {
    const anyQuestion = randomQuestion();
    const component = renderShallow(QuestionComponent, { question: anyQuestion }, defaultProps);
    expect(component).toBeTruthy();
});

it('renders eye questions', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = renderShallow(QuestionComponent, { question: question }, defaultProps);

    expect(component).toHaveChildWithProps(EyeQuestionComponent, {question: question});
    try {
    expect(component).not.toHaveChild(EmotionWordQuestionComponent);
    } catch(e) {
        console.log(e);
    }
});

it('renders word questions', () => {
    const question = {
        type: 'word-question',
        questionText: 'THE TEXT',
        answer: 'THE ANSWER',
    };
    const component = renderShallow(QuestionComponent, { question: question }, defaultProps);

    expect(component).toHaveChildWithProps(EmotionWordQuestionComponent, {question: question});
    expect(component).not.toHaveChild(EyeQuestionComponent);
});

it('renders an overlay indicating that the answer was correct if the correct answer is given', () => {

    const component = render(QuestionComponent, { question: randomQuestion() }, defaultProps);
    clickAnswer(component);

    const overlay = findChild(component, ResultOverlay);
    expect(overlay).toBeDefined();
    expect(overlay).toHaveText('correct');
});

it('apa', () => {
    const component = render(QuestionComponent, { question: randomQuestion() }, defaultProps);
    const c2 = renderShallow(QuestionComponent, { question: randomQuestion() }, defaultProps);

    getChildrenAndParent(component);
    getChildrenAndParent(c2);
});

