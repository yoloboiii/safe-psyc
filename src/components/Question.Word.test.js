// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { getChildren } from '../../tests/toHaveMatcher.js';
import { answerService } from '../services/answer-service.js';

answerService.setAnswerPool(['a', 'b', 'c', 'd', 'e']);

const defaultQuestion = {
    type: 'word-question',
    questionText: 'THE QUESTION',
    answer: 'THE ANSWER',
};

it('contains the question text', () => {
    const question = defaultQuestion;
    const component = render({ question: question });

    expect(component).toHaveChildMatching(child => {
        return typeof child === 'string' && child.indexOf(question.questionText) > -1;
    });
});

it('contains the answer', () => {
    const question = defaultQuestion;
    const component = render({ question: question });

    expect(getAnswers(component)).toContain(question.answer);
});

it('contains three answers', () => {
    const question = defaultQuestion;
    const component = render({ question: question });

    const answers = getAnswers(component);
    expect(answers.length).toBe(3);
});

it('contains wrong answers', () => {
    const question = defaultQuestion;
    const component = render({ question: question });

    const answers = getAnswers(component);
    expect(answers).toContainElementsOtherThan(question.answer);
});

function render(customProps) {
    const defaultProps = {
        onCorrectAnswer: () => {},
    };
    const props = Object.assign({}, customProps, defaultProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EmotionWordQuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}

function getAnswers(root) {
    const answers = getChildren(root)
        .filter(child => {
            return child.type && child.type.name === 'ButtonList';
        })
        .map(b =>
            b.props.buttons.map(b => b.text)
        );

    const flattenedAnswers = [].concat.apply([], answers);
    return flattenedAnswers;
}
