// @flow

import React from 'react';
import { render, renderShallow } from '../../tests/render-utils.js';
import { randomQuestion, clickAnswer, clickWrongAnswer } from '../../tests/question-utils.js';
import { getChildrenAndParent, findChildren, stringifyComponent, getAllRenderedStrings } from '../../tests/component-tree-utils.js';
import { Text, Button } from 'react-native';

import { QuestionComponent, ResultOverlay } from './Question.js';
import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { answerService } from '../services/answer-service.js';

const defaultProps = {
    question: randomQuestion(),
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

    const textNodes = findChildren(overlay, Text);
    expect(textNodes.some(n => {
        // $FlowFixMe
        const t = n.rendered.rendered[0];
        return t.toLowerCase().indexOf('incorrect') > -1;
    })).toBe(true);
});

it('has a button that triggers onCorrectAnswer in the overlay', () => {
    const onCorrectAnswer = jest.fn();
    const onWrongAnswer = jest.fn();
    const component = render(QuestionComponent, {
        question: randomQuestion(),
        onCorrectAnswer: onCorrectAnswer,
        onWrongAnswer, onWrongAnswer,
    }, defaultProps);

    clickAnswer(component);

    expect(onCorrectAnswer).not.toHaveBeenCalled();

    const overlay = findChildren(component, ResultOverlay)[0];
    const buttons = findChildren(overlay, Button);
    buttons.forEach( button => {
        button.props.onPress && button.props.onPress();
    });

    expect(onCorrectAnswer).toHaveBeenCalledTimes(1);
    expect(onWrongAnswer).not.toHaveBeenCalled();
});

it('has a button that triggers onWrongAnswer in the overlay', () => {
    const onCorrectAnswer = jest.fn();
    const onWrongAnswer = jest.fn();
    const component = render(QuestionComponent, {
        question: randomQuestion(),
        onCorrectAnswer: onCorrectAnswer,
        onWrongAnswer, onWrongAnswer,
    }, defaultProps);

    const button = clickWrongAnswer(component);

    expect(onWrongAnswer).not.toHaveBeenCalled();

    const overlay = findChildren(component, ResultOverlay)[0];
    const buttons = findChildren(overlay, Button);
    buttons.forEach( button => {
        button.props.onPress && button.props.onPress();
    });

    expect(onWrongAnswer).toHaveBeenCalledTimes(1);
    expect(onWrongAnswer).toHaveBeenCalledWith(button.props.title);
    expect(onCorrectAnswer).not.toHaveBeenCalled();
});

it('contains the clicked text in the overlay - correct', () => {
    const question = randomQuestion();
    const component = render(QuestionComponent, { question }, defaultProps);

    const button = clickAnswer(component);
    const overlay = findChildren(component, ResultOverlay)[0];

    const s = getAllRenderedStrings(overlay);
    expect(s).toEqual(
        expect.arrayContaining([
            expect.stringContaining(button.props.title)
        ])
    );
});

it('contains the clicked text in the overlay - wrong', () => {
    const question = randomQuestion();
    const component = render(QuestionComponent, { question }, defaultProps);

    const button = clickWrongAnswer(component);
    const overlay = findChildren(component, ResultOverlay)[0];

    const s = getAllRenderedStrings(overlay);
    expect(s).toEqual(
        expect.arrayContaining([
            expect.stringContaining(button.props.title)
        ])
    );
});
