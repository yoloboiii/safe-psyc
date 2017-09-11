// @flow

import { knuthShuffle } from 'knuth-shuffle';
import type { Question } from '../models/questions';

export class AnswerService {

    _answerPool: Array<string>;

    constructor(pool?: Array<string>) {
        this._answerPool = pool || [];
    }

    getAnswersTo(question: Question, numAnswers: number): Array<string> {
        const answers = this._getRandomAnswersFromPool(numAnswers, question.answer);

        return answers;
    }

    _getRandomAnswersFromPool(numAnswers: number, alwaysInclude: string): Array<string> {
        const poolCopy = this._answerPool.slice();

        // Remove the answer to always include it it's in the pool.
        const apa = poolCopy.indexOf(alwaysInclude);
        if (apa > -1) {
            poolCopy.splice(apa, 1);
        }

        const answers = [];
        for (let i = 0; i < numAnswers - 1 && poolCopy.length > 0; i++) {
            const rnd = Math.floor(Math.random() * poolCopy.length);

            const answer = poolCopy[rnd];
            answers.push(answer);

            poolCopy.splice(rnd, 1);
        }

        if (answers.length > 0) {
            answers.push(alwaysInclude);
            knuthShuffle(answers);
        }

        return answers;
    }

    setAnswerPool(pool: Array<string>) {
        this._answerPool = pool;
    }
}

export const answerService = new AnswerService();
