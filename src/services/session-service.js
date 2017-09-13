// @flow

import type { Question } from '../models/questions.js';

class SessionService {

    _questionPool = undefined;

    getRandomQuestions(numQuestions: number): Array<Question> {
        return getRandomElementsFromArray(numQuestions, this.getQuestionPool());
    }

    getQuestionPool(): Array<Question> {
        if (this._questionPool === undefined) {
            this._questionPool = require('../../SECRETS/eye-questions/eye-questions.json');
        }

        return this._questionPool;
    }
}

function getRandomElementsFromArray<T>(numElements: number, array: Array<T>): Array<T> {
    const poolCopy = array.slice();

    const elements = [];
    for (let i = 0; i < numElements && poolCopy.length > 0; i++) {
        const rnd = Math.floor(Math.random() * poolCopy.length);

        elements.push(poolCopy[rnd]);

        poolCopy.splice(rnd, 1);
    }

    return elements;
}


export const sessionService = new SessionService();
