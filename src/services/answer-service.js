// @flow

import type { Question } from '../models/questions';

export interface AnswerService {
    getAnswersTo(Question, number): Array<string>;
    setAnswerPool(Array<string>): void;
}

class AnswerServiceImpl implements AnswerService {

    _answerPool: Array<string> = [];

    getAnswersTo(question: Question, numAnswers: number): Array<string> {
        const answers = this._getRandomAnswersFromPool(numAnswers - 1);

        if (numAnswers > 0) {
            answers.push(question.answer);
        }
        return answers;
    }

    _getRandomAnswersFromPool(numAnswers: number): Array<string> {
        const poolCopy = this._answerPool.slice();

        const answers = [];
        for (let i = 0; i < numAnswers && poolCopy.length > 0; i++) {
            const rnd = Math.floor(Math.random() * poolCopy.length);

            const answer = poolCopy[rnd];
            answers.push(poolCopy[rnd]);

            poolCopy.splice(rnd, 1);
        }

        return answers;
    }

    poolSize(): number {
        return this._answerPool.length;
    }

    setAnswerPool(pool: Array<string>) {
        this._answerPool = pool;
    }
}

export const answerService: AnswerService = new AnswerServiceImpl();
