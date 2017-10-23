// @flow

import { answerService } from './answer-service.js';
import { emotionService } from './emotion-service.js';
import { ReferencePointService } from './reference-point-service.js';
import { knuthShuffle } from 'knuth-shuffle';

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

        return knuthShuffle(questions);
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
