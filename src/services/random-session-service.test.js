// @flow

import { randomQuestion } from '../../tests/question-utils.js';
import { randomEmotionWithIntensity } from '../../tests/emotion-utils.js';
import { randomSessionService, RandomSessionService } from './random-session-service.js';

it('returns the correct number of random questions', () => {
    expect(randomSessionService.getRandomQuestions(0).length).toBe(0);
    expect(randomSessionService.getRandomQuestions(1).length).toBe(1);
    expect(randomSessionService.getRandomQuestions(10).length).toBe(10);
});

it('includes each random question only once', () => {
    for (let i=0; i<100; i++) {
        const questions = randomSessionService.getRandomQuestions(10);
        expect(questions).not.toContainDuplicates();
    }
});

it('converts image paths to something that can be shown in the app', () => {
    const questions = randomSessionService.getRandomQuestions(10);

    expect(questions.some(q => q.type === 'eye-question')).toBe(true);

    for (const question of questions) {
        if (question.type === 'eye-question') {
            expect(question.image).toEqual(expect.stringMatching(/^data\:image\//));
        }
    }
});

it('generates three reference points to intensity questions', () => {
    const answerService = {
        setAnswerPool: jest.fn(),
        getAnswersTo: jest.fn(),
    };
    // $FlowFixMe
    const service = new RandomSessionService(answerService);

    // These intensities have to match the intensities selected by
    // the service. TODO: write test for that
    const intensities = [1, 5, 10];
    const pool = [];
    for (let i = 0; i < 50; i++) {
        const e = randomEmotionWithIntensity();
        const intensityIndex = i % intensities.length;
        e.intensity = intensities[intensityIndex];

        pool.push(e);
    }

    service._setEmotionPool(pool);


    const questions = service.getRandomQuestions(10);
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
        // $FlowFixMe
        expect(question.referencePoints.size).toBe(3);
    }
});

it('contains more eye questions than intensity questions', () => {
    const questions = randomSessionService.getRandomQuestions(10);

    const eyeCount = questions
        .filter(q => q.type === 'eye-question')
        .reduce((acc) => acc + 1, 0);

    const intensityCount = questions
        .filter(q => q.type === 'intensity')
        .reduce((acc) => acc + 1, 0);

    console.log(eyeCount, intensityCount);
    expect(eyeCount).toBeGreaterThan(0);
    expect(intensityCount).toBeGreaterThan(0);

    expect(eyeCount).toBeGreaterThan(intensityCount);
});