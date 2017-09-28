// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { getChildrenAndParent } from '../../tests/component-tree-utils.js';
import { randomWordQuestion } from '../../tests/question-utils.js';
import { answerService } from '../services/answer-service.js';

const defaultQuestion = randomWordQuestion();

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

    expect(getAnswers(component)).toContain(question.correctAnswer);
});

it('contains wrong answers', () => {
    const question = defaultQuestion;
    const component = render({ question: question });

    const answers = getAnswers(component);
    expect(answers).toContainElementsOtherThan(question.correctAnswer);
});

function render(customProps) {
    const question = customProps.question || randomWordQuestion();
    const defaultProps = {
        question: question,
        answers: question.answers,
        onCorrectAnswer: () => {},
        onWrongAnswer: () => {},
    };
    const props = Object.assign({}, defaultProps, customProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EmotionWordQuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}

function getAnswers(root) {
    const answers = getChildrenAndParent(root)
        .filter(child => {
            // $FlowFixMe
            return child.type && child.type.name === 'VerticalAnswerList';
        })
        .map(b => b.props.answers);

    const flattenedAnswers = [].concat.apply([], answers);
    return flattenedAnswers;
}
