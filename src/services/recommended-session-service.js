// @flow

import { log } from './logger.js';
import { answerService } from './answer-service.js';

import type { Emotion } from '../models/emotion.js';
import type { Question } from '../models/questions.js';
import type { AnswerService } from './answer-service.js';

type DataPoint = {
        question: Question,
        wrongAnswers: number,
        when: Date,
}
export class RecommendedSessionService {

    _emotionPool = undefined;
    _answerService: AnswerService;

    constructor(answerService: AnswerService) {
        this._answerService = answerService;
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
                log.debug('Didn\'t have enough data to calculate a score for', question);
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

    getEmotionPool(): Array<Emotion> {
        if (this._emotionPool === undefined) {
            this._emotionPool = require('../../SECRETS/emotions.json');
            this._answerService.setAnswerPool(this._emotionPool);
        }

        // $FlowFixMe
        return this._emotionPool;
    }
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

export const recommendedSessionService = new RecommendedSessionService(answerService);
