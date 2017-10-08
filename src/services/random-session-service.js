// @flow

import { answerService } from './answer-service.js';
import { ReferencePointService } from './reference-point-service.js';

import type { Emotion } from '../models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion } from '../models/questions.js';
import type { AnswerService } from './answer-service.js';

export class RandomSessionService {

    _emotionPool = undefined;
    _answerService: AnswerService;
    _referencePointService: ReferencePointService;

    constructor(answerService: AnswerService) {
        this._answerService = answerService;
    }

    getRandomQuestions(numQuestions: number): Array<Question> {
        const minNumEye = Math.min(numQuestions / 2 + 1, numQuestions);
        const minNumIntensity = Math.floor(numQuestions * 0.3);
        const numEyeQuestions = Math.max(
            0,
            Math.floor(Math.random() * (numQuestions / 2 - minNumIntensity)) + minNumEye
        );
        const numIntensityQuestions = numQuestions - numEyeQuestions;

        const emotionsWithImage = getRandomElementsFromArray(
            numEyeQuestions,
            this.getEmotionPool().filter(e => !!e.image)
        );
        const emotionsWithIntensity = getRandomElementsFromArray(
            numIntensityQuestions,
            this.getEmotionPool().filter(e => !!e.intensity)
        );


        const questions = [];
        for (const emotion of emotionsWithImage) {
            questions.push(this._generateEyeQuestion(emotion));
        }

        for (const emotion of emotionsWithIntensity) {
            questions.push(this._generateIntensityQuestion(emotion));
        }

        return questions;
    }

    _generateEyeQuestion(emotion: Emotion): EyeQuestion {
        const image = emotion.image;
        if (!image) {
            throw Error('Attempted to create eye question from emotion without image. ' + emotion.name);
        }

        return {
            type: 'eye-question',
            correctAnswer: emotion,
            answers: this._answerService.getAnswersTo(emotion, 3),
            image: image,
        };
    }

    _generateIntensityQuestion(emotion: Emotion): IntensityQuestion {
        return {
            type: 'intensity',
            correctAnswer: emotion,
            referencePoints: this._referencePointService.getReferencePointsTo(emotion),
        };
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
