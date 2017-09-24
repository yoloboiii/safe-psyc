// @flow

import type { Question } from '../src/models/questions.js';

export class MockSessionService {

    _questionPool: Array<Question>;

    constructor(pool: Array<Question>) {
        this._questionPool = pool;
    }

    getRandomQuestions(numQuestions: number): Array<Question> {
        return getRandomElementsFromArray(numQuestions, this.getQuestionPool());
    }

    getQuestionPool(): Array<Question> {
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
