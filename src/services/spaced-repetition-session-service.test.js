// @flow

import moment from 'moment';
import { randomEmotion } from '../../tests/emotion-utils.js';
import { SpacedRepetitionSessionService, calculateDueDate, beginningOfTime } from './spaced-repetition-session-service.js';
import { EmotionService } from './emotion-service.js';
import { AnswerService } from './answer-service.js';

import type { AnswerBackendFacade } from './answer-backend.js';

describe('spaced repetition', () => {

    it('passes test scenario one', () => {
        // First time user, nothing has been answered
        const answerHistory = {
            'happy': [],
            'jolly': [],
            'content': [],
        };

        return getQuestions(answerHistory, 3)
            .then( questions => {

                const emotionNames = questions.map(q => q.correctAnswer.name);
                expect(emotionNames).toEqual(
                    expect.arrayContaining(['jolly', 'content', 'happy'])
                );
            });
    });

    it('passes test scenario two', () => {
        // Very good last session :) content is less learned than jolly which in turn
        // is less learned than happy
        const answerHistory = {
            'happy': [
                correctEyeAnswerAt(twoDaysAgo()),
                correctEyeAnswerAt(sixDaysAgo()),
                correctEyeAnswerAt(aWeekAgo()),
                correctEyeAnswerAt(aWeekAndAHalfAgo()),
            ],
            'jolly': [
                correctEyeAnswerAt(twoDaysAgo()),
                correctEyeAnswerAt(fiveDaysAgo()),
            ],
            'content': [
                correctEyeAnswerAt(twoDaysAgo()),
            ],
        };

        return getQuestions(answerHistory, 3)
            .then( questions => {
                const emotionNames = questions.map(q => q.correctAnswer.name);
                expect(emotionNames).toEqual(['content', 'jolly', 'happy']);
            });
    });

    fit('passes test scenario three', () => {
        // Happy is learned and pretty stable, time to bring in another emotion
        // jolly was just incorrectly answered so should have a higher prio
        const answerHistory = {
            'happy-eye': [
                correctEyeAnswerAt(twoDaysAgo()),
                correctEyeAnswerAt(fiveDaysAgo()),
            ],
            'happy-intensity': [
                correctIntensityAnswerAt(aWeekAgo()),
                correctIntensityAnswerAt(aWeekAndAHalfAgo()),
            ],
            'jolly-eye': [
                incorrectEyeAnswerAt(twoDaysAgo()),
                correctEyeAnswerAt(fiveDaysAgo()),
            ],
            'content-eye': [],
        };

        return getQuestions(answerHistory, 3)
            .then( questions => {
                const emotionNames = questions.map(q => q.correctAnswer.name);
                expect(emotionNames).toEqual(['jolly-eye', 'content-eye', 'happy']);
            });
    });

    it('passes test scenario four', () => {
        // Happy is about to be learned, so it should have higher prio than
        // a new emotion.

        const answerHistory = {
            'happy': [
                correctEyeAnswerAt(twoDaysAgo()),
                correctEyeAnswerAt(fiveDaysAgo()),
            ],
            'jolly': [
                incorrectEyeAnswerAt(twoDaysAgo()),
                correctEyeAnswerAt(fiveDaysAgo()),
            ],
            'content': [],
        };

        return getQuestions(answerHistory, 3)
            .then( questions => {
                const emotionNames = questions.map(q => q.emotion.name);
                expect(emotionNames).toEqual(['jolly', 'happy', 'content']);
            });
    });

    function getQuestions(answerHistory, numQuestions) {
        const emotions = {};
        Object.keys(answerHistory).forEach(emotionName => {
            emotions[emotionName] = randomEmotion(emotionName);
        });

        const map = new Map();
        Object.keys(answerHistory).forEach(emotionName => {

            const answers = answerHistory[emotionName].map(a => {
                return {
                    ...a,
                    emotion: emotions[emotionName],
                    questionType: 'eye-question',
                };
            });
            map.set(emotionName, answers);
        });


        const answerBackendFacade = (({
            getLastTwoAnswersToAllQuestions: () => Promise.resolve(map),
        }: any): AnswerBackendFacade);

        const answerService = new AnswerService();
        const emotionService =  new EmotionService(Object.values(emotions));

        const service = new SpacedRepetitionSessionService(
            answerBackendFacade,
            answerService,
            emotionService
        );
        return service.getQuestions(numQuestions);
    }

    it('returns the correct number of random questions', () => {
        expect(true).toBe(false);
    });

    it('shuffles the questions', () => {
        expect(true).toBe(false);
    });

    it('contains more eye questions than intensity questions', () => {
        expect(true).toBe(false);
    });

    it('includes each question only once', () => {
        expect(true).toBe(false);
    });
});

describe('calculateDueDate', () => {
    it('returns the beginning of time for unanswered questions', () => {
        expect(calculateDueDate([])).toEqualDate(beginningOfTime);
    });

    it('returns close to but sooner than the beginning of time for questions answered once', () => {
        const answers = [
            {
                correct: true,
                when: moment('2000-01-01 00:00:00'),
            },
        ];

        const dueDate = calculateDueDate(answers);

        // $FlowFixMe
        const diff = dueDate - beginningOfTime;
        expect(diff).toBeGreaterThan(0);
        expect(diff).toBeLessThan(moment.duration(2, 'days').asMilliseconds());
    });

    it('returns the beginning of time for questions just answered wrongly', () => {
        const answers = [
            {
                correct: false,
                when: moment(),
            },
        ];

        const dueDate = calculateDueDate(answers);
        expect(dueDate).toEqualDate(beginningOfTime);
    });

    it('handles the second last answer being wrong as if the question was answered once', () => {
        const answers = [
            {
                correct: false,
                when: moment('2000-01-01 00:00:00'),
            },
            {
                correct: true,
                when: moment('2000-01-01 01:00:00'),
            },
        ];

        const dueDate = calculateDueDate(answers);

        // $FlowFixMe
        const diff = dueDate - beginningOfTime;
        expect(diff).toBeGreaterThan(0);
        expect(diff).toBeLessThan(moment.duration(2, 'days').asMilliseconds());
    });

    it('scales the interval between the last two correct answer', () => {
        const lastCorrectAnswer = correctEyeAnswerAt('2000-01-01 00:00:00');
        const secondLastCorrectAnswer = correctEyeAnswerAt(
            moment(lastCorrectAnswer.when).subtract(1, 'h')
        );

        const expectedInterval = moment.duration({ hours: 1, minutes: 12 });
        const expectedDueDate = moment(lastCorrectAnswer.when).add(expectedInterval);

        const actualDueDate = calculateDueDate([lastCorrectAnswer, secondLastCorrectAnswer]);

        expect(actualDueDate).toEqualDate(expectedDueDate);
    });

    it('gives answered questions a sooner due date than unanswered questions', () => {
        const unansweredDueDate = calculateDueDate([]);
        const answeredDueDate = calculateDueDate(correctAnswers([aFewDaysAgo(), aboutAMonthAgo()]));

        const now = moment();
        expect(answeredDueDate).toBeCloserTo(now, {
            than: unansweredDueDate,
        });
    });
});

function correctAnswers(dates) {
    return dates.map(d => correctEyeAnswerAt(d));
}

function correctEyeAnswerAt(date) {
    return {
        correct: true,
        when: moment(date),
        questionType: 'eye-question',
    };
}

function incorrectEyeAnswerAt(date) {
    return {
        correct: false,
        when: moment(date),
        questionType: 'eye-question',
    };
}

function correctIntensityAnswerAt(date) {
    return {
        correct: true,
        when: moment(date),
        questionType: 'intensity',
    };
}

function aFewDaysAgo() {
    return moment().subtract(3, 'days');
}

function aboutAMonthAgo() {
    return moment().subtract(32, 'days');
}

function twoDaysAgo() {
    return moment().subtract(2, 'days');
}

function fiveDaysAgo() {
    return moment().subtract(5, 'days');
}

function sixDaysAgo() {
    return moment().subtract(6, 'days');
}

function aWeekAgo() {
    return moment().subtract(1, 'weeks');
}

function aWeekAndAHalfAgo() {
    return moment().subtract({ weeks: 1, days: 3 });
}
