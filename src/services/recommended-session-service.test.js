// @flow

import { randomQuestion } from '../../tests/question-utils.js';
import { recommendedSessionService } from './recommended-session-service.js';

it('gives a higher score for a hard question than an easy question when they were answered at the same time', () => {
    const easyQuestion = randomQuestion();
    const hardQuestion = randomQuestion();

    const when = new Date(new Date() - 10);

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

    const easyScore = recommendedSessionService._calculateScore([easyDataPoint]);
    const hardScore = recommendedSessionService._calculateScore([hardDataPoint]);

    // $FlowFixMe
    expect(hardScore).toBeGreaterThan(easyScore);
});

it('gives a higher score for an easy question not seen in a long time than a hard question recently answered', () => {
    const easyQuestion = randomQuestion();
    const hardQuestion = randomQuestion();

    const longAgo = new Date(new Date() - 100000);
    const recently = new Date(new Date() - 10);

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

    const easyScore = recommendedSessionService._calculateScore([easyDataPoint]);
    const hardScore = recommendedSessionService._calculateScore([hardDataPoint]);

    // $FlowFixMe
    expect(easyScore).toBeGreaterThan(hardScore);
});
