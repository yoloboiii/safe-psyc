// @flow

import React from 'react';
import { answerService } from './answer-service.js';
import { randomQuestion } from '../../tests/question-utils.js';

const question = randomQuestion();

it('includes the correct answer', () => {
    const answers = answerService.getAnswersTo(question, 3);
    expect(answers).toContain(question.answer);
});

it('gives fewer answers if the pool is too small', () => {
    answerService.setAnswerPool(['a']);

    const answers = answerService.getAnswersTo(question, 3);
    expect(answers.length).toBe(2);
});

it('gives the correct number of answers', () => {
    answerService.setAnswerPool(['a', 'b', 'c', 'd']);

    expect(answerService.getAnswersTo(question, 0).length).toBe(0);
    expect(answerService.getAnswersTo(question, 1).length).toBe(0);

    expect(answerService.getAnswersTo(question, 2).length).toBe(2);
    expect(answerService.getAnswersTo(question, 3).length).toBe(3);
    expect(answerService.getAnswersTo(question, 4).length).toBe(4);

    expect(answerService.getAnswersTo(question, 40).length).toBe(5);
});

it('includes each answer only once', () => {
    answerService.setAnswerPool(['a', 'b', 'c', 'd', 'e']);
    for (let i=0; i<10000; i++) {
        const answers = answerService.getAnswersTo(question, 3);
        expect(answers).not.toContainDuplicates();
    }
});