// @flow

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