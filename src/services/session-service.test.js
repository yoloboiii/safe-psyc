// @flow

import { randomQuestion } from '../../tests/question-utils.js';
import { sessionService } from './session-service.js';

it('returns the correct number of random questions', () => {
    expect(sessionService.getRandomQuestions(0).length).toBe(0);
    expect(sessionService.getRandomQuestions(1).length).toBe(1);
    expect(sessionService.getRandomQuestions(10).length).toBe(10);
});

it('includes each random question only once', () => {
    for (let i=0; i<100; i++) {
        const questions = sessionService.getRandomQuestions(10);
        expect(questions).not.toContainDuplicates();
    }
});

it('converts image paths to something that can be shown in the app', () => {
    const questions = sessionService.getRandomQuestions(10);

    expect(questions.some(q => q.type === 'eye-question')).toBe(true);

    for (const question of questions) {
        if (question.type === 'eye-question') {
            expect(question.image).toEqual(expect.stringMatching(/^data\:image\//));
        }
    }
});

it('gives a higher score for a hard question than an easy question when they were answered at the same time', () => {
    const easyQuestion = randomQuestion();
    const hardQuestion = randomQuestion();

    const when = new Date() - 10;

    const easyDataPoint = {
        question: easyQuestion,
        wrongAnswers: 0,
        when: when,
    };

    const hardDataPoint = {
        question: hardQuestion,
        wrongAnswers: 10,
        when: when,
    };

    const easyScore = sessionService._calculateScore([easyQuestion]);
    const hardScore = sessionService._calculateScore([hardQuestion]);

    // $FlowFixMe
    expect(hardScore).toBeGreaterThan(easyScore);
});

it('gives a higher score for an easy question not seen in a long time than a hard question recently answered', () => {
    const easyQuestion = randomQuestion();
    const hardQuestion = randomQuestion();

    const longAgo  = new Date() - 100000;
    const recently = new Date() - 10;

    const easyDataPoint = {
        question: easyQuestion,
        wrongAnswers: 0,
        when: longAgo,
    };

    const hardDataPoint = {
        question: hardQuestion,
        wrongAnswers: 10,
        when: recently,
    };

    const easyScore = sessionService._calculateScore([easyQuestion]);
    const hardScore = sessionService._calculateScore([hardQuestion]);

    // $FlowFixMe
    expect(easyScore).toBeGreaterThan(hardScore);
});
