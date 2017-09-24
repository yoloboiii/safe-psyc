// @flow

import type { Question } from '../models/questions.js';

type DataPoint = {
        question: Question,
        wrongAnswers: number,
        when: Date,
}
export class SessionService {

    _questionPool = undefined;

    getRandomQuestions(numQuestions: number): Array<Question> {
        return getRandomElementsFromArray(numQuestions, this.getQuestionPool());
    }

    getRecommendedQuestions(numQuestions: number): Array<Question> {
        // Get this data from somewhere
        const data: Map<Question, Array<DataPoint>> = new Map();

        const sortableData: Array<{q: Question, score: number}> = [];
        data.forEach((dataPoints, question) => {
            const score = this._calculateScore(dataPoints);

            if (score) {
                sortableData.push({q: question, score});
            } else {
                console.log('Didn\'t have enough data to calculate a score for', question);
            }
        });


        sortableData.sort((a, b) => {
            return a[1] - b[1];
        });
        return sortableData.slice(0, numQuestions).map(obj => obj.q);
    }

    _calculateScore(dataPoints: Array<DataPoint>): ?number {
        if (dataPoints.length === 0) {
            // IMPORTANT for some reason I don't remember :)
            return null;
        }

        const now = new Date();
        let score = 0;
        for (const dataPoint of dataPoints) {
            const timeSince = now - dataPoint.when;

            score += scaleForTime(dataPoint.wrongAnswers, timeSince);
            score += timePenalty(timeSince);
        }

        return score;
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

function scaleForTime(num: number, timeSince: number): number {
    return num * sigmoid(-num/20);
}

function timePenalty(timeSince: number): number {
    return timeSince;
}

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

export const sessionService = new SessionService();
