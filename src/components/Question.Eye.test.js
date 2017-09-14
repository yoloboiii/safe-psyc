// @flow

import React from 'react';
import { EyeQuestionComponent, EyeQuestionOverlay } from './Question.Eye.js';
import { randomQuestion, randomEyeQuestion, randomEyeQuestions } from '../../tests/question-utils.js';
import { render, renderShallow } from '../../tests/render-utils.js';
import { findChildren } from '../../tests/component-tree-utils.js';
import { Image } from 'react-native';
import { answerService } from '../services/answer-service.js';
import { MockSessionService } from '../../tests/MockSessionService.js';

import type { Question } from '../models/questions.js';

it('contains the image', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = customRender({ question: question });

    expect(component).toHaveChildMatching(child => {
        return child.props && child.props.source && child.props.source.uri === question.image;
    });
});

it('contains the answer', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = customRender({ question: question });

    expect(JSON.stringify(component)).toContain(question.answer);
});

function customRender(customProps) {
    const question = customProps.question || randomQuestion();
    const defaultProps = {
        question: question,
        answers: answerService.getAnswersTo(question, 3),
        onCorrectAnswer: () => {},
        onWrongAnswer: () => {},
    };

    return renderShallow(EyeQuestionComponent, customProps, defaultProps);
}

it('shows the image of the answer in the overlay - image exists', () => {
    const questionPool = randomEyeQuestions(10);
    const askedQuestion = questionPool[3];
    const answeredQuestion = questionPool[5];

    const component = render(EyeQuestionOverlay, {
        text: 'hai',
        answeredCorrectly: false,
        question: askedQuestion,
        answer: answeredQuestion.answer,
        sessionService: new MockSessionService(((questionPool: any): Array<Question>)),
    });

    const images = findChildren(component, Image)
        .map(img => img.props.source.uri);
    expect(images).toEqual(expect.arrayContaining([answeredQuestion.image]));
});

it('shows the image of the answer in the overlay - image doesn\'t exists', () => {
    const askedQuestion = randomEyeQuestion(0);
    const questionPool = [askedQuestion];
    const answeredQuestion = randomEyeQuestion(1);

    expect(askedQuestion.image).not.toEqual(answeredQuestion.image);

    const component = render(EyeQuestionOverlay, {
        text: 'hai',
        answeredCorrectly: false,
        question: askedQuestion,
        answer: answeredQuestion.answer,
        sessionService: new MockSessionService(questionPool),
    });

    expect(component).not.toHaveChild(Image);
});

