// @flow

import moment from 'moment';
import { randomEmotion } from '../../tests/emotion-utils.js';
import { beginningOfTime, calculateDueDate } from './spaced-repetition-session-service.js';

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
        const lastCorrectAnswer = correctAnswerWithDate('2000-01-01 00:00:00');
        const secondLastCorrectAnswer = correctAnswerWithDate(
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
    return dates.map(d => correctAnswerWithDate(d));
}

function correctAnswerWithDate(date) {
    return {
        correct: true,
        when: moment(date),
    };
}

function aFewDaysAgo() {
    return moment().subtract(3, 'days');
}

function aboutAMonthAgo() {
    return moment().subtract(32, 'days');
}
