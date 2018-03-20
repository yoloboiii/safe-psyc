// @flow

import React from 'react';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { VerticalAnswerList } from '../VerticalAnswerList.js';
import { findChild, findFirstByTestId, stringifyComponent } from '../../../../../tests/component-tree-utils.js';
import { randomWordQuestion } from '../../../../../tests/question-utils.js';
import { answerService } from '../../../../services/answer-service.js';
import { render } from '../../../../../tests/render-utils.js';

const defaultProps = {
    onCorrectAnswer: () => {},
    onWrongAnswer: () => {},
    navigation: jest.fn(),
};

it('contains the question text', () => {
    const question = randomWordQuestion();
    const component = render(EmotionWordQuestionComponent, { question: question }, defaultProps);

    const questionTextComponent = findFirstByTestId(component, 'question-text');
    expect(questionTextComponent).toContainString(question.questionText);
});

it('contains the answer', () => {
    const question = randomWordQuestion();
    const component = render(EmotionWordQuestionComponent, { question: question }, defaultProps);

    expect(getAnswers(component)).toContain(question.correctAnswer);
});

it('contains wrong answers', () => {
    const question = randomWordQuestion();
    const component = render(EmotionWordQuestionComponent, { question: question }, defaultProps);

    const answers = getAnswers(component);
    expect(answers).toContainElementsOtherThan(question.correctAnswer);
});

function getAnswers(root) {
    return findChild(root, VerticalAnswerList)
       .props.answers;
}
