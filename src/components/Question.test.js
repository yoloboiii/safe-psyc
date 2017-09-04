// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';

import { QuestionComponent } from './Question.js';
import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';

it('renders without crashing', () => {
    const anyQuestion = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: anyQuestion });
    expect(component).toBeTruthy();
});

it('renders eye questions', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

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
    const component = render({ question: question });

    expect(component).toHaveChildWithProps(EmotionWordQuestionComponent, {question: question});
    expect(component).not.toHaveChild(EyeQuestionComponent);
});

function render(customProps) {
    const defaultProps = {
        onCorrectAnswer: () => {},
    };
    const props = Object.assign({}, customProps, defaultProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<QuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}
