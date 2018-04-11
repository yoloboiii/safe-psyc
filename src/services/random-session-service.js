// @flow

import { knuthShuffle } from 'knuth-shuffle';

import { answerService } from '~/src/services/answer-service.js';
import { emotionService } from '~/src/services/emotion-service.js';
import { ReferencePointService } from '~/src/services/reference-point-service.js';
import { generateEyeQuestion, generateIntensityQuestion, generateWordQuestion } from '~/src/utils/question-utils.js';

import type { Emotion } from '~/src/models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion, WordQuestion } from '~/src/models/questions.js';
import type { AnswerService } from '~/src/services/answer-service.js';
import type { EmotionService } from '~/src/services/emotion-service.js';

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
        const numWordQuestions = Math.min(numQuestions, 1);
        const numIntensityQuestions = Math.min(numQuestions - numWordQuestions, 1);
        const numEyeQuestions = numQuestions - numIntensityQuestions - numWordQuestions;

        const questions = [];
        questions.push(...this._getEyeQuestions(numEyeQuestions));
        questions.push(...this._getIntensityQuestions(numIntensityQuestions));
        questions.push(...this._getWordQuestions(numWordQuestions));

        return knuthShuffle(questions);
    }

    getEmotionPool(): Array<Emotion> {
        return this._emotionService.getEmotionPool();
    }

    _getEyeQuestions(numEyeQuestions): Array<EyeQuestion> {
        const emotionsWithImage = getRandomElementsFromArray(
            numEyeQuestions,
            this.getEmotionPool().filter(e => !!e.image)
        );

        const questions = [];
        for (const emotion of emotionsWithImage) {
            questions.push(generateEyeQuestion(emotion, this._answerService));
        }

        return questions;
    }

    _getIntensityQuestions(numIntensityQuestions): Array<IntensityQuestion> {
        const questions = [];
        const emotionsWithCoordinates = knuthShuffle(this.getEmotionPool().filter(e => !!e.coordinates));

        for (let i=0; i<emotionsWithCoordinates.length && questions.length < numIntensityQuestions; i++) {
            const { question, isValid } = generateIntensityQuestion(emotionsWithCoordinates[i], this._referencePointService);

            if (isValid) {
                questions.push(question);
            }
        }

        return questions;
    }

    _getWordQuestions(numWordQuestions): Array<WordQuestion> {
        return getRandomElementsFromArray(numWordQuestions, this.getEmotionPool())
            .map(emotion => generateWordQuestion(emotion, this._answerService));
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
