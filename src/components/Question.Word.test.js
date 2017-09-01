// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EmotionWordQuestionComponent } from './Question.Word.js';

it('contains the question text', () => {
    const question = {
        type: 'word-question',
        questionText: 'THE QUESTION',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(component).toHaveChildMatching(child => {
        return typeof child === 'string' && child.indexOf(question.questionText) > -1;
    });
});

it('contains the answer', () => {
    const question = {
        type: 'word-question',
        questionText: 'THE QUESTION',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(JSON.stringify(component)).toContain(question.answer);
});

function render(props) {
    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EmotionWordQuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}
