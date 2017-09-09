// @flow

import React from 'react';
import { render, renderShallow, randomQuestion, getChildrenAndParent, clickAnswer, clickWrongAnswer, findChildren, stringifyComponent } from '../../tests/utils.js';
import { Text } from 'react-native';

import { QuestionComponent, ResultOverlay } from './Question.js';
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
    expect(component).not.toHaveChild(EmotionWordQuestionComponent);
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

    const overlay = findChildren(component, ResultOverlay)[0];
    expect(overlay).toBeDefined();

    // $FlowFixMe
    const textNodes = findChildren(overlay, Text);
    expect(textNodes.some(n => {
        // $FlowFixMe
        const t = n.rendered.rendered[0];
        return t.toLowerCase().indexOf('correct') > -1;
    })).toBe(true);
});

it('renders an overlay indicating that the answer was incorrect if the wrong answer is given', () => {

    const component = render(QuestionComponent, { question: randomQuestion() }, defaultProps);
    clickWrongAnswer(component);

    const overlay = findChildren(component, ResultOverlay)[0];
    expect(overlay).toBeDefined();

    // $FlowFixMe
    const textNodes = findChildren(overlay, Text);
    expect(textNodes.some(n => {
        // $FlowFixMe
        const t = n.rendered.rendered[0];
        return t.toLowerCase().indexOf('incorrect') > -1;
    })).toBe(true);
});

