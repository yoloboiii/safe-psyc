// @flow

import React from 'react';
import { EyeQuestionComponent, EyeQuestionOverlay } from './Question.Eye.js';
import { randomQuestion, randomEyeQuestion, randomEyeQuestions } from '../../tests/question-utils.js';
import { randomEmotionWithImage, randomEmotionWithoutImage } from '../../tests/emotion-utils.js';
import { render, renderShallow } from '../../tests/render-utils.js';
import { findChildren } from '../../tests/component-tree-utils.js';
import { Image } from 'react-native';
import { answerService } from '../services/answer-service.js';
import { MockSessionService } from '../../tests/MockSessionService.js';

import type { Question } from '../models/questions.js';

it('contains the image', () => {
    const question = randomEyeQuestion();
    const component = customRender({ question: question });

    expect(component).toHaveChildMatching(child => {
        return child.props && child.props.source && child.props.source.uri === question.image;
    });
});

it('contains the answer', () => {
    const question = randomEyeQuestion();
    const component = customRender({ question: question });

    expect(JSON.stringify(component)).toContain(question.correctAnswer.name);
});

function customRender(customProps) {
    const question = customProps.question || randomQuestion();
    const defaultProps = {
        question: question,
        answers: question.answers,
        onCorrectAnswer: () => {},
        onWrongAnswer: () => {},
    };

    return renderShallow(EyeQuestionComponent, customProps, defaultProps);
}

it('shows the image of the answer in the overlay - image exists', () => {
    const askedQuestion = randomQuestion();
    const answer = randomEmotionWithImage();

    const component = render(EyeQuestionOverlay, {
        text: 'hai',
        answeredCorrectly: false,
        question: askedQuestion,
        answer: answer,
    });

    const images = findChildren(component, Image)
        .map(img => img.props.source.uri);
    expect(images).toEqual(expect.arrayContaining([answer.image]));
});

it('shows the image of the answer in the overlay - image doesn\'t exists', () => {
    const askedQuestion = randomEyeQuestion();
    const answer = randomEmotionWithoutImage();

    expect(askedQuestion.correctAnswer.image).not.toEqual(answer.image);

    const component = render(EyeQuestionOverlay, {
        answeredCorrectly: false,
        question: askedQuestion,
        answer: answer,
    });

    expect(component).not.toHaveChild(Image);
});

it('Pressing the emotion name navigates to the emotion details', () => {
    expect(true).toBe(false);
});

it('has a link to a textual description of the emotion in the overlay', () => {
    expect(true).toBe(false);
});

