// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EyeQuestionComponent } from './Question.Eye.js';
import { answerService } from '../services/answer-service.js';

answerService.setAnswerPool(['a', 'b', 'c', 'd', 'e']);

it('contains the image', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(component).toHaveChildMatching(child => {
        // $FlowFixMe
        const imageSource = require('test-image.png');
        return child.props.source === imageSource;
    });
});

it('contains the answer', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(JSON.stringify(component)).toContain(question.answer);
});

function render(customProps) {
    const defaultProps = {
        answerService: answerService,
        onCorrectAnswer: () => {},
        onWrongAnswer: () => {},
    };
    const props = Object.assign({}, defaultProps, customProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EyeQuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}
