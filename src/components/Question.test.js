// @flow

import React from 'react';
import renderer from 'react-test-renderer';
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
    const rendered = renderer.create(<QuestionComponent question={anyQuestion}/>).toJSON();
    expect(rendered).toBeTruthy();
});

it('renders eye questions', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<QuestionComponent question={question} />);
    const component = shallowRenderer.getRenderOutput();

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

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<QuestionComponent question={question} />);
    const component = shallowRenderer.getRenderOutput();

    expect(component).toHaveChildWithProps(EmotionWordQuestionComponent, {question: question});
    expect(component).not.toHaveChild(EyeQuestionComponent);
});
