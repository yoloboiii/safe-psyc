// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EyeQuestionComponent } from './Question.Eye.js';
import { randomQuestion } from '../../tests/question-utils.js';
import { answerService } from '../services/answer-service.js';

it('contains the image', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(component).toHaveChildMatching(child => {
        return child.props.source && child.props.source.uri === question.image;
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
    const question = customProps.question || randomQuestion();
    const defaultProps = {
        question: question,
        answers: answerService.getAnswersTo(question, 3),
        onCorrectAnswer: () => {},
        onWrongAnswer: () => {},
    };
    const props = Object.assign({}, defaultProps, customProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EyeQuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}
