// @flow

import { answerService } from './answer-service.js';
import { emotionService } from './emotion-service.js';
import { ReferencePointService } from './reference-point-service.js';
import { knuthShuffle } from 'knuth-shuffle';
import { generateEyeQuestion, generateIntensityQuestion } from '../utils/question-utils.js';

import type { Emotion } from '../models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion } from '../models/questions.js';
import type { AnswerService } from './answer-service.js';
import type { EmotionService } from './emotion-service.js';

export class RandomSessionService {
    _answerService: AnswerService;
    _emotionService: EmotionService;
    _referencePointService: ReferencePointService;

    constructor(answerService: AnswerService, emotionService: EmotionService) {
        this._answerService = answerService;

        this._emotionService = emotionService;
        this._referencePointService = new ReferencePointService(this.getEmotionPool());

        this._answerService.setAnswerPool(this.getEmotionPool());
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
        const emotionsWithCoordinates = getRandomElementsFromArray(
            numIntensityQuestions,
            this.getEmotionPool().filter(e => !!e.coordinates)
        );

        const questions = [];
        for (const emotion of emotionsWithImage) {
            questions.push(generateEyeQuestion(emotion, this._answerService));
        }

        for (const emotion of emotionsWithCoordinates) {
            questions.push(generateIntensityQuestion(emotion, this._referencePointService));
        }

        return knuthShuffle(questions);
    }

    getEmotionPool(): Array<Emotion> {
        return this._emotionService.getEmotionPool();
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

export const randomSessionService = new RandomSessionService(answerService, emotionService);
