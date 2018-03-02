// @flow

import React from 'react';
import { render, renderShallow } from '../../tests/render-utils.js';
import {
    randomQuestion,
    randomWordQuestion,
    randomEyeQuestion,
    clickAnswer,
    clickWrongAnswer,
} from '../../tests/question-utils.js';
import { randomEmotion } from '../../tests/emotion-utils.js';
import {
    getChildrenAndParent,
    findChildren,
    stringifyComponent,
    getAllRenderedStrings,
} from '../../tests/component-tree-utils.js';
import { Text } from 'react-native';
import { StandardButton } from './Buttons.js';

import { QuestionComponent, ResultOverlay } from './Question.js';
import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { answerService } from '../services/answer-service.js';

import type { Props as QuestionProps } from './Question.js';

it('renders without crashing', () => {
    const anyQuestion = randomQuestion();
    const component = renderShallow(QuestionComponent, props({ question: anyQuestion }));
    expect(component).toBeTruthy();
});

it('renders eye questions', () => {
    const question = randomEyeQuestion();
    const component = renderShallow(QuestionComponent, props({ question: question }));

    expect(component).toHaveChildWithProps(EyeQuestionComponent, {
        question: question,
    });
    expect(component).not.toHaveChild(EmotionWordQuestionComponent);
});

it('renders word questions', () => {
    const question = randomWordQuestion();
    const component = renderShallow(QuestionComponent, props({ question: question }));

    expect(component).toHaveChildWithProps(EmotionWordQuestionComponent, {
        question: question,
    });
    expect(component).not.toHaveChild(EyeQuestionComponent);
});

it('renders an overlay indicating that the answer was correct if the correct answer is given', () => {
    const component = render(QuestionComponent, props({ question: randomQuestion() }));
    clickAnswer(component);

    const overlay = findChildren(component, ResultOverlay)[0];
    expect(overlay).toBeDefined();

    const textNodes = findChildren(overlay, Text);
    expect(
        textNodes.some(n => {
            // $FlowFixMe
            const t = n.rendered.rendered[0];
            return t.toLowerCase().indexOf('correct') > -1;
        })
    ).toBe(true);
});

it('renders an overlay indicating that the answer was incorrect if the wrong answer is given', () => {
    const component = render(QuestionComponent, props({ question: randomQuestion() }));
    clickWrongAnswer(component);

    const overlay = findChildren(component, ResultOverlay)[0];
    expect(overlay).toBeDefined();

    const textNodes = findChildren(overlay, Text);
    expect(
        textNodes.some(n => {
            // $FlowFixMe
            const t = n.rendered.rendered[0];
            return t.toLowerCase().indexOf('incorrect') > -1;
        })
    ).toBe(true);
});

it('has a button that triggers onCorrectAnswer in the overlay', () => {
    const onCorrectAnswer = jest.fn();
    const onWrongAnswer = jest.fn();
    const component = render(
        QuestionComponent,
        props({
            question: randomQuestion(),
            onCorrectAnswer: onCorrectAnswer,
            onWrongAnswer,
            onWrongAnswer,
        })
    );

    clickAnswer(component);

    expect(onCorrectAnswer).not.toHaveBeenCalled();

    const overlay = findChildren(component, ResultOverlay)[0];
    const buttons = findChildren(overlay, StandardButton);
    buttons.forEach(button => {
        button.props.onPress && button.props.onPress();
    });

    expect(onCorrectAnswer).toHaveBeenCalledTimes(1);
    expect(onWrongAnswer).not.toHaveBeenCalled();
});

it('has a button that triggers onWrongAnswer in the overlay', () => {
    const onCorrectAnswer = jest.fn();
    const onWrongAnswer = jest.fn();

    const question = randomQuestion();
    const answer = randomEmotion();
    // $FlowFixMe
    question.answers = [answer];

    const component = render(
        QuestionComponent,
        props({
            question: question,
            onCorrectAnswer: onCorrectAnswer,
            onWrongAnswer,
            onWrongAnswer,
        })
    );

    clickWrongAnswer(component);

    expect(onWrongAnswer).not.toHaveBeenCalled();

    const overlay = findChildren(component, ResultOverlay)[0];
    const buttons = findChildren(overlay, StandardButton);
    buttons.forEach(button => {
        button.props.onPress && button.props.onPress();
    });

    expect(onWrongAnswer).toHaveBeenCalledTimes(1);
    expect(onWrongAnswer).toHaveBeenCalledWith(answer);
    expect(onCorrectAnswer).not.toHaveBeenCalled();
});

it('contains the clicked text in the overlay - correct', () => {
    const question = randomQuestion();
    const component = render(QuestionComponent, props({ question }));

    const button = clickAnswer(component);
    const overlay = findChildren(component, ResultOverlay)[0];

    const s = getAllRenderedStrings(overlay);
    expect(s).toEqual(expect.arrayContaining([expect.stringContaining(button.props.title)]));
});

it('contains the clicked text in the overlay - wrong', () => {
    const question = randomQuestion();
    const component = render(QuestionComponent, props({ question }));

    const button = clickWrongAnswer(component);
    const overlay = findChildren(component, ResultOverlay)[0];

    const s = getAllRenderedStrings(overlay);
    expect(s).toEqual(expect.arrayContaining([expect.stringContaining(button.props.title)]));
});

function props(customProps: $Shape<QuestionProps>) {
    const question = customProps.question || randomQuestion();
    const defaultProps = {
        question: question,
        onCorrectAnswer: () => {},
        onWrongAnswer: () => {},
    };

    return Object.assign({}, defaultProps, customProps);
}
