// @flow

import { answerService } from './answer-service.js';
import { ReferencePointService } from './reference-point-service.js';

import type { Emotion } from '../models/emotion.js';
import type { Question } from '../models/questions.js';
import type { AnswerService } from './answer-service.js';

export class RandomSessionService {

    _emotionPool = undefined;
    _answerService: AnswerService;
    _referencePointService: ReferencePointService;

    constructor(answerService: AnswerService) {
        this._answerService = answerService;
    }

    getRandomQuestions(numQuestions: number): Array<Question> {
        const emotionsToTest = getRandomElementsFromArray(numQuestions, this.getEmotionPool());

        const questions = [];
        for (const emotion of emotionsToTest) {
            questions.push(this._generateRandomQuestion(emotion));
        }
        return questions;
    }

    _generateRandomQuestion(emotion: Emotion): Question {
        const type = this._randomizeValidQuestionType(emotion);

        let question = {};
        // $FlowFixMe
        question.type = type;
        question.correctAnswer = emotion;
        question.answers = this._answerService.getAnswersTo(emotion, 3);

        switch(question.type) {
            case 'eye-question':
                question.image =  emotion.image;
            case 'intensity':
                question.referencePoints = this._referencePointService.getReferencePointsTo(question.correctAnswer);
        };

        return question;
    }

    _randomizeValidQuestionType(emotion) {
        const possibleQuestionTypes = [];
        if (emotion.image) {
            possibleQuestionTypes.push('eye-question');
        }
        if (emotion.intensity) {
            possibleQuestionTypes.push('intensity');
        }

        const rnd = Math.floor(Math.random() * possibleQuestionTypes.length);
        return possibleQuestionTypes[rnd];
    }

    getEmotionPool(): Array<Emotion> {
        if (this._emotionPool === undefined) {
            const emotions = require('../../SECRETS/emotions.json');
            this._setEmotionPool(emotions);
        }

        // $FlowFixMe
        return this._emotionPool;
    }

    _setEmotionPool(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool;
        this._answerService.setAnswerPool(emotionPool);
        this._referencePointService = new ReferencePointService(emotionPool);
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

export const randomSessionService = new RandomSessionService(answerService);
