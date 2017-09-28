// @flow

import { knuthShuffle } from 'knuth-shuffle';
import type { Emotion } from '../models/emotion.js';

export class AnswerService {

    _answerPool: Array<Emotion>;

    constructor(pool?: Array<Emotion>) {
        this._answerPool = pool || [];
    }

    getAnswersTo(emotion: Emotion, numAnswers: number): Array<Emotion> {
        const answers = this._getRandomAnswersFromPool(numAnswers, emotion);

        return answers;
    }

    _getRandomAnswersFromPool(numAnswers: number, alwaysInclude: Emotion): Array<Emotion> {
        const poolCopy = this._answerPool.slice();

        // Remove the answer to always include if it's in the pool.
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

    getAnswerPool(): Array<Emotion> {
        return this._answerPool.slice();
    }

    setAnswerPool(pool: Array<Emotion>) {
        this._answerPool = pool;
    }
}

export const answerService = new AnswerService();
