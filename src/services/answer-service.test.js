// @flow

import React from 'react';
import { answerService } from './answer-service.js';
import { randomEmotion, randomEmotions } from '../../tests/emotion-utils.js';

const emotion = randomEmotion();

it('includes the correct answer', () => {
    const answers = answerService.getAnswersTo(emotion, 3);
    expect(answers).toContain(emotion);
});

it('gives fewer answers if the pool is too small', () => {
    answerService.setAnswerPool(randomEmotions(1));

    const answers = answerService.getAnswersTo(emotion, 3);
    expect(answers.length).toBe(2);
});

it('gives the correct number of answers', () => {
    answerService.setAnswerPool(randomEmotions(4));

    expect(answerService.getAnswersTo(emotion, 0).length).toBe(0);
    expect(answerService.getAnswersTo(emotion, 1).length).toBe(0);

    expect(answerService.getAnswersTo(emotion, 2).length).toBe(2);
    expect(answerService.getAnswersTo(emotion, 3).length).toBe(3);
    expect(answerService.getAnswersTo(emotion, 4).length).toBe(4);

    expect(answerService.getAnswersTo(emotion, 40).length).toBe(5);
});

it('includes each answer only once', () => {
    answerService.setAnswerPool(randomEmotions(5));
    for (let i = 0; i < 10000; i++) {
        const answers = answerService.getAnswersTo(emotion, 3);
        expect(answers).not.toContainDuplicates();
    }
});
