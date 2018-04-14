// @flow

import { AnswerService } from '~/src/services/answer-service.js';
import { NumberOfQuestionsService } from '~/src/services/number-of-questions-service.js';
import { EmotionService } from '~/src/services/emotion-service.js';

import { randomSessionService, RandomSessionService } from './random-session-service.js';

import { randomQuestion } from '~/tests/question-utils.js';
import { randomEmotionWithCoordinates, randomEmotions, randomEmotionsWithAll } from '~/tests/emotion-utils.js';
import { newConfigBackendMock } from '~/tests/MockConfigBackendFacade.js';

import type { WordQuestion } from '~/src/models/questions.js';
import type { Config } from '~/src/services/number-of-questions-service.js';

it('returns the correct number of random questions', () => {
    return Promise.all([
        serviceWithConfig({
                numberOfQuestionsPerSession: 0,
        }).getRandomQuestions()
            .then( questions => {
                expect(questions.length).toBe(0);
            }),

        serviceWithConfig({
                numberOfQuestionsPerSession: 1,
        }).getRandomQuestions()
            .then( questions => {
                expect(questions.length).toBe(1);
            }),

        serviceWithConfig({
                numberOfQuestionsPerSession: 10,
        }).getRandomQuestions()
            .then( questions => {
                expect(questions.length).toBe(10);
            }),
    ]);
});

it('includes each random question only once', () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
        const promise = randomSessionService.getRandomQuestions()
            .then( questions => {
                expect(questions).not.toContainDuplicates();
            });

        promises.push(promises);
    }

    return Promise.all(promises);
});

it('converts image paths to something that can be shown in the app', () => {
    return randomSessionService.getRandomQuestions()
        .then( questions => {
            expect(questions.some(q => q.type === 'eye-question')).toBe(true);

            for (const question of questions) {
                if (question.type === 'eye-question') {
                    expect(question.image).toEqual(expect.stringMatching(/^data\:image\//));
                }
            }
        });
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

    return service.getRandomQuestions()
        .then( questions => {
            const intensityQuestions = questions.filter(q => q.type === 'intensity');
            expect(intensityQuestions.length).toBeGreaterThan(0);
            for (const question of intensityQuestions) {
                // $FlowFixMe
                expect(question.referencePoints.size).toBe(3);
            }
        });
});

it('doesn\'t include intensity questions with bad reference points', () => {
    // from a pool with only two emotions no intensity questions will have enough
    // reference points
    const pool = [
        randomEmotionWithCoordinates(),
        randomEmotionWithCoordinates(),
    ];

    const service = serviceWithEmotionPool(pool);

    return service.getRandomQuestions()
        .then( questions => {
            const intensityQuestions = questions.filter(q => q.type === 'intensity');
            expect(intensityQuestions).toEqual([]);
        });
});

it('shuffles the questions', () => {
    const numberOfQuestionTypes = 3;

    const promises = [];
    for(let i=0; i < 100; i++) {

        const promise = randomSessionService.getRandomQuestions()
            .then( questions => {

                let lastType = questions[0].type;
                let changes = 0;
                for (const q of questions) {
                    if (q.type !== lastType) {
                        changes++;
                    }
                    lastType = q.type;
                }

                return changes > numberOfQuestionTypes - 1
            });

        promises.push(promise)
    }

    // as long as one test iteration passed we're good!
    return Promise.all(promises)
        .then( results => results.reduce((a,b) => a || b, false))
        .then( passed => {
            if (!passed) throw new Error('The questions were not shuffled');
        });
});

it('includes word questions in the session', () => {
    return serviceWithEmotionPool(randomEmotions(10)).getRandomQuestions()
        .then( questions => {
            const types = questions.map(q => q.type);
            expect(types).toContain('word-question');
        });
});

it('gives some answers to the word question', () => {
    return getWordQuestion('foo')
        .then( wordQuestion => {
            expect(wordQuestion.answers.length).toBeGreaterThan(0);
        });
});

function serviceWithConfig(config: $Shape<Config>) {

    const pool = randomEmotionsWithAll(10);
    const answerService = new AnswerService(pool);
    const emotionService: EmotionService = ({
        getEmotionPool: () => pool,
    }: any);
    const configBackend = newConfigBackendMock(config);
    const numQuestionsService = new NumberOfQuestionsService(configBackend);

    return new RandomSessionService(answerService, emotionService, numQuestionsService);
}

function serviceWithEmotionPool(pool) {

    const answerService = new AnswerService(pool);
    const emotionService: EmotionService = ({
        getEmotionPool: () => pool,
    }: any);
    const configBackend = newConfigBackendMock();
    const numQuestionsService = new NumberOfQuestionsService(configBackend);

    return new RandomSessionService(answerService, emotionService, numQuestionsService);
}

function getWordQuestion(name?: string): Promise<WordQuestion> {
    return serviceWithEmotionPool(randomEmotions(10)).getRandomQuestions()
        .then( questions => {
            const wordQuestion = questions.find(q => q.type === 'word-question');
            if (!wordQuestion) throw new Error("Found no word questions");

            return ((wordQuestion:any): WordQuestion);
        });
}
