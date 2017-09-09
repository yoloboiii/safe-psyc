// @flow

import type { Question } from '../models/questions.js';

class SessionService {

    getRandomQuestions(numQuestions: number): Array<Question> {
        const questions = [];
        for (let i = 0; i < numQuestions; i++) {
            questions.push(this._createRandomQuestion(i));
        }
        return questions;
    }

    _createRandomQuestion(seed) {
        const uniqueString = 'THIS IS THE QUESTION TEXT ' + seed;
        return {
            type: 'word-question',
            questionText: uniqueString,
            answer: 'ans-' + uniqueString,
        };
    }
}

export const sessionService = new SessionService();
