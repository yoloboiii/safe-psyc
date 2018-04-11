// @flow

import { AnswerService } from '~/src/services/answer-service.js';

import { randomSessionService, RandomSessionService } from './random-session-service.js';

import { randomQuestion } from '~/tests/question-utils.js';
import { randomEmotionWithCoordinates, randomEmotions } from '~/tests/emotion-utils.js';

import type { WordQuestion } from '~/src/models/questions.js';

it('returns the correct number of random questions', () => {
    expect(randomSessionService.getRandomQuestions(0).length).toBe(0);
    expect(randomSessionService.getRandomQuestions(1).length).toBe(1);
    expect(randomSessionService.getRandomQuestions(10).length).toBe(10);
});

it('includes each random question only once', () => {
    for (let i = 0; i < 100; i++) {
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
    // These intensities have to match the intensities selected by
    // the service. TODO: write test for that
    const intensities = [1, 5, 10];
    const pool = [];
    for (let i = 0; i < 50; i++) {
        const e = randomEmotionWithCoordinates();
        const intensityIndex = i % intensities.length;
        e.coordinates = {
            intensity: intensities[intensityIndex],
            polar: 1,
        };

        pool.push(e);
    }

    const service = serviceWithEmotionPool(pool);

    const questions = service.getRandomQuestions(10).filter(q => q.type === 'intensity');
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
        // $FlowFixMe
        expect(question.referencePoints.size).toBe(3);
    }
});

it('contains more eye questions than intensity questions', () => {
    for (let i = 0; i < 100; i++) {
        const questions = randomSessionService.getRandomQuestions(10);

        const eyeCount = questions.filter(q => q.type === 'eye-question').reduce(acc => acc + 1, 0);

        const intensityCount = questions
            .filter(q => q.type === 'intensity')
            .reduce(acc => acc + 1, 0);

        expect(eyeCount).toBeGreaterThan(0);
        expect(intensityCount).toBeGreaterThan(0);

        expect(eyeCount).toBeGreaterThan(intensityCount);
    }
});

it('doesn\'t include intensity questions with bad reference points', () => {
    // from a pool with only two emotions no intensity questions will have enough
    // reference points
    const pool = [
        randomEmotionWithCoordinates(),
        randomEmotionWithCoordinates(),
    ];

    const service = serviceWithEmotionPool(pool);
    const intensityQuestions = service.getRandomQuestions(10).filter(q => q.type === 'intensity');

    expect(intensityQuestions).toEqual([]);
});

it('shuffles the questions', () => {
    const numberOfQuestionTypes = 3;

    let passed = false;
    for(let i=0; i < 100; i++) {
        const questions = randomSessionService.getRandomQuestions(10);

        let lastType = questions[0].type;
        let changes = 0;
        for (const q of questions) {
            if (q.type !== lastType) {
                changes++;
            }
            lastType = q.type;
        }

        if (changes > numberOfQuestionTypes - 1) {
            passed = true;
        }
    }

    if (!passed) throw new Error('The questions were not shuffled');
});

it('includes word questions in the session', () => {
    const questions = serviceWithEmotionPool(randomEmotions(10)).getRandomQuestions(10);
    const types = questions.map(q => q.type);

    expect(types).toContain('word-question');
});

it('gives some answers to the word question', () => {
    const wordQuestion = getWordQuestion();

    expect(wordQuestion.answers.length).toBeGreaterThan(0);
});

it('phrases the word questions reasonably', () => {
    const wordQuestion = getWordQuestion('foo');

    // ends with a question mark
    expect(wordQuestion.questionText).toEqual(expect.stringMatching(/\?$/));

    // contains the description of the correct answer, this is what the user is supposed to connect to
    // the emotion name
    expect(wordQuestion.questionText).toEqual(expect.stringContaining(wordQuestion.correctAnswer.description));

    // it does not contain the correct answer in the question text
    expect(wordQuestion.questionText).not.toEqual(expect.stringContaining(wordQuestion.correctAnswer.name));
});

function serviceWithEmotionPool(pool) {

    const answerService = new AnswerService(pool);
    const emotionService = {
        getEmotionPool: () => pool,
    };

    // $FlowFixMe
    return new RandomSessionService(answerService, emotionService);
}

function getWordQuestion(name?: string): WordQuestion {
    const questions = serviceWithEmotionPool(randomEmotions(10)).getRandomQuestions(10);
    const wordQuestion = questions.find(q => q.type === 'word-question');
    if (!wordQuestion) throw new Error("Found no word questions");

    return ((wordQuestion:any): WordQuestion);
}
